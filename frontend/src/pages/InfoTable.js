import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { sensorType } from '../../../projectConstants';

const client = new W3CWebSocket(`ws://localhost:5000/echo?connectionType=client`);

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//     marginTop: theme.spacing(3),
//     overflowX: 'auto',
//   },
//   table: {
//     minWidth: 650,
//   },
// }));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
var list;

class InfoTable extends Component {
//   const classes = useStyles();
constructor(props) {
    super();
    this.tempList = [];
    this.pressureList = []
    this.state = {
        color: "white",
        sensorCritical: []
    };
}
componentDidMount() {
    client.onopen = () => {
        console.log("INFO TABLE CLIENT CONNECTED");
    }
    client.onmessage = (message) => {
        const json = JSON.parse(message.data);
        if (json.data.temperatureCritical) {
          if (this.tempList.length < 2) {
            if (this.tempList.length == 0) this.tempList.push(json);
            else if (this.tempList[0].sensorIndex != json.sensorIndex) this.tempList.push(json);
          }
        }

        console.log(this.tempList, "TEMP LIST");
        if (this.tempList.length >= 1) {
          if (json.sensorIndex == 1 && !json.data.temperatureCritical) this.tempList.splice(0, 1)
        }
        if (this.tempList.length == 2) {
          if (json.sensorIndex == 2 && !json.data.temperatureCritical) this.tempList.splice(1, 1);

        }
        this.setState({sensorCritical: this.tempList});
        console.log(this.state.sensorCritical, "STATE");

    }
    // this.setState({sensorCritical: {sensorType: 1, sensorIndex: 2}})
    setInterval(() => {
        if (this.state.color == '#af0404') this.setState({color: "white"})
        else this.setState({color: "#af0404"})
    }, 2500)
}

render () {
    try {
        console.log (this.state.sensorCritical[0].sensorType, "RENDER");
    }
    catch(err) {
        console.log ("exception");
    }
    return (
        <Paper >
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>Sensor Type</TableCell>
                <TableCell align="right">Sensor Index</TableCell>
                <TableCell align="right">Current Value</TableCell>
                <TableCell align="right">Threshold</TableCell>
                {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.sensorCritical.map(row => (
                <TableRow key={row.sensorIndex} style = {{background: this.state.color}}>
                  <TableCell component="th" scope="row">
                    {row.sensorType}
                  </TableCell>
                  <TableCell align="right">{row.sensorIndex}</TableCell>
                  <TableCell align="right">{row.data.currentTemperature}</TableCell>
                  <TableCell align="right">{row.data.temperatureThreshold}</TableCell>
                  {/* <TableCell align="right">{row.protein}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
}
}

export default InfoTable;