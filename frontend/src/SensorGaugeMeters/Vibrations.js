import React, { Component } from 'react';
import RTChart from 'react-rt-chart';
import '../css/c3.css';

class Vibrations extends Component {
    
    constructor(props) {
        super(props);
        this.state = { car: 0 };
    }

    componentDidMount() {
        const min = 1;
        const max = 10;
        setInterval(() => this.setState({ car: Math.floor(Math.random()*(max-min+1)+min) }), 1000)
    }
    render() {
        var data = {
            date: new Date(),
            Car: this.state.car,
          };
        var chart = {
            size: {
                height: '300'
            },
            margin: {
                top: 50,
                right: 50
            }
        };
        return (
            <RTChart
            chart = {chart}
            fields={['Car']}
            data={data} />
        );
    }
}

export default Vibrations;