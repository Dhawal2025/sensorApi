import React, { Component } from 'react';
import Thermometer from 'react-thermometer-component';
import axios from 'axios';

class Temperature extends Component {

    constructor(props) {
        super(props);
        this.state = { tempReading: 0 };
    }

     componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => this.setState({tempReading: res.data.currentTemperature})) , 2000)
    }

    render() {
        return(
            <Thermometer
                theme="light"
                value={this.state.tempReading}
                max="100"
                steps="3"
                format="°C"
                size="large"
                height="250"
            />
        );
    }
}

export default Temperature;