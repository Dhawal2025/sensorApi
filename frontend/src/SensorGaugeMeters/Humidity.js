import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import React, { Component } from 'react';
import axios from 'axios';
import LiquidFillGauge from 'react-liquid-gauge';

class Humidity extends Component {
    state = {
        humidityReading: 0
    };
    startColor = '#4592af'; 
    endColor = '#4c8492'; 
    
    componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => this.setState({humidityReading: res.data.currentHumidity})) , 2000)
    }

    render() {
        const radius = 120;
        const interpolate = interpolateRgb(this.startColor, this.endColor);
        const fillColor = interpolate(this.state.humidityReading / 100);
        const gradientStops = [
            {
                key: '0%',
                stopColor: color(fillColor).darker(0.5).toString(),
                stopOpacity: 1,
                offset: '0%'
            },
            {
                key: '50%',
                stopColor: fillColor,
                stopOpacity: 0.75,
                offset: '50%'
            },
            {
                key: '100%',
                stopColor: color(fillColor).brighter(0.5).toString(),
                stopOpacity: 0.5,
                offset: '100%'
            }
        ];

        return (
            <div>
                <LiquidFillGauge
                    style={{ margin: '0 auto' }}
                    width={radius * 2}
                    height={radius * 2}
                    value={this.state.humidityReading}
                    percent="%"
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
                    textRenderer={(props) => {
                        const value = Math.round(props.value);
                        const radius = Math.min(props.height / 2, props.width / 2);
                        const textPixels = (props.textSize * radius / 2);
                        const valueStyle = {
                            fontSize: textPixels
                        };
                        const percentStyle = {
                            fontSize: textPixels * 0.6
                        };

                        return (
                            <tspan>
                                <tspan className="value" style={valueStyle}>{value}</tspan>
                                <tspan style={percentStyle}>{props.percent}</tspan>
                            </tspan>
                        );
                    }}
                    riseAnimation
                    waveAnimation
                    waveFrequency={2}
                    waveAmplitude={1}
                    gradient
                    gradientStops={gradientStops}
                    circleStyle={{
                        fill: fillColor
                    }}
                    waveStyle={{
                        fill: fillColor
                    }}
                    textStyle={{
                        fill: color('#444').toString(),
                        fontFamily: 'Arial'
                    }}
                    waveTextStyle={{
                        fill: color('#fff').toString(),
                        fontFamily: 'Arial'
                    }}
                />
                <div
                    style={{
                        margin: '20px auto',
                        width: 120
                    }}
                >
                    
                </div>
            </div>
        );
    }
}

// class Humidity extends Component {

//     constructor(props) {
//         super(props);
//         this.state = { humidityReading: 0 };
//     }

    // componentDidMount() {
    //     setInterval(() => Axios.get('/getCurrentTemperature').then(res => this.setState({ humidityReading: res.data.currentHumidity })) , 2000)
    // }

//     render() {
//         let opts = {
//             size: 250,
//             currentValue: this.state.humidityReading,
//             dialWidth: 18,
//             dialColor: '#DCF8F1',
//             progressWidth: 20,
//             progressColor: '#92CDCF',
//             tickLength: 1,
//             tickWidth: 2,
//             tickColor: '#3498DB',
//             needleColor: '#92CDCF',
//             needleBaseColor: '#92CDCF',
//             needleBaseSize: 0,
//             needleWidth: 2,
//             needleSharp: true
//         };
//         return (
//             <Gauge {...opts} />
//         );
//     }
// }

export default Humidity;
