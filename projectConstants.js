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
    alarmType: alarmType,
    ALARM_IP: 'ws://172.16.166.152/',
    EXHAUST_IP: 'ws://192.168.43.131/',
    MCB_BOARD_IP: 'ws://192.168.43.131/',
    hostIP: "172.16.168.29:5000"
});

