import React, {Component} from 'react';
import Gauge from 'react-radial-gauge';
import Axios from 'axios';

class Humidity extends Component {

    constructor(props) {
        super(props);
        this.state = { humidityReading: 0 };
    }

    componentDidMount() {
        setInterval(() => Axios.get('/getCurrentTemperature').then(res => this.setState({ humidityReading: res.data.currentHumidity })) , 2000)
    }

    render() {
        let opts = {
            size: 250,
            currentValue: this.state.humidityReading,
            dialWidth: 18,
            dialColor: '#DCF8F1',
            progressWidth: 20,
            progressColor: '#92CDCF',
            tickLength: 1,
            tickWidth: 2,
            tickColor: '#3498DB',
            needleColor: '#92CDCF',
            needleBaseColor: '#92CDCF',
            needleWidth: 2,
            needleSharp: true
        };
        return (
            <Gauge {...opts} />
        );
    }
}

export default Humidity;
