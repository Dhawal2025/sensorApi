import React, { Component } from 'react';
import Gauge from 'react-radial-gauge';

class AirTemperature extends Component {
    render() {
        let opts = {
            size: 260,
            currentValue: 50,
            dialWidth: 20,
            dialColor: '#AAC4CF',
            progressWidth: 20,
            progressColor: '#4592af',
            tickLength: 1,
            tickColor: '#3498DB',
            needleColor: '#4c8492',
            needleBaseSize: 0,
            needleBaseColor: '#AAB29A',
            needleWidth: 5,
            needleSharp: true
        }
        return(
            <Gauge {...opts} />
        );
    }
}

export default AirTemperature;