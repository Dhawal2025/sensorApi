var currentAirTemperatures = []
var airTemperatureThresholds = []
var sensorCount = 1;
currentAirTemperatures.push({
    currentAirTemperature: -1,
    currentHumidity: -1,
    currentCO2: 0,
    currentLPG: 0,
    currentSmoke: 0,
    currentMethane: 0,
    airTemperatureCritical: false,
    lpgCritical: false,
    smokeCritical: false,
    methaneCritical: false
})
airTemperatureThresholds.push({
    airTemperatureThreshold: 10,
    lpgThreshold: 25,
    methaneThreshold: 25,
    co2Threshold: 25,
    smokeThreshold: 25
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

function setCurrentAirTemperature(sensorIndex, currentAirTemperature, currentHumidity, currentLPG, currentMethane, currentCO2, currentSmoke) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        currentAirTemperatures[sensorIndex - 1].currentAirTemperature = currentAirTemperature;
        currentAirTemperatures[sensorIndex - 1].currentHumidity = currentHumidity;
        
        currentAirTemperatures[sensorIndex - 1].currentLPG = currentLPG;
        if(currentAirTemperatures[sensorIndex - 1].currentLPG > airTemperatureThresholds[sensorIndex - 1].lpgThreshold)
            currentAirTemperatures[sensorIndex - 1].criticalLPG = true;
        else
            currentAirTemperatures[sensorIndex - 1].criticalLPG = false;

        currentAirTemperatures[sensorIndex - 1].currentCO2 = currentCO2;
        if(currentAirTemperatures[sensorIndex - 1].currentCO2 > airTemperatureThresholds[sensorIndex - 1].co2Threshold)
            currentAirTemperatures[sensorIndex - 1].criticalCO2 = true;
        else
            currentAirTemperatures[sensorIndex - 1].criticalCO2 = false;

        currentAirTemperatures[sensorIndex - 1].currentMethane = currentMethane
        if(currentAirTemperatures[sensorIndex - 1].currentMethane > airTemperatureThresholds[sensorIndex - 1].methaneThreshold)
            currentAirTemperatures[sensorIndex - 1].criticalMethane = true;
        else
            currentAirTemperatures[sensorIndex - 1].criticalMethane = false;
        
        currentAirTemperatures[sensorIndex - 1].currentSmoke = currentSmoke
        if(currentAirTemperatures[sensorIndex - 1].currentSmoke > airTemperatureThresholds[sensorIndex - 1].smokeThreshold)
            currentAirTemperatures[sensorIndex - 1].criticalSmoke = true;
        else
            currentAirTemperatures[sensorIndex - 1].criticalSmoke = false;
    }
}

module.exports = {
    getCurrentAirTemperature,
    setCurrentAirTemperature,
    addSensor
}