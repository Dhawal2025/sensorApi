import React, { Component } from 'react';
import Gauge from 'react-radial-gauge';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';

import axios from 'axios';

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
            tempReading: 0,
            tempModalIsOpen: false,
            tempNoted: false
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.tempCloseModal = this.tempCloseModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }
    
    tempCloseModal() {
        console.log("Temperature Close!!")
        this.setState({tempModalIsOpen: false, tempNoted: true});
        axios.get('/turnOffAlarm').then(res => console.log(res))
    }

    componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => {
            this.setState({tempReading: res.data.currentTemperature})
            if(res.data.criticalSmoke) {
                if(!this.state.tempModalIsOpen) {
                    if(!this.state.tempNoted) {
                        this.setState({ tempModalIsOpen: true});
                    }
                }
            } else {
                this.setState({ tempModalIsOpen: false, tempNoted: false });
            }
        }) , 2000)
    }

    render() {
        let opts = {
            size: 260,
            currentValue: this.state.tempReading,
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
            <div>
                <Gauge {...opts} />
                <div>
                    <Modal
                    isOpen={this.state.tempModalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.tempCloseModal}
                    style={customStyles}
                    contentLabel="Temperature Critical"
                    >
                        <h2 ref={subtitle => this.subtitle = subtitle}>Smoke Detected</h2>
                        <hr/>
                        <div>Smoke Detected in the vicinity.</div>
                        <Button variant="contained" color="primary" onClick={this.tempCloseModal} style={{float: 'right'}}>Turn off Alarm!</Button>
                    </Modal>
                </div>

            </div>
        );
    }
}

export default AirTemperature;