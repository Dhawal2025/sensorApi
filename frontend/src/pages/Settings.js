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

class Settings extends Component {
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
        <div>
        </div>
    );
  }
}

export default Settings;
