import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";
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
        left: '10.5%',
        right: 'auto',
        bottom: 'auto',
        width: '25%',
        height: '25%'
    }
};

class Sound extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            soundReading: 0,
            soundModalIsOpen: false,
            soundNoted: false
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.soundCloseModal = this.soundCloseModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }
    
    soundCloseModal() {
        console.log("sound Close!!");
        this.setState({soundModalIsOpen: false, soundNoted: true});
        axios.get('/turnOffAlarm').then(res => console.log(res))
    }

    componentDidMount() {
        try {
            client.onopen = () => {
                console.log('Sound WebSocket Client Connected');
                console.log(window.location);
            };
            client.onmessage = (message) => {
               const json = JSON.parse(message.data);
                console.log(json, "TEMP JSON");
                
                if(json.sensorType == this.props.sensorType) {
                    console.log(window.location.href);
                    
                    console.log(json.data.soundReading);
                    this.setState({
                        soundReading: json.data.soundReading
                    }) 
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
                    maxValue={100}
                    value={this.state.soundReading}
                    needleColor="#aac4cf"
                    startColor="#348498"
                    needleColor = "#004d61"
                    segments={1}
                    needleHeightRatio={0.6}
                    height={180}
                    needleTransition="easeElastic"
                    needleTransitionDuration={4000}
                    ringWidth={100}
                />
                <div>
                    <Modal
                    isOpen={this.state.soundModalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    style={customStyles}
                    contentLabel="sound Critical"
                    >
                        <h2 ref={subtitle => this.subtitle = subtitle}>Sound Critical</h2>
                        <hr/>
                        <div>The Sound of the region has reached beyond critical limit.</div>
                        <Button variant="contained" color="primary" onClick={this.soundCloseModal} style={{float: 'right'}}>Turn off Alarm!</Button>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Sound;