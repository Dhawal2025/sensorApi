const express = require('express')
const app = express();
const BodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const PORT = process.env.PORT || 5000;
var airQualitySensor = require('./sensors/air-quality-sensor.js')
var temperatureSensor = require('./sensors/temperature-sensor.js')
var vibrationsSensor = require('./sensors/vibrations-sensor.js')

/*********************DATABASE VARIABLES*****************************/
var db

//Use this uri when working locally(Recommended to work locally)
var uri = 'mongodb://localhost:27017/sensorDatabase';

//Use this uri when want to connect to the server database(NOTE: It is not recommended to connect to the server database with your personal computer)
//var uri = 'mongodb+srv://akshay:akshay@sih-xyklc.mongodb.net/test?retryWrites=true'
const dbName = 'sensorApi';
/********************************************************************/

/*******************TEMPERATURE TEMPORARY VARIABLES******************/
var currentTemperature
var currentHumidity
/********************************************************************/

/*******************AIR QUALITY TEMPORARY VARIABLES******************/
var currentCO2Level
var currentO2Level
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
    currentTemperature = req.query.temp;
    currentHumidity = req.query.hum;
    console.log("send Temperature endpoint hit")
    console.log("The temperature is " + req.query.temp);
    console.log("The humidity is:- ", req.query.hum);
    var response = await temperatureSensor.storeTemperature(db, currentTemperature, currentHumidity);
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

app.listen(process.env.PORT || PORT, ()=> {
    console.log("##########################Listening to port " + PORT + " ###########################")
    MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
        if(err) {
             console.log('Error occurred while connecting to MongoDB Atlas...\n',err);

        }    
        assert.equal(null, err);
        console.log("Connected successfully to database server");  
        db = client.db(dbName);
    });
})
