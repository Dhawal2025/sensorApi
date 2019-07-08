var currentAirTemperatures = []
var airTemperatureThresholds = []
var sensorCount = 1;
currentAirTemperatures.push({
    currentAirTemperature: -1,
    currentHumidity: -1,
    airTemperatureCritical: false
})
airTemperatureThresholds.push({
    airTemperatureThreshold: 10,
})
function getCurrentAirTemperature(sensorIndex) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        return currentAirTemperatures[Number(sensorIndex) - 1];
    }
}

function addSensor() {
    currentAirTemperatures.push({
        currentAirTemperatures: -1
    });
    sensorCount++;
}

function setCurrentAirTemperature(sensorIndex, currentAirTemperature, currentHumidity) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        currentAirTemperatures[sensorIndex - 1].currentAirTemperature = currentAirTemperature;
        currentAirTemperatures[sensorIndex - 1].currentHumidity = currentHumidity;
        if(currentAirTemperatures[sensorIndex - 1],currentAirTemperature > airTemperatureThresholds[sensorIndex - 1].airTemperatureThreshold)
            currentAirTemperatures[sensorIndex - 1].airTemperatureCritical = true;
        else
            currentAirTemperatures[sensorIndex - 1].airTemperatureCritical = false;
    }
}

module.exports = {
    getCurrentAirTemperature,
    setCurrentAirTemperature,
    addSensor
}