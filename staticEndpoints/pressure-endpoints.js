const pressureStore = require('../sensorsStore/pressure-sensor.js')
module.exports = function(app){
    app.get('/setPressureThreshold', function(req, res) {
        pressureStore.setPressureThreshold(req.query.sensorIndex, req.query.newThreshold)
        console.log(pressureStore.getPressureThreshold(req.query.sensorIndex))
        res.send(true);
    });
}