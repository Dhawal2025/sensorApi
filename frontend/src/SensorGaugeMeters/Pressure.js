import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import constants from "../../../projectConstants.js"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const location = window.location.host;
const client = new W3CWebSocket(`ws://localhost:5000/echo?connectionType=client`);

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
    },
    
};
const ITEM_HEIGHT = 48;


class Pressure extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            pressureReading: 0,
            pressureModalIsOpen: false,
            differenceIncreased: false,
            storeIndexes: [],
            selectedIndex: -1,
            anchorEl: null,
            setAnchorEl: null,
            open: null
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }
    
    malfunctionCloseModal = () => {
        this.setState({differenceIncreased: false, differenceIncreasedNoted: true});
    }
    
      handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget});
        this.setState({open: true});
      }
    
     handleClose = () => {
        this.setState({anchorEl: null});
        this.setState({open: false});
      }

      handleMenuItemClick = (event, option) => {
          console.log(option, "option");
          this.setState({selectedIndex: option, open: false});
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
                        pressureReading: (json.data.currentPressure)/100000,
                        differenceIncreased: json.data.differenceIncreased,
                        pressureModalIsOpen: json.data.pressureCritical
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
                <IconButton
                    aria-label="More"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    style={{marginLeft: "-65%"}}
                    onClick={this.handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={this.state.open}
                    onClose={this.handleClose}
                    PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: 200,
                    },
                    }}
                >
                    {this.state.storeIndexes.map(option => (
                    <MenuItem key={option} selected={option === this.state.selectedIndex} onClick={event => this.handleMenuItemClick(event, option)}>
                        Sensor {option}
                    </MenuItem>
                    ))}
                </Menu>
                <h1 style={{color: "white", marginLeft: "20%"}} >
                    Pressure(Bar)
                </h1>
                <ReactSpeedometer
                    maxValue={2}
                    minValue={0}
                    value={this.state.pressureReading}
                    needleColor="#aac4cf"
                    startColor="#7b88ff"
                    endColor="#49beb7"
                    segments={5}
                    height={300}
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
                        <Button variant="contained" color="primary"  style={{float: 'right'}}>Turn off Alarm!</Button>
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