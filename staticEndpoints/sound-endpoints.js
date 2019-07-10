const soundStore = require('../sensorsStore/sound-sensor.js')
module.exports = function(app){
    app.get('/addSoundSensor', function(req, res) {
        soundStore.addSensor();
        res.send(true);
    })
}