import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        zIndex: 1000
      },
    content : {
        top: '12.5%',
        left: '12.5%',
        right: 'auto',
        bottom: 'auto',
        width: '25%',
        height: '25%'
    }
};

class AirQuality extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPpm: 0,
            maxPpm: 0,
            averagePpm: 0,
            ppmModalIsOpen: false,
            ppmNoted: false
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.ppmCloseModal = this.ppmCloseModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }

    ppmCloseModal() {
        console.log("Ppm Close!!")
        this.setState({ppmModalIsOpen: false, ppmNoted: true});
        axios.get('/turnOffAlarm').then(res => console.log(res))
    }

    componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => {
            this.setState({
                currentPpm: res.data.currentPpm, 
                maxPpm: res.data.maxPpm,
                averagePpm: res.data.averagePpm
                });
            if(res.data.criticalPpm) {
                if(!this.state.ppmModalIsOpen) {
                    if(!this.state.ppmNoted) {
                        this.setState({ ppmModalIsOpen: true});
                    }
                }
            } else {
                this.setState({ ppmModalIsOpen: false, ppmNoted: false });
            }
        }) , 2000)
    }


    render() {
        return (
            <div>
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
                        {this.state.currentPpm}
                    </TableCell>
                    <TableCell align="center" style={{color: 'white', fontSize: 20}}>
                        {this.state.averagePpm}
                    </TableCell>
                    <TableCell align="center" style={{color: 'white', fontSize: 20}}>
                        {this.state.maxPpm}
                    </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Modal
                isOpen={this.state.ppmModalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.ppmCloseModal}
                style={customStyles}
                contentLabel="Air Quality Critical"
            >
                <h2 ref={subtitle => this.subtitle = subtitle}>Air Quality Critical</h2>
                <hr/>
                <div>The Air Quality of the region has reached beyond critical limit.</div>
                <Button variant="contained" color="primary" onClick={this.ppmCloseModal} style={{float: 'right'}}>Turn off Alarm!</Button>
            </Modal>
            </div>
        );
    }
}

export default AirQuality;