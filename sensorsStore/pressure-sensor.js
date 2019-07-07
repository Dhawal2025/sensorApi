var currentPressures = []
var pressureThresholds = []
var sensorCount = 1;
currentPressures.push({
    currentPressure: -1,
    pressureCritical: false
})
pressureThresholds.push({
    pressureThreshold: 10,
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
        currentPressures: -1
    });
    sensorCount++;
}

function setCurrentPressure(sensorIndex, currentPressure) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        currentPressures[sensorIndex - 1].currentPressure = currentPressure;
        if(currentPressures[sensorIndex - 1],currentPressure > pressureThresholds[sensorIndex - 1].pressureThreshold)
            currentPressures[sensorIndex - 1].pressureCritical = true;
        else
            currentPressures[sensorIndex - 1].pressureCritical = false;
    }
}

module.exports = {
    getCurrentPressure,
    setCurrentPressure,
    addSensor
}