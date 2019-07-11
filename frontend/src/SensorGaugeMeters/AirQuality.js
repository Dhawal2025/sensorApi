import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import {hostIP} from "../../../projectConstants.js";
import { w3cwebsocket as W3CWebSocket } from "websocket";


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
        left: '19.5%',
        right: 'auto',
        bottom: 'auto',
        width: '25%',
        height: '25%'
    }
};

class AirQuality extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentCO2: 0,
            currentLPG: 0,
            currentMethane: 0,
            currentSmoke: 0,
            criticalCO2: false,
            criticalLPG: false,
            criticalMethane:false,
            criticalSmoke: true,
            airQualityModalIsOpen: false,
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }

    componentDidMount() {
        // setInterval(() => axios.get('/getCurrentTemperature').then(res => {
        //     this.setState({

        //         currentPpm: Math.floor(res.data.currentPpm), 
        //         maxPpm: Math.floor(res.data.maxPpm),
        //         averagePpm: Math.floor(res.data.averagePpm)
        //         });
        //     if(res.data.criticalPpm) {
        //         if(!this.state.ppmModalIsOpen) {
        //             if(!this.state.ppmNoted) {
        //                 this.setState({ ppmModalIsOpen: true});
        //             }
        //         }
        //     } else {
        //         this.setState({ ppmModalIsOpen: false, ppmNoted: false });
        //     }
        // }) , 2000)
        try {
            client.onopen = () => {
                console.log('Air WebSocket Client Connected');
            };
            client.onmessage = (message) => {
               const json = JSON.parse(message.data);
                
                if(json.sensorType == this.props.sensorType) {
                    console.log(window.location.href);
                    
                        this.setState({
                            soundReading: json.data.currentSound,
                            currentLPG: json.data.currentLPG,
                            currentMethane: json.data.currentMethane,
                            currentCO2: json.data.currentCO2,
                            currentSmoke: json.data.currentSmoke,
                            criticalCO2: json.data.criticalCO2,
                            criticalLPG: json.data.criticalLPG,
                            criticalMethane: json.data.criticalMethane,
                            criticalSmoke: json.data.criticalSmoke
                        });
                        if (json.data.criticalCO2 || json.data.criticalLPG || json.data.criticalMethane || json.data.criticalSmoke)
                            this.setState({airQualityModalIsOpen: true});
                        else this.setState({airQualityModalIsOpen: false});
                }
            };
        } catch(error) {
            console.log(error);
            
        }
    }


    render() {
        return (
            <div>
                <Table style={{width: '25%'}}>
                <TableHead>
                    <TableRow>
                        <TableCell  component="th" style={{color: 'white', fontSize: 20}}>LPG</TableCell>
                        <TableCell align="right"  style={{color: 'white', fontSize: 20}}>CO2</TableCell>
                        <TableCell align="right"  style={{color: 'white', fontSize: 20}}>Methane</TableCell>
                        <TableCell align="right"  style={{color: 'white', fontSize: 20}}>Smoke</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="center" style={{color: 'white', fontSize: 20}}>
                            {this.state.currentLPG}
                        </TableCell>
                        <TableCell align="center" style={{color: 'white', fontSize: 20}}>
                            {this.state.currentCO2}
                        </TableCell>
                        <TableCell align="center" style={{color: 'white', fontSize: 20}}>
                            {this.state.currentMethane}
                        </TableCell>
                        <TableCell align="center" style={{color: 'white', fontSize: 20}}>
                            {this.state.currentSmoke}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Modal
                isOpen={this.state.airQualityModalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.ppmCloseModal}
                style={customStyles}
                contentLabel="Air Quality Critical"
            >
                <h2 ref={subtitle => this.subtitle = subtitle}>Critical Alert</h2>
                <hr/>
                <div>The { this.state.criticalCO2 ? 'CO2': this.state.criticalLPG ? 'LPG' : this.state.criticalMethane ? 'Methane' : this.state.criticalSmoke ? 'Smoke' : null } of the region has reached beyond critical limit.</div>
                <Button variant="contained" color="primary"  style={{float: 'right'}}>Run Exhaust!</Button>
            </Modal>
            </div>
        );
    }
}

export default AirQuality;