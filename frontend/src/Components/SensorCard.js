import React, { Component } from 'react';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CheckIcon from '@material-ui/icons/Check';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

class SensorCard extends Component {

    constructor(props) {
        super();
        this.state = {
            confirming: false
        };
    }

    render() {
        return (
            <Flippy
                flipOnHover={true} // default false
                // flipOnClick={true} // default false
                flipDirection="vertical" // horizontal or vertical
                // ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
                // if you pass isFlipped prop component will be controlled component.
                // and other props, which will go to div
                style={{ width: '20%', height: '15vw' }}
                raised={true} /// these are optional style, it is not necessary
            >
                <FrontSide
                style={{
                    backgroundColor: '#41669d',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    fontSize: "2em",
                    color: "white",
                    marginBottom: "2%",
                    borderRadius: "5%"
                }}
                >
                {this.props.sensorName}
                </FrontSide>
                <BackSide
                style={{ backgroundColor: '#00838f', display: "flex", flexDirection: "column", alignItems: "space-around", justifyContent: "space-around"}}>
                <TextField
                    id="outlined-full-width"
                    label="IP Address"
                    placeholder="IP Address"
                    type="text"
                    name="IP Address"
                    autoComplete="email"
                    margin="normal"
                    variant="outlined"
                    style={{width: "100%"}}
                />
                {!this.state.confirming
                ? 
                <Button onClick={() => this.setState({confirming: true})}> 
                Configure &nbsp;
                <CloudUploadIcon/>
            </Button> 
                :
                <div style={{display: "flex", flexDirection: "row", alignItems: "space-around", justifyContent: "space-around"}}>
                    <Button>Confirm &nbsp;
                        <CheckIcon />
                    </Button>
                    <Button onClick={() => this.setState({confirming: false})} >
                    No &nbsp; <DeleteForeverIcon />
                    </Button>
                </div>
                }
                </BackSide>
            </Flippy>
        );
    }
}

export default SensorCard;