var http = require('http'),
fileSystem = require('fs'),
path = require('path');

const pressureStore = require('../sensorsStore/pressure-sensor.js')
module.exports = function(app){
    app.get('/setPressureThreshold', function(req, res) {
        pressureStore.setPressureThreshold(req.query.sensorIndex, req.query.newThreshold)
        console.log(pressureStore.getPressureThreshold(req.query.sensorIndex))
        res.send(true);
    });

    app.get('/addPressureSensor', function(req, res) {
        pressureStore.addSensor();
        res.send(true)
    })

    app.get('/Blink.ino.bin', function(req, res) {
       
        var filePath = path.join(__dirname, '../Blink.ino.bin');
        var stat = fileSystem.statSync(filePath);
    
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': stat.size
        });
    
        var readStream = fileSystem.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res);
    })

    app.get('/setPressureLimits', function(req, res) {
        console.log("*********/*/*/*******************")
        console.log(req.query.pressureUpperLimit)
        console.log(req.query.pressureLowerLimit)
        console.log(req.query.pressureThreshold)
        pressureStore.setPressureLimits(1, req.query.pressureUpperLimit, req.query.pressureLowerLimit, req.query.pressureThreshold)
        res.send(true)
    })
}