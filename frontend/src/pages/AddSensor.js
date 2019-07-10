import React, {Component} from 'react';
import Nav from '../Components/Nav';
import SensorCard from '../Components/SensorCard';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';



class AddSensor extends Component {

    constructor(props) {
        super();
    }
    render() {

        const styles = {
            card: {
                height: "75%",
                width: "75vw",
                background: "#BDBDBD"
            },
            mainComponent: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cardContent: {
                display: "flex",
                justifyContent: "space-around"
            }
        };

        return (
            <div style={{top:'0', bottom:'0', left:'0', right:'0', position: 'absolute'}} >
            <Nav />

            <div style={styles.mainComponent}>
                
                <Card style = {styles.card}>
                    <CardContent>
                        <div style={styles.cardContent}>
                        <SensorCard sensorName="Sound Sensor" />
                        <SensorCard sensorName="Vibrations Sensor" />
                        <SensorCard sensorName="Pressure Sensor" />
                        </div>
                        <br />
                        <div style={styles.cardContent}>
                        <SensorCard sensorName="Furnance Sensor" />
                        <SensorCard sensorName="Air Sensor" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            </div>
        );
    }
}

export default AddSensor;