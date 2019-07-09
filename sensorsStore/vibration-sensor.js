var currentVibrations = []
var vibrationThresholds = []
var sensorCount = 1;
currentVibrations.push({
    currentVibration: [],
    vibrationCritical: false
})
vibrationThresholds.push({
    vibrationThreshold: 10,
})
function getCurrentVibration(sensorIndex) {
    
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        console.log(sensorIndex)
        return currentVibrations[Number(sensorIndex) - 1];
    }
}

function addSensor() {
    currentVibrations.push({
        currentVibration: -1
    });
    sensorCount++;
}

function setCurrentVibration(sensorIndex, currentVibration) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        currentVibrations[sensorIndex - 1].currentVibration = currentVibration;
        if(currentVibrations[sensorIndex - 1].currentVibration > vibrationThresholds[sensorIndex - 1].vibrationThreshold)
            currentVibrations[sensorIndex - 1].vibrationCritical = true;
        else
            currentVibrations[sensorIndex - 1].vibrationCritical = false;
    }
}

module.exports = {
    getCurrentVibration,
    setCurrentVibration,
    addSensor
}