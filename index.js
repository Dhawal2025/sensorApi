require('dotenv').config();
const express = require('express')
const app = express();
const path = require('path');
const PORT=process.env.PORT || 5000;

const BodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var airQualitySensor = require('./sensors/air-quality-sensor.js')
var temperatureSensor = require('./sensors/temperature-sensor.js')
var vibrationsSensor = require('./sensors/vibrations-sensor.js')
var soundSensor = require('./sensors/sound-sensor.js')
var pressureSensor = require('./sensors/pressure-sensor.js')

/*********************DATABASE VARIABLES*****************************/
var db
var uri
if(process.env.DATABASE_URI) {
    uri = process.env.DATABASE_URI;
} else {
    uri = 'mongodb://localhost:27017/sensorDatabase';
}
const dbName = 'sensorApi';
/********************************************************************/

/*******************AIR QUALITY TEMPORARY VARIABLES******************/
var currentTemperature = 0
var currentHumidity = 0
var currentPpm = 0
var maxPpm = 0;
var averagePpm = 0;
var ppmCalculated = 0;
var temperatureThreshold = 50
var humidityThreshold = 50
var ppmThreshold = 10000
/********************************************************************/

/*******************PRESSURE TEMPORARY VARIABLES******************/
var currentPressure = 0
var pressureThreshold = 100
/********************************************************************/

/*******************FURNACE TEMPORARY VARIABLES******************/
var currentFurnaceTemperature = 0
var furnaceTemperatureThreshold = 100
/********************************************************************/

/*******************SOUND TEMPORARY VARIABLES******************/
var currentSoundStatus = 0
/********************************************************************/

/*******************ALARM TEMPORARY VARIABLES******************/
var alarmStatus = false
/********************************************************************/

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

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
    if(isNaN(Number(req.query.temp)) || isNaN(Number(req.query.hum)) || isNaN(Number(req.query.ppm))) {
        console.log("invalid data values sent")
        return res.send(false)
    }
    currentTemperature = Number(req.query.temp);
    currentHumidity = Number(req.query.hum);
    currentPpm = Number(req.query.ppm)
    if(maxPpm < currentPpm)
        maxPpm = currentPpm
    averagePpm = averagePpm * ppmCalculated + currentPpm;
    ppmCalculated++;
    averagePpm = averagePpm / ppmCalculated;

    //trigger alarm if critical value reached
    if(currentTemperature > temperatureThreshold || currentHumidity > humidityThreshold || currentPpm > ppmThreshold)
        alarmStatus = true
    else
        alarmStatus = false

    console.log("send Temperature endpoint hit")
    console.log("The temperature is:- " + req.query.temp);
    console.log("The humidity is:- ", req.query.hum);
    console.log("The ppm is:- ", req.query.ppm);

    var response = await temperatureSensor.storeTemperature(db, currentTemperature, currentHumidity, currentPpm);
    if(response == true) {
        console.log("store successfull");
    } else {
        console.log("unsuccessful");
    }
    return res.send(response);
});

app.get('/sendSound', async function(req, res) {
    if(isNaN(Number(req.query.soundStatus))) {
        console.log("invalid data values sent")
        return res.send(false)
    }
    currentSoundStatus = Number(req.query.soundStatus);
    console.log("send Sound endpoint hit")
    console.log("The sound is " + req.query.adcSound);

    return res.send(true);
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

app.get('/sendPressure', async function(req, res) {
    if(isNaN(Number(req.query.pressure))) {
        console.log("invalid data values sent")
        return res.send(false)
    }
    currentPressure = Number(req.query.pressure);

    //trigger alarm if critical value reached
    if(currentPressure > pressureThreshold)
        alarmStatus = true
    else
        alarmStatus = false

    console.log("send Pressure endpoint hit")
    console.log("The pressure is " + req.query.pressure);

    var response = await pressureSensor.storePressure(db, currentPressure);
    if(response == true) {
        console.log("store successfull");
    } else {
        console.log("unsuccessful");
    }
    return res.send(response);
});

app.get('/sendFurnaceTemperature', async function(req, res) {
    if(isNaN(Number(req.query.furnaceTemp))) {
        console.log("invalid data values sent")
        return res.send(false)
    }
    currentFurnaceTemperature = Number(req.query.furnaceTemp);

    //trigger alarm if critical value reached
    if(currentFurnaceTemperature > furnaceTemperatureThreshold)
        alarmStatus = true
    else
        alarmStatus = false
    console.log("send furnace temperature endpoint hit")
    console.log("The furnace temperature is " + req.query.furnaceTemp);

    var response = await furnaceSensor.storeTemperature(db, currentFurnaceTemperature);
    if(response == true) {
        console.log("store successfull");
    } else {
        console.log("unsuccessful");
    }
    return res.send(response);
});

app.get('/getTemperature', async function(req, res) {
    var response = await temperatureSensor.findTemperature(db);
    if(response == null) {
        console.log("find unsuccessfull");
    } else {
        console.log(response);
        console.log("find successful");
    }
    return res.send(response);
});

app.get('/getCurrentTemperature', async function(req, res) {
    var currentData = {
        criticalTemperature: (currentTemperature > temperatureThreshold),
        criticalHumidity: (currentHumidity > humidityThreshold),
        criticalPpm: (currentPpm > ppmThreshold),
        currentTemperature: currentTemperature,
        currentHumidity: currentHumidity,
        currentPpm: currentPpm,
        maxPpm: maxPpm,
        averagePpm: averagePpm
    };
    var response = currentData;
    return res.send(response);
});

app.get('/getCurrentPressure', async function(req, res) {
    var currentData = {
        criticalPressure: (currentPressure > pressureThreshold),
        currentPressure: currentPressure,
    };

    var response = currentData;
    return res.send(response);
});

app.get('/getCurrentFurnaceTemperature', async function(req, res) {
    var currentData = {
        criticalFurnaceTemperature: (currentFurnaceTemperature > furnaceTemperatureThreshold),
        currentPressure: currentFurnaceTemperature,
    };

    var response = currentData;
    return res.send(response);
});

app.get('/getCurrentSound', async function(req, res) {
    var currentData = {
        currentSoundStatus: currentSoundStatus
    };

    var response = currentData;
    return res.send(response);
});

app.get('/getAlarmStatus', async function(req, res) {
    var response = alarmStatus;
    return res.send(response);
});

app.get('/turnOffAlarm', async function(req, res) {
    alarmStatus = false;
    return res.send(true);
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/build')))

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
})
app.listen(process.env.PORT || PORT, ()=> {
    MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
        if(err) {
             console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        }    
        assert.equal(null, err);
        console.log("Connected successfully to database server");  
        db = client.db(dbName);
    });
})
