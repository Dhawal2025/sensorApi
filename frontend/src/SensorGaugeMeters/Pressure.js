import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import constants from "../../../projectConstants.js"
const location = window.location.host;
console.log(window.location.protocol);

const client = new W3CWebSocket(`${window.location.protocol == 'http:' ? 'ws' : 'wss'}://${location}?connectionType=client`);

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
        top: '62.5%',
        left: '10.5%',
        right: 'auto',
        bottom: 'auto',
        width: '25%',
        height: '25%'
    }
};

class Pressure extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            pressureReading: 0,
            pressureModalIsOpen: false,
            pressureNoted: false
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.pressureCloseModal = this.pressureCloseModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }
    
    pressureCloseModal() {
        console.log("Pressure Close!!");
        this.setState({pressureModalIsOpen: false, pressureNoted: true});
        axios.get('/turnOffAlarm').then(res => console.log(res))
    }

    componentDidMount() {
        const min = 1;
        const max = 500;
        client.onopen = () => {
            console.log('WebSocket Client Connected');
            console.log(window.location);
        };
        client.onmessage = (message) => {
            const json = JSON.parse(message.data);
            if(json.sensorType == constants.sensorType.PRESSURE) {
                console.log(window.location.href);
                
                console.log(json.data.currentPressure);
                this.setState({
                    pressureReading: json.data.currentPressure
                }) 
            }
        };
    }

    render() {
        return(
            <div>
                <ReactSpeedometer
                    maxValue={120000}
                    minValue={95000}
                    value={this.state.pressureReading}
                    needleColor="#aac4cf"
                    startColor="#7b88ff"
                    endColor="#49beb7"
                    segments={5}
                    height="180"
                />
                <div>
                    <Modal
                    isOpen={this.state.pressureModalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    style={customStyles}
                    contentLabel="Pressure Critical"
                    >
                        <h2 ref={subtitle => this.subtitle = subtitle}>Pressure Critical</h2>
                        <hr/>
                        <div>The pressure of the region has reached beyond critical limit.</div>
                        <Button variant="contained" color="primary" onClick={this.pressureCloseModal} style={{float: 'right'}}>Turn off Alarm!</Button>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Pressure;