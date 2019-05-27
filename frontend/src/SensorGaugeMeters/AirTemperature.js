import React, { Component } from 'react';
import Gauge from 'react-radial-gauge';
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

class AirTemperature extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTemperature: 0,
            airTemperatureModalIsOpen: false,
            airTemperatureNoted: false
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.airTemperatureCloseModal = this.airTemperatureCloseModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }

    airTemperatureCloseModal() {
        console.log("airTemperature Close!!")
        this.setState({airTemperatureModalIsOpen: false, airTemperatureNoted: true});
        axios.get('/turnOffAlarm').then(res => console.log(res))
    }


    componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => {
            this.setState({
                currentTemperature: res.data.currentTemperature
            });
            if(res.data.criticalSmoke) {
                if(!this.state.airTemperatureModalIsOpen) {
                    if(!this.state.airTemperatureNoted) {
                        this.setState({ airTemperatureModalIsOpen: true});
                    }
                }
            } else {
                this.setState({ airTemperatureModalIsOpen: false, airTemperatureNoted: false });
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
        return ( 
            <div>
                <Gauge {...opts} />
                <Modal
                    isOpen={this.state.airTemperatureModalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.airTemperatureCloseModal}
                    style={customStyles}
                    contentLabel="Air Quality Critical"
                >
                    <h2 ref={subtitle => this.subtitle = subtitle}>Air Temperature Critical</h2>
                    <hr/>
                    <div>The Air Temperature of the region has reached beyond critical limit.</div>
                    <Button variant="contained" color="primary" onClick={this.airTemperatureCloseModal} style={{float: 'right'}}>Turn off Alarm!</Button>
                </Modal>
            </div>
        );
    }
}

export default AirTemperature;