const temperatureStore = require('../sensorsStore/temperature-sensor.js')
module.exports = function(app){
    app.get('/setTemperatureThreshold', function(req, res) {
        temperatureStore.setTemperatureThreshold(req.query.sensorIndex, req.query.newThreshold)
        console.log(temperatureStore.getTemperatureThreshold(req.query.sensorIndex))
        res.send(true);
    });
}