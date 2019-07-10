var currentTemperatures = []
var temperatureThresholds = []
var sensorCount = 1;
currentTemperatures.push({
    currentTemperature: -1,
    temperatureCritical: false,
    temperatureUpperLimit: 500,
    temperatureLowerLimit: 100
})
temperatureThresholds.push({
    temperatureThreshold: 10,
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
        currentTemperature: -1,
        temperatureCritical: false,
        temperatureUpperLimit: 500,
        temperatureLowerLimit: 100
    });
    temperatureThresholds.push({
        temperatureThreshold: 10,
    })
    sensorCount++;
}

function setCurrentTemperature(sensorIndex, currentTemperature) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        currentTemperatures[sensorIndex - 1].currentTemperature = currentTemperature;

        currentTemperatures[sensorIndex - 1].temperatureThreshold = temperatureThresholds[sensorIndex - 1].temperatureThreshold;
        if(currentTemperatures[sensorIndex - 1].currentTemperature > temperatureThresholds[sensorIndex - 1].temperatureThreshold)
            currentTemperatures[sensorIndex - 1].temperatureCritical = true;
        else
            currentTemperatures[sensorIndex - 1].temperatureCritical = false;
    }
}

function setTemperatureThreshold(sensorIndex, newTemperatureThreshold) {
    temperatureThresholds[sensorIndex - 1].temperatureThreshold = newTemperatureThreshold;
}

function getTemperatureThreshold(sensorIndex) {
    return temperatureThresholds[sensorIndex - 1].temperatureThreshold;
}

function getTemperatureLimits(sensorIndex) {
    console.log(currentTemperatures[sensorIndex - 1].temperatureLowerLimit)
    return {
        upperLimit: currentTemperatures[sensorIndex - 1].temperatureUpperLimit,
        lowerLimit: currentTemperatures[sensorIndex - 1].temperatureLowerLimit
    }
}

function setTemperatureLimits(sensorIndex, temperatureUpperLimit, temperatureLowerLimit, temperatureThreshold) {
    currentTemperatures[sensorIndex - 1].temperatureUpperLimit = temperatureUpperLimit
    currentTemperatures[sensorIndex - 1].temperatureLowerLimit = temperatureLowerLimit
    temperatureThresholds[sensorIndex - 1].temperatureThreshold = temperatureThreshold
    return true;
}

module.exports = {
    getCurrentTemperature,
    setCurrentTemperature,
    addSensor,
    setTemperatureThreshold,
    getTemperatureThreshold,
    getTemperatureLimits,
    setTemperatureLimits
}