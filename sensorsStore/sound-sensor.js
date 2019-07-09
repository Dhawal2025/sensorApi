var currentSounds = []
var soundThresholds = []
var sensorCount = 1;
currentSounds.push({
    currentSound: -1,
    soundCritical: false,
    soundUpperLimit: 65,
    soundLowerLimit: 35
})
soundThresholds.push({
    soundThreshold: 10,
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
        currentSound: -1,
        soundCritical: false,
        soundUpperLimit: 65,
        soundLowerLimit: 35
    })

    soundThresholds.push({
        soundThreshold: 10,
    })
    sensorCount++;
}

function setCurrentSound(sensorIndex, currentSound) {
    if(sensorCount < sensorIndex - 1) {
        return false;
    } else {
        currentSounds[sensorIndex - 1].currentSound = currentSound;
        if(currentSounds[sensorIndex - 1].currentSound > soundThresholds[sensorIndex - 1].soundThreshold)
            currentSounds[sensorIndex - 1].soundCritical = true;
        else
            currentSounds[sensorIndex - 1].soundCritical = false;
    }
}

module.exports = {
    getCurrentSound,
    setCurrentSound,
    addSensor
}