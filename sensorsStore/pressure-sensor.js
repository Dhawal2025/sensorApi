var currentPressures = []
var sensorCount = 1;
currentPressures.push({
    currentPressure: -1
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
    }
}

module.exports = {
    getCurrentPressure,
    setCurrentPressure,
    addSensor
}