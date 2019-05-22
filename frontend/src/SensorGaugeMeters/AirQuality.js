import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class AirQuality extends Component {

    componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => {
            this.setState({pressureReading: res.data.currentPressure});
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
                        0
                    </TableCell>
                    <TableCell align="center" style={{color: 'white', fontSize: 20}}>50</TableCell>
                    <TableCell align="center" style={{color: 'white', fontSize: 20}}>100</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
}

export default AirQuality;