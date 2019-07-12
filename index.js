require('dotenv').config();
const webSocketsServerPort = 5000;
const webSocketServer = require('websocket').server;
const http = require('http');

var db
const PORT=5000	
const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const app = express();

require('./staticEndpoints/pressure-endpoints.js')(app, db);
require('./staticEndpoints/temperature-endpoints.js')(app, db);
require('./staticEndpoints/sound-endpoints.js')(app, db);


const temperatureDatabase = require("./sensorDatabase/temperature-database")
const pressureDatabase = require("./sensorDatabase/pressure-database")
const soundDatabase = require("./sensorDatabase/temperature-database")

const alarmSender = require('./responses/runAlarm.js')

const exhaustSender = require('./responses/runExhaust.js')
const path = require('path');

var uri = 'mongodb://localhost:27017/sensorDatabase';
const dbName = 'sensorApi';

const server = http.createServer(app);
var pressureAlarmExplicitlyOff = false
var airExhaustExplicitlyOff = false

var sensorState = require("./sensorState.js");
const constants = require('./projectConstants.js')

const wsServer = new webSocketServer({
  httpServer: server,
  path: "/echo"
});

const connections = {
    SENSOR: "sensor",
    CLIENT: "client",
    ALARM: "alarm"
}

sensors = {}
clients = {}
alarms = {}
// Generates unique ID for every new connection
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

function broadcastMessageToClients(data) {
    Object.keys(clients).map((client) => {
        clients[client].sendUTF(data);
    });
}

function broadcastAlarm(updateMessage) {
    Object.keys(alarms).map((alarm) => {
        alarms[alarm].send(JSON.stringify({
            device: constants.alarmType.ALARM,
            status: 1,
            sensor: updateMessage.sensorType
        }));
    });
}

function broadcastExhaust(updateMessage) {
    Object.keys(sensors).map((sensor) => {
        sensors[sensor].sendUTF(JSON.stringify({
            device: constants.alarmType.EXHAUST,
            status: 1,
            sensor: updateMessage.sensorType
        }));
    });
}
function errorPrint() {
    console.log("***************************************")
    console.log("***************************************")
    console.log("************ERROR OCCURED**************")
    console.log("***************************************")
    console.log("***************************************")
}

var currentXs = [[]]
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var connectionType = request.resourceURL.query.connectionType
    var userId = getUniqueID();
    console.log(connectionType);
    console.log(connection.remoteAddresses)
    if(connectionType == connections.CLIENT) {
        clients[userId] = connection;
        clients[userId].on('message', function(message) {
            const dataFromClient = JSON.parse(message.utf8Data);
            console.log("++++++++++++++++++++" + dataFromClient.trigger)
            if(dataFromClient.trigger == constants.alarmType.ALARM) {
                pressureAlarmExplicitlyOff = true;
                alarmSender.sendAlarm({sensorType: dataFromClient.sensorType}, 0, constants.alarmType.ALARM)
            } else if(dataFromClient.trigger == constants.alarmType.EXHAUST) {
                airExhaustExplicitlyOff = true;
                exhaustSender.sendAlarm({sensorType: dataFromClient.sensorType}, 0, constants.alarmType.EXHAUST)
            }
        })
    } else {
        sensors[userId] = connection;
        sensors[userId].on('message', function(message) {
            try {
                const dataFromClient = JSON.parse(message.utf8Data);
                var updateMessage
                switch(dataFromClient.sensorType) {
                    case constants.sensorType.PRESSURE:
                        try {
                            updateMessage = sensorState.updatePressure(dataFromClient.sensorIndex, dataFromClient.currentPressure, dataFromClient.currentPressureComparer)  
                            pressureDatabase.storePressure(db, updateMessage)
                            if(updateMessage) {
                                console.log(updateMessage.data.pressureCritical)
                                if(updateMessage.data.pressureCritical) {
                                    console.log("critical")
                                    if(!pressureAlarmExplicitlyOff) {
                                        console.log("sdfsdfsdf")
                                        alarmSender.sendAlarm(updateMessage, 1, constants.alarmType.ALARM)
                                    }
                                } else {
                                    pressureAlarmExplicitlyOff = false;
                                    alarmSender.sendAlarm(updateMessage, 0, constants.alarmType.ALARM)
                                }      
                            }
                        } catch(err) {
                            errorPrint()
                            console.log(err)
                        }
                    break;
                    case constants.sensorType.SOUND:
                        try {
                            updateMessage = sensorState.updateSound(dataFromClient.sensorIndex, dataFromClient.currentSound)
                        } catch(err) {
                            errorPrint()
                        }
                    break;
                    case constants.sensorType.TEMPERATURE:
                        try{
                            updateMessage = sensorState.updateTemperature(dataFromClient.sensorIndex, dataFromClient.currentTemperature)
                            
                            temperatureDatabase.storeTemperature(db, updateMessage)
                        } catch(err) {
                            errorPrint()
                        }
                    break;
                    case constants.sensorType.AIR:
                        try{    
                            updateMessage = sensorState.updateAirTemperature(dataFromClient.sensorIndex, dataFromClient.currentAirTemperature, dataFromClient.currentHumidity, dataFromClient.currentLPG, dataFromClient.currentMethane, dataFromClient.currentCO2, dataFromClient.currentSmoke)
                            if(updateMessage) {
                                console.log(updateMessage.data.smokeCritical)
                                if(updateMessage.data.smokeCritical) {
                                    console.log("critical")
                                    if(!airExhaustExplicitlyOff) {
                                        console.log("sdfsdfsdf")
                                        exhaustSender.sendAlarm(updateMessage, 1, constants.alarmType.EXHAUST)
                                    }
                                } else {
                                    airExhaustExplicitlyOff = false;
                                    exhaustSender.sendAlarm(updateMessage, 0, constants.alarmType.EXHAUST)
                                }      
                            }
                        } catch(err) {
                            errorPrint()
                        }
                    break;
                    case constants.sensorType.VIBRATION:
                        try{    
                            console.log(dataFromClient.sensorType)
                            console.log(dataFromClient.hundredReceived)    
                            if(dataFromClient.hundredReceived) {
                                updateMessage = sensorState.updateVibration(dataFromClient.sensorIndex, currentXs[dataFromClient.sensorIndex - 1]); 
                                console.log(currentXs[dataFromClient.sensorIndex - 1])
                                currentXs[dataFromClient.sensorIndex - 1] = []       
                            } else {
                                console.log(dataFromClient.currentX)
                                console.log(currentXs)
                                currentXs[dataFromClient.sensorIndex - 1].push(dataFromClient.currentX)
                            }
                        } catch(err) {
                            errorPrint()
                        }
                    break;
                }
                if(!updateMessage) {
                    console.log("No Message to Update or Invalid Data")
                } else {
                    broadcastMessageToClients(JSON.stringify(updateMessage))
                }
            } catch(err) {
                console.log(err)
            }
        });
    }
    connection.on('close', function(connection) {
        console.log("message recieved")
    });
});

app.get('/getAllTemperatures', async function(req, res) {
    var response = await temperatureDatabase.findTemperature(db);
    res.send(response);
})

app.get('/getAllPressures', async function(req, res) {
    var response = await pressureDatabase.findPressure(db);
    res.send(response);
})

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/build')))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
})

server.listen(process.env.PORT || 5000, () => {

    console.log(`Server started on port ${server.address().port} :)`);
    MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {

        if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        }
       console.log("Connected successfully to database server");  
       db = client.db(dbName);
   });
});
