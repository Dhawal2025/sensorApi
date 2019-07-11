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
        console.log(JSON.parse(message.utf8Data));
        if (message.type === 'utf8') {
        }
    });
    var number = 0
    function sendNumber() {
        number++;
        console.log(number)
        if (connection.connected) {
            /*if(number <= 36) {
                connection.sendUTF(JSON.stringify({
                    currentX: number,
                    hundredReceived: false,
                    sensorType: constants.sensorType.VIBRATION,
                    sensorIndex: 1
                }));
            } else {
                connection.sendUTF(JSON.stringify({
                    hundredReceived: true,
                    sensorType: constants.sensorType.VIBRATION,
                    sensorIndex: 1
                }));
                number = 0;
            }
/*
            connection.sendUTF(JSON.stringify({
                currentAirTemperature: 25,
                currentCO2: 10,
                currentLPG: 10,
                currentMethane: 10,
                currentSmoke: 15,
                currentHumidity: 15,
                sensorType: constants.sensorType.AIR,
                sensorIndex: 1
            }));*/
            /*
            connection.sendUTF(JSON.stringify({
                currentTemperature: NaN,
                sensorType: constants.sensorType.TEMPERATURE,
                sensorIndex: 1
            }));*/
            connection.sendUTF(JSON.stringify({
                currentPressure: 500000,
                currentPressureComparer: 100000,
                sensorType: constants.sensorType.PRESSURE,
                sensorIndex: 1
            }));
            /*connection.sendUTF(JSON.stringify({
                currentSound: 900,
                sensorType: constants.sensorType.SOUND,
                sensorIndex: 1
            }));
            /*
            connection.sendUTF(JSON.stringify({
                currentPressure: 80000,
                currentPressureComparer: 150000,
                sensorType: constants.sensorType.PRESSURE,
                sensorIndex: 2
            }));
*//*
            connection.sendUTF(JSON.stringify({
                currentTemperature: 99,
                sensorType: constants.sensorType.TEMPERATURE,
                sensorIndex: 1
            }));
            
            connection.sendUTF(JSON.stringify({
                currentHumidity: 99,
                sensorType: constants.sensorType.AIR,
                sensorIndex: 1
            }));*/

            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});
 
client.connect('ws://localhost:5000?connectionType=sensor');