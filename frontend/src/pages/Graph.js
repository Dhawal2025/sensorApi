  
import React, { Component } from 'react';
import RTChart from 'react-rt-chart';
import '../css/c3.css';
import Axios from 'axios';
import Nav from '../Components/Nav';
import TemperatureGraph from '../Components/TemperatureGraph';
import PressureGraph from '../Components/PresureGraph';

class Graph extends Component {
    
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
        // setInterval(() => this.setState({ temp: Math.floor(Math.random()*(max-min+1)+min)}),0)
    }
    render() {
        return (
            <div>
                <Nav />
                <center><h1 style={{fontSize: 40}}>Furnance Temperature</h1></center>
                <TemperatureGraph />
                <center><h1 style={{fontSize: 40}}>Pressure</h1></center>
                <PressureGraph />
            </div>
        );
    }
}

export default Graph;