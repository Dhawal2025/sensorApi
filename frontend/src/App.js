import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Temperature from './SensorGaugeMeters/Temperature';
import SplitPane from 'react-split-pane';
import './css/SplitWindowBorder.css';
import Pressure from './SensorGaugeMeters/Pressure';
import Vibrations from './SensorGaugeMeters/Vibrations';
import Humidity from './SensorGaugeMeters/Humidity';

class App extends Component {
  render() {
    const styles = {
      center: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems : "center"
      }
    };

    return (
      <SplitPane split="vertical" defaultSize="50%" paneStyle={{background: "#282a36"}}>
        <div>
          <SplitPane split="horizontal" defaultSize="50%">
          <div style={styles.center}>
            <Humidity />
          </div>
          <div style={styles.center}>
            <Pressure />
            <br />
            <div style={{paddingTop: "5%", color: 'white'}}>
              Pressure Sensor
            </div>
          </div>
          </SplitPane>
        </div>
        <div>
          <SplitPane split="horizontal" defaultSize="50%">
          <div style={styles.center}>
            <Temperature />
            <br />
            <div style={{paddingTop: "5%"}}>
              Temperature Sensor
            </div>
          </div>
          <div style={styles.center}>
            <Vibrations />
          </div>
          </SplitPane>
        </div>
      </SplitPane>
    );
  }
}

export default App;
