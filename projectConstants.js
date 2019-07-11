const sensorType = {
    PRESSURE: 1,
    TEMPERATURE: 2,
    VIBRATION: 3,
    SOUND: 4,
    AIR: 5
}
const alarmType = {
    ALARM: 1,
    EXHAUST: 2
}
module.exports = Object.freeze({
    sensorType: sensorType,
    hostIP: "172.16.168.45:5000",
    alarmType
});

