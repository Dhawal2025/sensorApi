var currentSounds = []
var sensorCount = 1;
currentSounds.push({
    currentSound: -1
})
function getCurrentSound(sensorIndex) {
    
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        console.log(sensorIndex)
        return currentSounds[Number(sensorIndex) - 1];
    }
}

function addSensor() {
    currentSounds.push({
        currentSound: -1
    });
    sensorCount++;
}

function setCurrentSound(sensorIndex, currentSound) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {

        console.log("///////////////////////")
        currentSounds[sensorIndex - 1].currentSound = currentSound;
    }
}

module.exports = {
    getCurrentSound,
    setCurrentSound,
    addSensor
}