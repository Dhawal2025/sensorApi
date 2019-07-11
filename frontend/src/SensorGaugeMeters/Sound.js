import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {hostIP} from "../../../projectConstants.js";
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
        top: '62.5%',
        left: '35%',
        right: 'auto',
        bottom: 'auto',
        width: '25%',
        height: '15%'
    }
};

const ITEM_HEIGHT = 48;

class Sound extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            soundReading: 0,
            soundModalIsOpen: false,
            storeIndexes: [],
            selectedIndex: -1,
            anchorEl: null,
            setAnchorEl: null,
            open: null,
            soundThreshold: 2500
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }
    componentDidMount() {
        try {
            client.onopen = () => {
                console.log('Sound WebSocket Client Connected');
                console.log(window.location);
            };
            client.onmessage = (message) => {
               const json = JSON.parse(message.data);
                console.log(json, "Sound JSON");
                
                if(json.sensorType == this.props.sensorType) {
                    console.log(window.location.href);
                    
                    // console.log(json.data.currentSound);
                    // this.setState({
                    //     soundReading: json.data.currentSound
                    // }) 
                    if (json.sensorIndex == this.state.selectedIndex) {
                        this.setState({
                            soundReading: json.data.currentSound,
                            soundModalIsOpen: json.data.soundCritical,
                            soundThreshold: json.data.soundThreshold
                        }) 
                    }
                       else if (json.sensorIndex > this.state.storeIndexes.slice(-1) || this.state.storeIndexes.length == 0 ) {
                            const list = [...this.state.storeIndexes, json.sensorIndex];
                            this.setState({storeIndexes: list});
                        }
                        if(this.state.storeIndexes.length == 1) {
                            this.setState({selectedIndex: this.state.storeIndexes[0]});
                        }
                }
            };
        } catch(error) {
            console.log(error);
            
        }
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
                    Sound(Analog)
                </h1>
                <h2 style={{color: "white", marginLeft: "30%"}}> Limit: {this.state.soundThreshold} </h2>
                <ReactSpeedometer
                    maxValue={2500}
                    value={this.state.soundReading}
                    needleColor="#aac4cf"
                    startColor="#348498"
                    needleColor = "#004d61"
                    segments={1}
                    needleHeightRatio={0.6}
                    height={300}
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
                        <Button variant="contained" color="primary" style={{float: 'right'}}>Turn off Alarm!</Button>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Sound;