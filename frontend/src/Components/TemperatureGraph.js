  
import React, { Component } from 'react';
import RTChart from 'react-rt-chart';
import '../css/c3.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {sensorType} from '../../../projectConstants';
import Axios from 'axios';
import Nav from '../Components/Nav';
const client = new W3CWebSocket(`ws://localhost:5000/echo?connectionType=client`);

class TemperatureGraph extends Component {
    
    constructor(props) {
        super(props);
        this.state = { y: 0, x: 0, z: 0 };
    }

    componentDidMount() {
        const min = 4;
        const max = 6;
        /*setInterval( () => Axios.get('/getCurrentVibrations').then(res =>{
            this.setState({ 
                x: res.data.currentX,
                y: res.data.currentY,
                z: res.data.currentZ
            })
        }), 2000)*/
        // client.onopen = () => console.log("Temperature Graph Connected");
        // client.onmessage = (message) => {
        //     const json = JSON.parse(message.data);
        //     if (json.sensorType = sensorType.TEMPERATURE) this.setState({temp: json.data.currentTemperature});
        //     console.log(this.state.temp);
        // }
        // setInterval(() => this.setState({ temp: Math.floor(Math.random()*(max-min+1)+min)}),0)
        setInterval(() => Axios.get('/getAllTemperatures').then((res)=> {
            res.data.map(data=> this.setState({temp: data.temperature}));
        }), 6000);
    }
    render() {
         console.log(this.state.x, this.state.y, this.state.z);
        var data = {
            date: new Date(),
            temperature: this.state.temp,
          };
        var chart = {
            size: {
                height: '400'
            },
            margin: {
                top: 50,
                right: 50
            },
            axis: {
                y: { min: 0, max: 100 }
            },
            point: {
                show: false
            },
        };
        return (
            <div>
                <RTChart
            chart = {chart}
            fields={['temperature' ]}
            maxValues={30}
            data={data} />
            </div>
        );
    }
}

export default TemperatureGraph;