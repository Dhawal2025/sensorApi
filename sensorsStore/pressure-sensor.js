var currentPressures = []
var pressureThresholds = []
var sensorCount = 1;
currentPressures.push({
    currentPressure: -1,
    currentPressureComparer: -1,
    pressureCritical: false,
    differenceIncreased: false,
    pressureUpperLimit: 0,
    pressureLowerLimit: 2
})
pressureThresholds.push({
    pressureThreshold: 1.05,
    pressureDifferenceThreshold: 0.25
})
function getCurrentPressure(sensorIndex) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        return currentPressures[Number(sensorIndex) - 1];
    }
}

function addSensor() {
    currentPressures.push({
        currentPressure: -1,
        currentPressureComparer: -1,
        pressureThreshold: 1.05,
    });
    pressureThresholds.push({
        pressureThreshold: 1.05,
        pressureDifferenceThreshold: 0.25
    })
    sensorCount++;
}

function setCurrentPressure(sensorIndex, currentPressure, currentPressureComparer) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        currentPressures[sensorIndex - 1].currentPressure = currentPressure / 100000;
        currentPressures[sensorIndex - 1].currentPressureComparer = currentPressureComparer / 100000
        currentPressures[sensorIndex - 1].pressureThreshold = pressureThresholds[sensorIndex - 1].pressureThreshold
        
        if(currentPressures[sensorIndex - 1].currentPressure > pressureThresholds[sensorIndex - 1].pressureThreshold)
            currentPressures[sensorIndex - 1].pressureCritical = true;
        else
            currentPressures[sensorIndex - 1].pressureCritical = false;

        if(Math.abs(currentPressures[sensorIndex - 1].currentPressure - currentPressures[sensorIndex - 1].currentPressureComparer)  > pressureThresholds[sensorIndex - 1].pressureDifferenceThreshold)
            currentPressures[sensorIndex - 1].differenceIncreased = true;
        else
            currentPressures[sensorIndex - 1].differenceIncreased = false;
    }
}

function setPressureThreshold(sensorIndex, newPressureThreshold) {
    pressureThresholds[sensorIndex - 1].pressureThreshold = newPressureThreshold;
}

function getPressureThreshold(sensorIndex) {
    return pressureThresholds[sensorIndex - 1].pressureThreshold;
}


function getPressureLimits(sensorIndex) {
    console.log(currentPressures[sensorIndex - 1].pressureLowerLimit)
    return {
        upperLimit: currentPressures[sensorIndex - 1].pressureUpperLimit,
        lowerLimit: currentPressures[sensorIndex - 1].pressureLowerLimit
    }
}

function setPressureLimits(sensorIndex, pressureUpperLimit, pressureLowerLimit, pressureThreshold) {
    currentPressures[sensorIndex - 1].pressureUpperLimit = pressureUpperLimit
    currentPressures[sensorIndex - 1].pressureLowerLimit = pressureLowerLimit
    pressureThresholds[sensorIndex - 1].pressureThreshold = pressureThreshold
    return true;
}

module.exports = {
    getCurrentPressure,
    setCurrentPressure,
    addSensor,
    setPressureThreshold,
    getPressureThreshold,
    getPressureLimits,
    setPressureLimits
}