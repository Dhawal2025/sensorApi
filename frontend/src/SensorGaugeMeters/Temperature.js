import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Thermometer from 'react-thermometer-component';
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
        left: '62.5%',
        right: 'auto',
        bottom: 'auto',
        width: '25%',
        height: '25%'
    }
};

class Temperature extends Component {

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
    }

    componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => {
            this.setState({tempReading: res.data.currentTemperature})
            if(res.data.critical) {
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
        return(
            <div>
                <Thermometer
                    theme="dark"
                    value={this.state.tempReading}
                    max="100"
                    steps="3"
                    format="°C"
                    size="large"
                    height="250"
                    reverseGradient={true}
                />
                <div>
                    <Modal
                    isOpen={this.state.tempModalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.tempCloseModal}
                    style={customStyles}
                    contentLabel="Temperature Critical"
                    >
                        <h2 ref={subtitle => this.subtitle = subtitle}>Temperature Critical</h2>
                        <hr/>
                        <div>The temperature of the region has reached beyond critical limit.</div>
                        <Button variant="contained" color="primary" onClick={this.tempCloseModal} style={{float: 'right'}}>Ok Noted!</Button>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Temperature;