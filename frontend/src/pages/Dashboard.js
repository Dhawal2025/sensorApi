import React, { Component } from 'react';
import logo from '../logo.svg';
import Temperature from '../SensorGaugeMeters/Temperature';
import SplitPane from 'react-split-pane';
import '../css/SplitWindowBorder.css';
import Pressure from '../SensorGaugeMeters/Pressure';
import Vibrations from '../SensorGaugeMeters/Vibrations';
import Humidity from '../SensorGaugeMeters/Humidity';
import AirTemperature from '../SensorGaugeMeters/AirTemperature';
import AirQuality from '../SensorGaugeMeters/AirQuality';
import Sound from '../SensorGaugeMeters/Sound'
import constants from "../../../projectConstants.js"
import Nav from '../Components/Nav';

class Dashboard extends Component {
  render() {
    const styles = {
      center: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems : "center",
      },
      centerRow: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems : "center",
      },
      label: {
        paddingTop: "5%",
        color: 'white'
      }
    };

    // fontSizer = () => {
    //   var width = window.innerWidth;
    //   if (width > 1000) return 50;
    //   else if (width > 500) return 30;
    //   else return 15;
    // }

    return (
      <SplitPane split="horizontal" defaultSize="7%" paneStyle={{background: "#348498"}}>
      <Nav />
      <SplitPane split="horizontal" defaultSize="50%" paneStyle={{background: "#282a36"}}>
        <div>
          <SplitPane split="vertical" defaultSize="70%" paneStyle={{background: "#282a36"}}>
          <div style={styles.center}>
          <div style={styles.centerRow}>
            <h1 style={{color: 'white'}}>Humidity(%) </h1>
            <h1 style={{color: 'white'}}>Air Quality(PPM) </h1>
            <h1 style={{color: 'white'}}>Air Temp(Celsius) </h1>
          </div>
          <div style={styles.centerRow}>
            <Humidity sensorType={constants.sensorType.AIR}  />
            <AirQuality sensorType={constants.sensorType.AIR}  />
            <AirTemperature style={{marginBottom: "20%"}} sensorType={constants.sensorType.AIR} />
          </div>
          </div>
          <div style={styles.center}>
            <Temperature sensorType={constants.sensorType.TEMPERATURE}  />
          </div>
          </SplitPane>
        </div>
        <div>
          <SplitPane split="vertical" defaultSize="65%" paneStyle={{background: "#282a36"}}>
          <SplitPane split="vertical" defaultSize="50%">
          <div style={styles.center}>
          
            <Pressure sensorType={constants.sensorType.PRESSURE} />
          </div>
          <div style={styles.center}>
            <Sound sensorType={constants.sensorType.SOUND} />
          </div>
          </SplitPane>
          
          <div style={styles.center}>
            <Vibrations sensorType={constants.sensorType.VIBRATION}  />
          </div>
          </SplitPane>
        </div>
      </SplitPane>
      </SplitPane>
    );
  }
}

export default Dashboard;
