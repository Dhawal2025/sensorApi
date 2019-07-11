import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import axios from 'axios';
import LiquidFillGauge from 'react-liquid-gauge';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {hostIP} from "../../../projectConstants.js";
const location = window.location.host;
const client = new W3CWebSocket(`ws://${hostIP}/echo?connectionType=client`);

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        zIndex: 1000
      },
    content : {
        top: '12.5%',
        left: '12.5%',
        right: 'auto',
        bottom: 'auto',
        width: '25%',
        height: '25%'
    }
};

class Humidity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            humidityReading: 0,
            humModalIsOpen: false,
            humNoted: false
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.humCloseModal = this.humCloseModal.bind(this);
    }

    startColor = '#4592af'; 
    endColor = '#4c8492'; 
    
    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }

    humCloseModal() {
        console.log("Humidity Close!!")
        this.setState({humModalIsOpen: false, humNoted: true});
        axios.get('/turnOffAlarm').then(res => console.log(res))
    }

    componentDidMount() {
        try {
            client.onopen = () => {
                console.log('Humidity WebSocket Client Connected');
                console.log(window.location);
            };
            client.onmessage = (message) => {
               const json = JSON.parse(message.data);
                console.log(json, "TEMP JSON");
                
                if(json.sensorType == this.props.sensorType) {
                    console.log(window.location.href);
                    
                    console.log(json.data.currentHumidity);
                    this.setState({
                        humidityReading: json.data.currentHumidity
                    }) 
                }
            };
        } catch(error) {
            console.log(error);            
        }
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
        const styles = {
            center: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems : "center",
            }
          };

        return (
            <div>
                <div style={styles.center}>
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
                {/* <p style={{color: 'white'}}> Humidity Sensor </p> */}
                </div>
                <div
                    style={{
                        margin: '20px auto',
                        width: 120
                    }}
                >
                    
                </div>
                <div>
                    <Modal
                        isOpen={this.state.humModalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.humCloseModal}
                        style={customStyles}
                        contentLabel="Humidity Critical"
                    >
                        <h2 ref={subtitle => this.subtitle = subtitle}>Humidity Critical</h2>
                        <hr/>
                        <div>The humidity of the region has reached beyond critical limit.</div>
                        <Button variant="contained" color="primary" onClick={this.humCloseModal} style={{float: 'right'}}>Turn off Alarm!</Button>
                    </Modal>
                </div>
            </div>
        );
    }
}


export default Humidity;
