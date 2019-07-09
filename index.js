require('dotenv').config();
const webSocketsServerPort = 5000;
const webSocketServer = require('websocket').server;
const http = require('http');

const express = require('express')
const app = express();

require('./staticEndpoints/pressure-endpoints.js')(app);
require('./staticEndpoints/temperature-endpoints.js')(app);
const path = require('path');

const server = http.createServer(app);

var sensorState = require("./sensorState.js");
const constants = require('./projectConstants.js')

const wsServer = new webSocketServer({
  httpServer: server,
  path: "/echo"
});

const connections = {
    SENSOR: "sensor",
    CLIENT: "client"
}

sensors = {}
clients = {}

// Generates unique ID for every new connection
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

function broadcastMessage(data) {
    Object.keys(clients).map((client) => {
        clients[client].sendUTF(data);
    });
}
var currentXs = [[]]
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var connectionType = request.resourceURL.query.connectionType
    var userId = getUniqueID();
    console.log(connectionType);
    if(connectionType == connections.CLIENT) {
        clients[userId] = connection;
    } else {
        sensors[userId] = connection;
        sensors[userId].on('message', function(message) {
            const dataFromClient = JSON.parse(message.utf8Data);
            var updateMessage
            switch(dataFromClient.sensorType) {
                case constants.sensorType.PRESSURE:
                    updateMessage = sensorState.updatePressure(dataFromClient.sensorIndex, dataFromClient.currentPressure, dataFromClient.currentPressureComparer)
                break;
                case constants.sensorType.SOUND:
                    updateMessage = sensorState.updateSound(dataFromClient.sensorIndex, dataFromClient.currentSound)
                break;
                case constants.sensorType.TEMPERATURE:
                    updateMessage = sensorState.updateTemperature(dataFromClient.sensorIndex, dataFromClient.currentTemperature)
                break;
                case constants.sensorType.AIR:
                    updateMessage = sensorState.updateAirTemperature(dataFromClient.sensorIndex, dataFromClient.currentAirTemperature, dataFromClient.currentHumidity)
                break;
                case constants.sensorType.VIBRATION:
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
                break;
            }
            if(!updateMessage) {
                console.log("No Message to Update or Invalid Data")
            } else {
                broadcastMessage(JSON.stringify(updateMessage))
            }
        });
    }
    connection.on('close', function(connection) {
        console.log("message recieved")
    });
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/build')))

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
})

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
