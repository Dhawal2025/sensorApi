import React, { Component } from 'react';
import RTChart from 'react-rt-chart';
import '../css/c3.css';
import Axios from 'axios';

class Vibrations extends Component {
    
    constructor(props) {
        super(props);
        this.state = { y: 0, x: 0, z: 0 };
    }

    componentDidMount() {
        const min = 4;
        const max = 6;
        setInterval( () => Axios.get('/getCurrentVibrations').then(res =>{
            this.setState({ 
                x: res.data.currentX,
                y: res.data.currentY,
                z: res.data.currentZ
            })
        }), 1000)
        // setInterval(() => this.setState({ x: Math.floor(Math.random()*(max-min+1)+min), y: Math.floor(Math.random()*(max-min+1)+min), z: Math.floor(Math.random()*(max-min+1)+min) }), 1000)
    }
    render() {
        var data = {
            date: new Date(),
            y_axis: this.state.y,
            x_axis: this.state.x,
            z_axis: this.state.z
          };
        var chart = {
            size: {
                height: '300'
            },
            margin: {
                top: 50,
                right: 50
            },
            axis: {
                y: { min: -3, max: 3 }
            },
            point: {
                show: false
            },
        };
        return (
            <RTChart
            chart = {chart}
            fields={['x_axis', 'y_axis', 'z_axis']}
            maxValues={10}
            data={data} />
        );
    }
}

export default Vibrations;