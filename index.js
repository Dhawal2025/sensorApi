require('dotenv').config();
const webSocketsServerPort = 5000;
const webSocketServer = require('websocket').server;
const http = require('http');

const express = require('express')
const app = express();
const path = require('path');

const server = http.createServer(app);

var sensorState = require("./sensorState.js");
const constants = require('./projectConstants.js')
// server.listen(webSocketsServerPort);
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

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var connectionType = request.resourceURL.query.connectionType
    var userId = getUniqueID();
    console.log(connectionType);
    if(connectionType == connections.CLIENT) {
        clients[userId] = connection;
        // clients[userId].send('HELLO CLIENT');
    } else {

        sensors[userId] = connection;
        sensors[userId].on('message', function(message) {
            const dataFromClient = JSON.parse(message.utf8Data);
            var updateMessage
            switch(dataFromClient.sensorType) {
                case constants.sensorType.PRESSURE:
                    updateMessage = sensorState.updatePressure(dataFromClient.sensorIndex, dataFromClient.currentPressure)
                break;
                case constants.sensorType.SOUND:
                    updateMessage = sensorState.updateSound(dataFromClient.sensorIndex, dataFromClient.currentSound)
                break;
                case constants.sensorType.TEMPERATURE:
                    updateMessage = sensorState.updateTemperature(dataFromClient.sensorIndex, dataFromClient.currentTemperature)
                break;
            }
            if(!updateMessage) {
                console.log("Invalid Data")
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
