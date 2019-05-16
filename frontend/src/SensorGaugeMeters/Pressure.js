import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";

class Pressure extends Component {

    constructor(props) {
        super(props);
        this.state = { tempReading: 0 };
    }

    componentDidMount() {
        const min = 1;
        const max = 500;
        setInterval(() => this.setState({ tempReading: Math.floor(Math.random()*(max-min+1)+min) }), 1000)
    }

    render() {
        return(
            <ReactSpeedometer
                maxValue={500}
                value={this.state.tempReading}
                needleColor="#aac4cf"
                startColor="#7b88ff"
                endColor="#49beb7"
                segments={10}
                height="180"
            />
        );
    }
}

export default Pressure;