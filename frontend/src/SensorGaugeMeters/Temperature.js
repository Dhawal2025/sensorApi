import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Thermometer from 'react-thermometer-component';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import constants from "../../../projectConstants.js";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
const location = window.location.host;
const client = new W3CWebSocket(`ws://172.16.168.29:5000/echo?connectionType=client`);

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
        left: '71.5%',
        right: 'auto',
        bottom: 'auto',
        width: '25%',
        height: '25%'
    }
};

const ITEM_HEIGHT = 48;

class Temperature extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            tempReading: 0,
            tempModalIsOpen: false,
            tempNoted: false,
            maxTemperature: 1000,
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

    componentDidMount() {
        client.onopen = () => {
            console.log('Furnance Temperature WebSocket Client Connected');
            console.log(window.location);
        };
        client.onmessage = (message) => {
           try {
            const json = JSON.parse(message.data);
            console.log(json, "Furnance TEMP JSON");
            
            if(json.sensorType == this.props.sensorType) {
                console.log(window.location.href);
                console.log(this.state.storeIndexes, "Indexes");
                
                // console.log(json.data.currentTemperature);
                // this.setState({
                //     tempReading: json.data.currentTemperature
                // }) 
                if (json.sensorIndex == this.state.selectedIndex) {
                    this.setState({
                        tempReading: json.data.currentTemperature,
                        tempModalIsOpen: json.data.temperatureCritical,
                        maxTemperature: json.data.temperatureUpperLimit
                    }) 
                    if (json.data.currentTemperature > 200) {
                        this.setState({tempModalIsOpen: true});
                    }
                }
                else if (json.sensorIndex > this.state.storeIndexes.slice(-1) || this.state.storeIndexes.length == 0 ) {
                    const list = [...this.state.storeIndexes, json.sensorIndex];
                    this.setState({storeIndexes: list});
                }
                if(this.state.storeIndexes.length == 1) {
                    this.setState({selectedIndex: this.state.storeIndexes[0]});
                }
            }
           } catch(error) {
            console.log(error);
        }
        };
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

    render() {
        return(
            <div>
                <IconButton
                    aria-label="More"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    style={{marginLeft: "-180%"}}
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
                <h1 style={{color: "white"}}> 
                    Furnance<br/>(Celsius)
                </h1>
                <Thermometer
                    theme="dark"
                    value={this.state.tempReading}
                    max={this.state.maxTemperature}
                    steps="3"
                    format="°C"
                    size="large"
                    height="250"
                    reverseGradient={false}
                    style={{marginLeft: "90%"}}
                />
                <div>
                    <Modal
                    isOpen={this.state.tempModalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.tempCloseModal}
                    style={customStyles}
                    contentLabel="Temperature Critical"
                    >
                        <h2 ref={subtitle => this.subtitle = subtitle}>Furnace Temperature Critical</h2>
                        <hr/>
                        <div>The temperature of the Furnace has reached beyond critical limit.</div>
                        <Button variant="contained" color="primary"  style={{float: 'right'}}>Turn off Alarm!</Button>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Temperature;