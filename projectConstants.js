const sensorType = {
    PRESSURE: 1,
    TEMPERATURE: 2,
    VIBRATION: 3,
    SOUND: 4,
    AIR: 5
}
module.exports = Object.freeze({
    sensorType: sensorType,
    hostIP: "172.16.168.29:5000"
});

