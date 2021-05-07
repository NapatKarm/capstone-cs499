import React, { Component } from 'react';
import ReactMapGL, {Marker, Popup } from 'react-map-gl';
import BusinessDetailsPage from '../BusinessDetails/BusinessDetailsPage';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CVIVIDNav from '../SharedComponent/Navbar'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
// import './CounterPage.css';
// import './TrackingPage.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#8a0602',
        },
        secondary: {
            main: '#84a486',
        }
    },
})

const useStyles = makeStyles((theme) => ({
    palette: {
        primary: {
            main: '#8a0602',
        }
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
}));

function CircularProgressWithLabel(props) {
    let numberColor = "black"
    let cap = (props.value/props.maxCap)*100
    if(cap<0) {
        cap = 0;
    }
    if(cap>=100) {
        cap = 100;
        numberColor = "red";
    }
    return (
      <Box position="relative" display="inline-flex">
        <ThemeProvider theme={theme}> 
        <CircularProgress variant="determinate" color="primary" size={100} thickness={7} value={cap} /></ThemeProvider>
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* <Typography className="circleFont-popup" variant="caption" component="div" style={{color: `${numberColor}`}}>{props.value}</Typography> */}
        </Box>
      </Box>
    );
}

function CircularProgressBackground(props) {
    return (
      <Box position="relative" display="inline-flex">
        <ThemeProvider theme={theme}> 
        <CircularProgress variant="determinate" color="secondary" size={100} thickness={7} value={100} /></ThemeProvider>
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
            {/* Where text is */}
          <Typography className="circleFont-popup" variant="caption" component="div" color="textSecondary">{props.value}</Typography>
        </Box>
      </Box>
    );
}

class PopupComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            capacity: 0,
            maxCap: 0
        }
    }

  render () {
    return (
        <div className="display-popup">
            <div className="pop-up-header"><h1>{this.props.businessDetails.businessname}</h1></div>
            <div className="displayMax-popup">
                <div><b>Current Occupants: {this.props.businessDetails.counter}</b><br/>
                    <b>Maximum Capacity: {this.props.businessDetails.limit}</b></div>
            </div>
            <div className="circleProgress-popup">
                <div className="circle-popup">
                    <CircularProgressWithLabel value={this.props.businessDetails.counter} maxCap={this.props.businessDetails.limit}></CircularProgressWithLabel>
                </div>
                <div className="circleUnder-popup">
                    <CircularProgressBackground></CircularProgressBackground>
                </div>
                {/* <div className="whiteCircle-popup"></div> */}
            </div>
            <div className="bottomDiv-popup"><p>Address: {this.props.businessDetails.businessaddr}</p></div>
        </div>
    )
  };
}

export default PopupComponent