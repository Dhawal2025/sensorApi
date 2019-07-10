import React, { Component } from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalRectSeries
} from 'react-vis';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
const location = window.location.host;
const client = new W3CWebSocket(`ws://172.16.168.29:5000/echo?connectionType=client`);

const DATA = [
//   {x0: ONE_DAY * 2, x: ONE_DAY * 3, y: 1},
//   {x0: ONE_DAY * 7, x: ONE_DAY * 8, y: 1},
//   {x0: ONE_DAY * 8, x: ONE_DAY * 9, y: 1},
//   {x0: ONE_DAY * 9, x: ONE_DAY * 10, y: 2},
//   {x0: ONE_DAY * 10, x: ONE_DAY * 11, y: 2.2},
//   {x0: ONE_DAY * 19, x: ONE_DAY * 20, y: 1},
//   {x0: ONE_DAY * 20, x: ONE_DAY * 21, y: 2.5},
//   {x0: ONE_DAY * 21, x: ONE_DAY * 24, y: 1}
    {x0: 0, x: 1, y: 1},
    {x0: 2, x: 3, y: 2},
    {x0: 7, x: 3, y: 7}
].map(el => ({x0: el.x0, x: el.x, y: el.y}));

const ITEM_HEIGHT = 48;

class Vibrations extends Component {
    
    constructor(props) {
        super(props);
        this.state = {  vibrations: [{x0: 0, x: 1, y: 0}], 
                        minX: 0, 
                        minY: 0,
                        maxX: 10,
                        maxY: 10,
                        storeIndexes: [],
                        selectedIndex: -1,
                        anchorEl: null,
                        setAnchorEl: null,
                        open: null
                    };
    }

    componentDidMount() {
        const min = 4;
        const max = 6;
                    
        try {
            client.onopen = () => {
                console.log('Vibrations WebSocket Client Connected');
                console.log(window.location);
                console.log(this.state.vibrations, "RAW Data");
                
            };
            client.onmessage = (message) => {
               const json = JSON.parse(message.data);
                
                if(json.sensorType == this.props.sensorType) {
                    console.log(window.location.href);
                    console.log(json, "Vibrations JSON");
                    console.log(json.data.currentVibration);
                    const serverData = json.data.currentVibration;
                    this.setState({maxY: Math.max(...serverData)});
                    const temp = [];
                    for (const obj in serverData) {
                        if (parseInt(obj) + 1 > this.state.maxX) this.setState({ maxX: parseInt(obj) + 2 });
                        const tempDict = {x0: obj, x: parseFloat(obj) + 0.9 , y: serverData[obj]};
                        temp.push(tempDict);                 
                    }
                    this.setState({vibrations: temp});
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

render () {
    console.log(this.state);
    return (
        <div>
            <IconButton
                    aria-label="More"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    style={{marginLeft: "-25%"}}
                    onClick={this.handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <h1 style={{color: "white", marginLeft: "30%"}} >
                    Vibrations
                </h1>
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
                <XYPlot
                xDomain={[this.state.minX, this.state.maxX]}
                yDomain={[this.state.minY, this.state.maxY]}
                width={500}
                height={300}
                >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis style={{
                    line: {stroke: '#ADDDE1'},
                    ticks: {stroke: '#ADDDE1'},
                    text: {stroke: 'none', fill: '#6b6b76', fontWeight: 600}
                }}/>
                <YAxis style={{
                    line: {stroke: '#ADDDE1'},
                    ticks: {stroke: '#ADDDE1'},
                    text: {stroke: 'none', fill: '#6b6b76', fontWeight: 600}
                }}/>
                <VerticalRectSeries data={this.state.vibrations} style={{stroke: '#000'}} />
                </XYPlot>
                </div>
    );
}
}

export default Vibrations;