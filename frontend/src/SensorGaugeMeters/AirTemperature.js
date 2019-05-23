import React, { Component } from 'react';
import Gauge from 'react-radial-gauge';
import axios from 'axios';

class AirTemperature extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTemperature: 0
        };
    }

    componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => {
            this.setState({
                currentTemperature: res.data.currentTemperature
            });
            if(res.data.criticalPressure) {
                if(!this.state.pressureModalIsOpen) {
                    if(!this.state.pressureNoted) {
                        this.setState({ pressureModalIsOpen: true});
                    }
                }
            } else {
                this.setState({ pressureModalIsOpen: false, pressureNoted: false });
            }
        }) , 2000)
    }


    render() {
        let opts = {
            size: 260,
            currentValue: `${this.state.currentTemperature}`,
            dialWidth: 20,
            dialColor: '#AAC4CF',
            progressWidth: 20,
            progressColor: '#4592af',
            tickLength: 1,
            tickColor: '#3498DB',
            needleColor: '#4c8492',
            needleBaseSize: 0,
            needleBaseColor: '#AAB29A',
            needleWidth: 5,
            needleSharp: true
        }
        return(
            <Gauge {...opts} />
        );
    }
}

export default AirTemperature;