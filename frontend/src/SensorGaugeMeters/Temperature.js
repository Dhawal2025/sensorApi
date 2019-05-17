import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Thermometer from 'react-thermometer-component';
import axios from 'axios';

class Temperature extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            tempReading: 0,
            open: false,
            noted: false
        };
    }

    componentDidMount() {
        setInterval(() => axios.get('/getCurrentTemperature').then(res => {
            this.setState({tempReading: res.data.currentTemperature})
            if(res.data.critical) {
                if(!this.state.open) {
                    if(!this.state.noted) {
                        this.setState({ open: true})
                    }
                }
            } else {
                this.setState({ open: false, noted: false })
            }
        }) , 2000)
    }

    handleClose = () => {
        this.setState({ open: false, noted: true });
    };

    render() {
        return(
            <div>
                <Thermometer
                    theme="light"
                    value={this.state.tempReading}
                    max="100"
                    steps="3"
                    format="°C"
                    size="large"
                    height="250"
                />
                <div>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Temperature critical"}</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            The temperature of the region has reached beyond critical limit.
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Ok, Noted
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }
}

export default Temperature;