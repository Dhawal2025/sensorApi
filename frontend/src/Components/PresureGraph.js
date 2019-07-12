  
import React, { Component } from 'react';
import RTChart from 'react-rt-chart';
import '../css/c3.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {sensorType} from '../../../projectConstants';
import Axios from 'axios';
import Nav from '../Components/Nav';
const client = new W3CWebSocket(`ws://localhost:5000/echo?connectionType=client`);

class PressureGraph extends Component {
    
    constructor(props) {
        super(props);
        this.state = { y: 0, x: 0, z: 0, pressure: 2 };
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
        client.onopen = () => console.log("Pressure Graph Connected");
        client.onmessage = (message) => {
            const json = JSON.parse(message.data);
            if (json.sensorType = sensorType.PRESSURE) this.setState({temp: json.data.currentPressure});
            console.log(this.state.pressure);
        }
        // setInterval(() => this.setState({ temp: Math.floor(Math.random()*(max-min+1)+min)}),0)
    }
    render() {
        var data = {
            date: new Date(),
            pressure: this.state.pressure,
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
                y: { min: 0, max: 4 }
            },
            point: {
                show: false
            },
        };
        return (
            <div>
                <RTChart
            chart = {chart}
            fields={['pressure' ]}
            maxValues={20}
            data={data} />
            </div>
        );
    }
}

export default PressureGraph;