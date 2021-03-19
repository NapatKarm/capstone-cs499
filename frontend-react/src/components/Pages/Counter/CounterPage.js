import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import './CounterPage.css';

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
        <CircularProgress variant="determinate" color="primary" size={250} thickness={7} value={cap} /></ThemeProvider>
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
          <Typography className="circleFont" variant="caption" component="div" style={{color: `${numberColor}`}}>{props.value}</Typography>
        </Box>
      </Box>
    );
}

function CircularProgressBackground(props) {
    return (
      <Box position="relative" display="inline-flex">
        <ThemeProvider theme={theme}> 
        <CircularProgress variant="determinate" color="secondary" size={250} thickness={7} value={100} /></ThemeProvider>
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
          <Typography className="circleFont" variant="caption" component="div" color="textSecondary">{props.value}</Typography>
        </Box>
      </Box>
    );
}

class CounterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            capacity: 0,
            maxCap: 15,
            joinError: ""
        }
    }

    componentDidMount() {
        this.props.socket.on("updateCounter",({ error, counter }) => {
            if(error!==undefined){
                console.log("error: ",error);
                this.setState({joinError:error});
            }
            if(counter!==undefined){
                if(this.props.bDetails===undefined)
                {
                    this.setState({capacity: counter})
                }
            }
        })
    }
    addCapacity = ()=> {
        if (this.props.bDetails) {
            this.props.socket.emit('addCount', {businessid: this.props.bDetails.business_id})
        }
    }
    subCapacity = ()=> {
        if (this.state.capacity > 0) {
            if (this.props.bDetails) {
                this.props.socket.emit('removeCount', {businessid: this.props.bDetails.business_id})
            }
        }   
    }

    render() {
        return(
            <div>
                <div className="navBar">
                    <AppBar position="static" style={{backgroundColor: "#8a0602"}}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6">
                                C-Vivid
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </div>
                <div className="displayMax">
                    <div><b>Maximum Capacity: {this.state.maxCap}</b></div>
                </div>
                <div className="circle">
                    {/* Add something to keep the number from going negative */}
                    <CircularProgressWithLabel value={this.state.capacity} maxCap={this.state.maxCap}></CircularProgressWithLabel>
                    {/* Extra circle */}
                </div>
                <div className="circleUnder">
                    <CircularProgressBackground></CircularProgressBackground>
                </div>
                <div className="whiteCircle"></div>
                <div className="displayRemCap">
                    <div><b>Remaining Capacity: {this.state.maxCap-this.state.capacity}</b></div>
                </div>
                <div className="backgroundButtons">
                <div className="leftAdd" onClick={this.addCapacity}/>
                <div className="rightAdd" onClick={this.subCapacity}/>
                </div>
            </div>
        )
    }
}

export default withRouter(CounterPage)