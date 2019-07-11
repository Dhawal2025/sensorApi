#!/usr/bin/env node

function sendAlarm(updateMessage, setStatus, actionType) {
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
                console.log("Received: '" + message.utf8Data + "'");
            }
        });
        connection.sendUTF(JSON.stringify({
            device: constants.alarmType.ALARM,
            status: setStatus,
            sensor: updateMessage.sensorType
        }));
        connection.close();
    });
    
    client.connect(constants.ALARM_IP);
}

module.exports = {
    sendAlarm: sendAlarm
}