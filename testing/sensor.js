#!/usr/bin/env node
const constants = require('../projectConstants.js')
var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();
 
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});


client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data.value + "'");
        }
    });
    
    function sendNumber() {
        if (connection.connected) {
            var number = 5 + Math.round(Math.random() * 10);
            connection.sendUTF(JSON.stringify({
                currentTemperature: 9,
                sensorType: constants.sensorType.TEMPERATURE,
                sensorIndex: 1
            }));
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});
 
client.connect('ws://127.0.0.1:5000?connectionType=sensor');