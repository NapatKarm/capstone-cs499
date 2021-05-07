import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import './LandingPage.css';
import RegisterTable from './RegisterTable';
import LoginTable from './LoginTable';
import longLogo from '../../Imgs/long-logo.png';

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightState: "none"
        }
    }
    // componentDidMount=()=>{
    //     this.props.socket.on("updateMap",({ allData }) => {
    //         console.log("from UPDATE MAP",allData)
    //     })
    // }
    componentDidUpdate=()=>{
        if (this.props.loggedIn){
            this.props.history.push("/home");
        }
    }
    toTrack = () => {
        this.props.socket.emit("getAllData")
        this.props.history.push("/tracking")
    }
    render() {
        return(
            <div className="bodyT">
                <div className="bgImage">
                    <div className="content">
                        <div className="leftSide">
                            <img className="landingLogo" src={longLogo} alt="C-Vivid"/>
                            <div className="titleHeader">
                                Welcome to C-Vivid
                            </div>
                            <div className="aboutP">
                                <p>C-Vivid is a capacity management app aiming to broadcast exact population within stores. Although created for usage during the 2020-2021 Coronavirus pandemic, this app makes it easier to monitor population and prepare routes before heading out.</p>
                            </div>

                            {/* vvv Link page vvv*/}
                            {/* ()=>  -- stop stuff from auto running*/}
                            <Button onClick={()=>this.toTrack()}style={{color: 'white', backgroundColor: '#e8333a', maxWidth: '325px', maxHeight: '50px', minWidth: '325px', minHeight: '50px'}}>TRACK BUSINESSES</Button>
                            <p><br/>Businesses/Workers:</p>
                            <div className="actionButton">
                                <Button className="registerButton" onClick={()=>this.setState({rightState: "register"})} style={{color: 'black', backgroundColor: '#f7f6f6', maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px'}}>REGISTER</Button>
                                <Button className="loginButton" onClick={()=>this.setState({rightState: "login"})}  style={{color: 'white', backgroundColor: '#b71c1c', maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px'}}>SIGN IN</Button>
                            </div>
                        </div>
                        <div className="rightSide">
                            {this.state.rightState==="none" ? ("") : (<div>{this.state.rightState==="register" ? (<RegisterTable signUpError={this.props.signUpError} userSignup={this.props.userSignup} signupResult={this.props.signupResult} loginPass={()=>this.setState({rightState: "login"})}/>) : (<LoginTable logInError={this.props.logInError} userLogin={this.props.userLogin}/>)}</div>)}
                        </div>
                    </div>
                    <footer className="footerLanding">
                        <p className="footerText">Hunter College Capstone Project by <a id="gitLink" href="https://github.com/IZenithI">Brian Guo</a>, <a id="gitLink" href="https://github.com/Jhe0031">Jia Qi He</a>, <a id="gitLink" href="https://www.linkedin.com/in/napatkarm/">Napat Karmniyanont</a>, and <a id="gitLink" href="https://github.com/winson65">Winson Yu</a></p>
                    </footer>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage)