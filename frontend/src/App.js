import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Temperature from './SensorGaugeMeters/Temperature';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Temperature />
      </div>
    );
  }
}

export default App;
