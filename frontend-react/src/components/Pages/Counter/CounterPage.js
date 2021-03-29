import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CVIVIDNav from '../SharedComponent/Navbar'

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
        if(this.props.cInfo){
            this.setState({
                capacity: this.props.cInfo.counter,
                maxCap: this.props.cInfo.limit
            })
        }
        this.props.socket.on("updateCounter",({ error, limit, counter, changerEmail, changerType }) => {
            console.log("Updated Counter",counter,limit,error,changerEmail,changerType)
            if(error!==undefined){
                console.log("error: ",error);
                this.setState({joinError:error});
            }
            if(counter!==undefined){
                if(this.props.bDetails!==undefined)
                {
                    this.setState({capacity: counter, maxCap:limit})
                }
            }
        })

    }
    addCapacity = ()=> {
        if (this.props.bDetails) {
            this.props.socket.emit('addCount', {businessId: this.props.bDetails.businessId})
        }
    }
    subCapacity = ()=> {
        if (this.state.capacity > 0) {
            if (this.props.bDetails) {
                this.props.socket.emit('removeCount', {businessId: this.props.bDetails.businessId})
            }
        }   
    }
    goBackHome = () => {
        this.props.socket.emit('leaveBusiness', {businessId: this.props.bDetails.businessId})
        this.props.history.push("/home")
    }
    render() {
        return(
            <div>
                <div className="navBar">
                    <CVIVIDNav socket={this.props.socket} userData={this.props.userData} logout={()=>console.log("WAIT")}/>
                </div>
                
                <div className="displayMax">
                    <div><b>Maximum Capacity: {this.state.maxCap}</b></div>
                    <Button onClick={this.goBackHome} style={{ marginTop:'15px',padding: '5px 20px 5px 20px', backgroundColor: '#ab191e', color: 'white'}}>Home</Button>
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