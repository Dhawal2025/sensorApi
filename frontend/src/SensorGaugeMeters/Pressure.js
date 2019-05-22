import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
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
        top: '62.5%',
        left: '10.5%',
        right: 'auto',
        bottom: 'auto',
        width: '25%',
        height: '25%'
    }
};

class Pressure extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            pressureReading: 0,
            pressureModalIsOpen: false,
            pressureNoted: false
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.pressureCloseModal = this.pressureCloseModal.bind(this);
    }

    afterOpenModal() {
        this.subtitle.style.color = '#000';
    }
    
    pressureCloseModal() {
        console.log("Pressure Close!!");
        this.setState({pressureModalIsOpen: false, pressureNoted: true});
    }

    componentDidMount() {
        const min = 1;
        const max = 500;
        setInterval(() => axios.get('/getCurrentPressure').then(res => {
            this.setState({pressureReading: res.data.currentPressure});
            if(res.data.critical) {
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
        return(
            <div>
                <ReactSpeedometer
                    maxValue={500}
                    value={this.state.pressureReading}
                    needleColor="#aac4cf"
                    startColor="#7b88ff"
                    endColor="#49beb7"
                    segments={10}
                    height="180"
                />
                <div>
                    <Modal
                    isOpen={this.state.pressureModalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    style={customStyles}
                    contentLabel="Pressure Critical"
                    >
                        <h2 ref={subtitle => this.subtitle = subtitle}>Pressure Critical</h2>
                        <hr/>
                        <div>The pressure of the region has reached beyond critical limit.</div>
                        <Button variant="contained" color="primary" onClick={this.pressureCloseModal} style={{float: 'right'}}>Ok Noted!</Button>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Pressure;