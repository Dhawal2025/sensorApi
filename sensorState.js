const nodemailer = require('nodemailer');
const Email = require('email-templates');
const nodemailerSendgrid = require('nodemailer-sendgrid');

var email = require('./helper');
var pressureStore = require("./sensorsStore/pressure-sensor.js")
var soundStore = require("./sensorsStore/sound-sensor.js")
var temperatureStore = require("./sensorsStore/temperature-sensor.js")
var airStore = require("./sensorsStore/air-sensor.js")
var vibrationStore = require("./sensorsStore/vibration-sensor.js")
const constants = require('./projectConstants.js')
const index = require('./index.js')

var fft = require('fft-js').fft

var updateMessage = {
    sensorType: 0,
    sensorIndex: 0,
    data: {}
}

function sendMail(senderEmail, sensorName) {
    const transport = nodemailer.createTransport(
        nodemailerSendgrid({
          apiKey: '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'
        })
      );
      
      // console.log(transporter, "TRANSPORTER");
      const email = new Email({
          message: {
              from: 'skalra912@gmail.com'
          },
          send: true,
          transport
      });
      email.send({
        template: 'hello',
        message: {
          to: senderEmail,
        },
        locals: {
          sensorName,
          currentDateAndTime: '11/07/19'
        }
      }).then(() => console.log('email has been sent!'))
      .catch((error) => console.log(error));
}

function getCurrentDateAndTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return time + " " + date; 
}

function updatePressure(sensorIndex, currentPressure, currentPressureComparer) {
    pressureStore.setCurrentPressure(sensorIndex, currentPressure, currentPressureComparer)
    updateMessage.data = pressureStore.getCurrentPressure(sensorIndex);
    if(updateMessage.data == false)
        return false;
    var curr = getCurrentDateAndTime();
    console.log(curr);
    if (updateMessage.data.pressureCritical) {
        sendMail('skalra912@gmail.com', 'Pressure Sensor');
        console.log("Critical temp");  
    }
    updateMessage.sensorType = constants.sensorType.PRESSURE;
    updateMessage.sensorIndex = sensorIndex;

    return updateMessage;
}

function updateSound(sensorIndex, currentSound) {
    soundStore.setCurrentSound(sensorIndex, currentSound)
    updateMessage.data = soundStore.getCurrentSound(sensorIndex);
    if(updateMessage.data == false)
        return false;
    updateMessage.sensorType = constants.sensorType.SOUND;
    updateMessage.sensorIndex = sensorIndex;
    return updateMessage;
}

function updateTemperature(sensorIndex, currentTemperature) {
    temperatureStore.setCurrentTemperature(sensorIndex, currentTemperature)
    updateMessage.data = temperatureStore.getCurrentTemperature(sensorIndex);
    if(updateMessage.data == false)
        return false;
    updateMessage.sensorType = constants.sensorType.TEMPERATURE;
    updateMessage.sensorIndex = sensorIndex;
    //temperatureDatabase.storeTemperature(index.db, updateMessage)
    return updateMessage;
}

function updateAirTemperature(sensorIndex, currentAirTemperature, currentHumidity, currentLPG, currentMethane, currentCO2, currentSmoke) {
    airStore.setCurrentAirTemperature(sensorIndex, currentAirTemperature, currentHumidity, currentLPG, currentMethane, currentCO2, currentSmoke)
    updateMessage.data = airStore.getCurrentAirTemperature(sensorIndex);
    if(updateMessage.data == false)
        return false;
    updateMessage.sensorType = constants.sensorType.AIR;
    updateMessage.sensorIndex = sensorIndex;
    return updateMessage;
}

function updateVibration(sensorIndex, currentXs) {
    console.log(currentXs)
    var INPUT_SIZE = 32;
    var input = new Array(INPUT_SIZE);
    for(var i = 0; i < INPUT_SIZE; i++) {
        input[i] = 0;
    }
    for(var i = 0; i < Math.min(currentXs.length, INPUT_SIZE); i++) {
        input[i] = currentXs[i];
    }
    var phasors = fft(input);
    var output = []
    console.log("**************************")
    console.log(phasors);
    console.log("**************************")
    
    for(var i = 0; i < phasors.length; i++) {
        output.push(Math.abs(phasors[i][0]))
    }
    console.log(output)
    vibrationStore.setCurrentVibration(sensorIndex, output)
    updateMessage.data = vibrationStore.getCurrentVibration(sensorIndex);
    if(updateMessage.data == false)
        return false;
    updateMessage.sensorType = constants.sensorType.VIBRATION;
    updateMessage.sensorIndex = sensorIndex;
    return updateMessage;
}

module.exports.updatePressure = updatePressure;
module.exports.updateSound = updateSound;
module.exports.updateTemperature = updateTemperature;
module.exports.updateAirTemperature = updateAirTemperature;
module.exports.updateVibration = updateVibration;