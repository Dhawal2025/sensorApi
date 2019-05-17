import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import axios from 'axios';

class Pressure extends Component {

    constructor(props) {
        super(props);
        this.state = { pressureReading: 0 };
    }

    componentDidMount() {
        const min = 1;
        const max = 500;
        setInterval(() => axios.get('/getCurrentPressure').then(res => this.setState({pressureReading: res.data.currentPressure})) , 2000)    }

    render() {
        return(
            <ReactSpeedometer
                maxValue={500}
                value={this.state.pressureReading}
                needleColor="red"
                startColor="green"
                segments={10}
                endColor="blue"
                height="180"
            />
        );
    }
}

export default Pressure;