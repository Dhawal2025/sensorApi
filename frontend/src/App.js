import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Temperature from './SensorGaugeMeters/Temperature';
import SplitPane from 'react-split-pane';
import './css/SplitWindowBorder.css';
import Pressure from './SensorGaugeMeters/Pressure';
import Vibrations from './SensorGaugeMeters/Vibrations';
import Humidity from './SensorGaugeMeters/Humidity';
import AirTemperature from './SensorGaugeMeters/AirTemperature';
import AirQuality from './SensorGaugeMeters/AirQuality';
import Sound from './SensorGaugeMeters/Sound';

class App extends Component {
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

    return (
      <SplitPane split="horizontal" defaultSize="50%" paneStyle={{background: "#282a36"}}>
        <div>
          <SplitPane split="vertical" defaultSize="50%" paneStyle={{background: "#282a36"}}>
          <div style={styles.center}>
          <div style={styles.centerRow}>
            <h1 style={{color: 'white'}}>Humidity </h1>
            <h1 style={{color: 'white'}}>Air Quality </h1>
            <h1 style={{color: 'white'}}>Air Temp </h1>
            
          </div>
          <div style={styles.centerRow}>
            <Humidity />
            <AirQuality />
            <AirTemperature style={{marginBottom: "20%"}} />
          </div>
          </div>
          <div style={styles.center}>
            <Temperature />
            <br />
            <div style={styles.label}>
              Temperature Sensor
            </div>
          </div>
          </SplitPane>
        </div>
        <div>
          <SplitPane split="vertical" defaultSize="60%" paneStyle={{background: "#282a36"}}>
          <SplitPane split="vertical" defaultSize="50%">
          <div style={styles.center}>
            <Pressure />
            <br />
            <div style={styles.label}>
              Pressure Sensor
            </div>
          </div>
          <div style={styles.center}>
            <Sound />
            <br />
            <div style={styles.label}>
              Sound Sensor
            </div>
          </div>
          </SplitPane>
          
          <div style={styles.center}>
            <Vibrations />
            <br />
            <div style={styles.label}>
              Vibrations Sensor
            </div>
          </div>
          </SplitPane>
        </div>
      </SplitPane>
    );
  }
}

export default App;
