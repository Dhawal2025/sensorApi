import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';

class AirQuality extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPpmReading: 0,
            averagePpmReading: 2,
            maxPpmReading: 3,
            humModalIsOpen: false,
            humNoted: false
        };
    }

    componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => {
            this.setState({
                currentPpmReading: Math.floor(res.data.currentPpm),
                averagePpmReading: Math.floor(res.data.averagePpm),
                maxPpmReading: Math.floor(res.data.maxPpm),                
            });
        }) , 2000)
    }


    render() {
        return (
            <Table style={{width: '25%'}}>
                <TableHead>
                    <TableRow>
                        <TableCell  component="th" style={{color: 'white', fontSize: 20}}>Current</TableCell>
                        <TableCell align="right"  style={{color: 'white', fontSize: 20}}>Avg</TableCell>
                        <TableCell align="right"  style={{color: 'white', fontSize: 20}}>Max</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                    <TableCell align="center" style={{color: 'white', fontSize: 20}}>
                        {this.state.currentPpmReading}
                    </TableCell>
                    <TableCell align="center" style={{color: 'white', fontSize: 20}}>{this.state.averagePpmReading}</TableCell>
                    <TableCell align="center" style={{color: 'white', fontSize: 20}}>{this.state.maxPpmReading}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
}

export default AirQuality;