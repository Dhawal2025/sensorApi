import React, { Component } from 'react';
import Gauge from 'react-radial-gauge';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import constants from "../../../projectConstants.js"
const location = window.location.host;
const client = new W3CWebSocket(`${window.location.protocol == 'http:' ? 'ws' : 'wss'}://${location}/echo?connectionType=client`);

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

class AirTemperature extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTemperature: 0,
            airTemperatureModalIsOpen: false,
            airTemperatureNoted: false
        };
        console.log(props, "Air temperature")
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.airTemperatureCloseModal = this.airTemperatureCloseModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }

    airTemperatureCloseModal() {
        console.log("airTemperature Close!!")
        this.setState({airTemperatureModalIsOpen: false, airTemperatureNoted: true});
        axios.get('/turnOffAlarm').then(res => console.log(res))
    }


    componentDidMount() {
        try {
            client.onopen = () => {
                console.log('Air Temperature WebSocket Client Connected');
                console.log(window.location);
            };
            client.onmessage = (message) => {
               const json = JSON.parse(message.data);
                console.log(json, "TEMP JSON");
                
                if(json.sensorType == this.props.sensorType) {
                    console.log(window.location.href);
                    
                    console.log(json.data.currentTemperature);
                    this.setState({
                        currentTemperature: json.data.currentTemperature
                    }) 
                }
            };
        } catch(error) {
            console.log(error);            
        }
    }


    render() {
        let opts = {
            size: 260,
            currentValue: `${this.state.currentTemperature}`,
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
        return ( 
            <div>
                <Gauge {...opts} />
                <Modal
                    isOpen={this.state.airTemperatureModalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.airTemperatureCloseModal}
                    style={customStyles}
                    contentLabel="Air Quality Critical"
                >
                    <h2 ref={subtitle => this.subtitle = subtitle}>Smoke Detected</h2>
                    <hr/>
                    <div>Smoke has been detected in the region.</div>
                    <Button variant="contained" color="primary" onClick={this.airTemperatureCloseModal} style={{float: 'right'}}>Turn off Alarm!</Button>
                </Modal>
            </div>
        );
    }
}

export default AirTemperature;