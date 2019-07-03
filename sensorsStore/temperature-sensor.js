var currentTemperatures = []
var sensorCount = 1;
currentTemperatures.push({
    currentTemperature: -1
})
function getCurrentTemperature(sensorIndex) {
    
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        console.log(sensorIndex)
        return currentTemperatures[Number(sensorIndex) - 1];
    }
}

function addSensor() {
    currentTemperatures.push({
        currentTemperature: -1
    });
    sensorCount++;
}

function setCurrentTemperature(sensorIndex, currentTemperature) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        currentTemperatures[sensorIndex - 1].currentTemperature = currentTemperature;
    }
}

module.exports = {
    getCurrentTemperature,
    setCurrentTemperature,
    addSensor
}