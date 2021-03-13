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

    componentDidUpdate=()=>{
        if (this.props.loggedIn){
            this.props.history.push("/home");
        }
    }

    render() {
        return(
            <div className="body">
                <div className="bgImage">
                    <div className="content">
                        <div className="leftSide">
                            <img className="landingLogo" src={longLogo} alt="C-Vivid"/>
                            <div className="titleHeader">
                                Welcome to C-Vivid
                            </div>
                            <div className="aboutP">
                                <p>Some two line preech about nothing at all in general - lorum ipsum dolar sit amet, consectetur adipiscing elit. Proin phareta lorem aba aba aba</p>
                            </div>

                            {/* vvv Link page vvv*/}
                            {/* ()=>  -- stop stuff from auto running*/}
                            <Button style={{color: 'white', backgroundColor: '#e8333a', maxWidth: '325px', maxHeight: '50px', minWidth: '325px', minHeight: '50px'}}>GO TO THE MAP</Button>
                            <p><br/>Businesses/Workers:</p>
                            <div className="actionButton">
                                <Button onClick={()=>this.setState({rightState: "register"})} style={{color: 'black', backgroundColor: '#f7f6f6', maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px'}}>REGISTER</Button>
                                <Button onClick={()=>this.setState({rightState: "login"})}  style={{color: 'white', backgroundColor: '#b71c1c', maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px'}}>SIGN IN</Button>
                            </div>
                        </div>
                        <div className="rightSide">
                            {this.state.rightState==="none" ? ("") : (<div>{this.state.rightState==="register" ? (<RegisterTable signUpError={this.props.signUpError} userSignup={this.props.userSignup} signupResult={this.props.signupResult}/>) : (<LoginTable logInError={this.props.logInError} userLogin={this.props.userLogin}/>)}</div>)}
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