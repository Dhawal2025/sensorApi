import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import axios from 'axios';
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
        top: '62.5%',
        left: '1%',
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
            pressureReading: 90000,
            pressureModalIsOpen: false,
            pressureNoted: false,
            differenceIncreased: false,
            storeIndexes: [],
            selectedIndex: -1
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.pressureCloseModal = this.pressureCloseModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }
    
    malfunctionCloseModal = () => {
        this.setState({differenceIncreased: false, differenceIncreasedNoted: true});
    }

    pressureCloseModal() {
        console.log("Pressure Close!!");
        this.setState({pressureModalIsOpen: false, pressureNoted: true});
        axios.get('/turnOffAlarm').then(res => console.log(res))
    }

    componentDidMount() {
        try {
            client.onopen = () => {
                console.log('Pressure WebSocket Client Connected');
                console.log(window.location);
            };
            client.onmessage = (message) => {
                const json = JSON.parse(message.data);
                if(json.sensorType == constants.sensorType.PRESSURE) {
                                    
                   if (json.sensorIndex == this.state.selectedIndex) {
                    this.setState({
                        pressureReading: json.data.currentPressure,
                        differenceIncreased: json.data.differenceIncreased
                    }) 
                   }
                   else if (json.sensorIndex > this.state.storeIndexes.slice(-1) || this.state.storeIndexes.length == 0 ) {
                        const list = [...this.state.storeIndexes, json.sensorIndex];
                        this.setState({storeIndexes: list});
                    }
                    if(this.state.storeIndexes.length == 1) {
                        this.setState({selectedIndex: this.state.storeIndexes[0]});
                    }
                    if (!this.state.differenceIncreased && this.state.differenceIncreasedNoted) {
                        this.setState({differenceIncreasedNoted: false});
                    }
                    console.log(this.state.differenceIncreasedNoted, "DIfference Increased Noted");
                }
            };
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        return(
            <div>
                <ReactSpeedometer
                    maxValue={110000}
                    minValue={90000}
                    value={this.state.pressureReading}
                    needleColor="#aac4cf"
                    startColor="#7b88ff"
                    endColor="#49beb7"
                    segments={5}
                    height={180}
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
                <div>
                    <Modal
                    isOpen={this.state.differenceIncreased && !this.state.differenceIncreasedNoted}
                    onAfterOpen={this.afterOpenModal}
                    style={customStyles}
                    contentLabel="Difference Increased"
                    >
                        <h2 ref={subtitle => this.subtitle = subtitle}>Sensor Malfunction</h2>
                        <hr/>
                        <div>One of the pressure sensor is malfunctioning.</div>
                        <Button variant="contained" color="primary" onClick={this.malfunctionCloseModal} style={{float: 'right'}}>OK!</Button>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Pressure;