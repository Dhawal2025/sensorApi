const temperatureStore = require('../sensorsStore/temperature-sensor.js')
module.exports = function(app){
    app.get('/setTemperatureThreshold', function(req, res) {
        temperatureStore.setTemperatureThreshold(req.query.sensorIndex, req.query.newThreshold)
        console.log(temperatureStore.getTemperatureThreshold(req.query.sensorIndex))
        res.send(true);
    });

    app.get('/addTemperatureSensor', function(req, res) {
        temperatureStore.addSensor();
        res.send(true)
    })

    app.get('/getTemperatureLimits', function(req, res) {
        res.send(temperatureStore.getTemperatureLimits(1))
    })

    app.get('/setTemperatureLimits', function(req, res) {
        console.log("*********/*/*/*******************")
        console.log(req.query.temperatureUpperLimit)
        console.log(req.query.temperatureLowerLimit)
        console.log(req.query.temperatureThreshold)
        temperatureStore.setTemperatureLimits(1, req.query.temperatureUpperLimit, req.query.temperatureLowerLimit, req.query.temperatureThreshold)
        res.send(true)
    })
}