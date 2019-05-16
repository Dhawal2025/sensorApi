import React, { Component } from 'react';
import Thermometer from 'react-thermometer-component'

class Temperature extends Component {

    constructor(props) {
        super(props);
        this.state = { tempReading: 0 };
    }

    componentDidMount() {
        const min = 1;
        const max = 100;
        setInterval(() => this.setState({ tempReading: Math.floor(Math.random()*(max-min+1)+min) }), 1000)
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