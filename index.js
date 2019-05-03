require('dotenv').config();
const express = require('express')
const app = express();
const path = require('path');
const PORT=process.env.PORT || 5000;
var airQualitySensor = require('./sensors/air-quality-sensor.js')
var temperatureSensor = require('./sensors/temperature-sensor.js')
var vibrationsSensor = require('./sensors/vibrations-sensor.js')

app.get('/sendAirQuality', async function(req, res) {
    console.log("send Air Quality endpoint hit")
    var response = await airQualitySensor.storeAirQuality();
    if(response == true) {
        console.log("store successfull");
    } else {
        console.log("unsuccessful");
    }
    return res.send(response);
});

app.get('/sendTemperature', async function(req, res) {
    console.log("send Temperature endpoint hit")
    console.log("The temperature is " + req.query.temp);
    console.log("The humidity is:- ", req.query.hum);
    var response = await temperatureSensor.storeTemperature();
    if(response == true) {
        console.log("store successfull");
    } else {
        console.log("unsuccessful");
    }
    return res.send(response);
});

app.get('/sendVibrations', async function(req, res) {
    console.log("send Vibrations endpoint hit")
    var response = await vibrationsSensor.storeVibration();
    if(response == true) {
        console.log("store successfull");
    } else {
        console.log("unsuccessful");
    }
    return res.send(response);
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/build')))

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
})
app.listen(PORT, ()=> {
    console.log(`##########################Listening to port ${PORT} ###########################`)
})


