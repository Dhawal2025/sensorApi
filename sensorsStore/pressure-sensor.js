var currentPressures = []
var pressureThresholds = []
var sensorCount = 1;
currentPressures.push({
    currentPressure: -1,
    currentPressureComparer: -1,
    pressureCritical: false,
    differenceIncreased: false,
    pressureUpperLimit: 150000,
    pressureLowerLimit: 5000
})
pressureThresholds.push({
    pressureThreshold: 10,
    pressureDifferenceThreshold: 5000
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
        currentPressures: -1,
        currentPressureComparer: -1,
        pressureThreshold: 10,
    });
    pressureThresholds.push({
        pressureThreshold: 10,
        pressureDifferenceThreshold: 5000
    })
    sensorCount++;
}

function setCurrentPressure(sensorIndex, currentPressure, currentPressureComparer) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        currentPressures[sensorIndex - 1].currentPressure = currentPressure;
        currentPressures[sensorIndex - 1].currentPressureComparer = currentPressureComparer
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

module.exports = {
    getCurrentPressure,
    setCurrentPressure,
    addSensor,
    setPressureThreshold,
    getPressureThreshold
}