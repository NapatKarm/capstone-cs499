import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import './LandingPage.css';
import longLogo from '../../Imgs/long-logo.png';
import pinBG from '../../Imgs/pin-bg.jpg';

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    signUp = () => {
        this.props.userSignup(this.state.username, this.state.password)
    }
    logIn = () => {
        this.props.userLogin(this.state.username, this.state.password)
    }

    render() {
        return(
            <div className="body">
                <div className="bgImage">
                    <div className="leftSide">
                    <img className="landingLogo" src={longLogo} alt="C-Vivid"/>
                    <h2>Welcome to C-Vivid</h2>
                    <p>Some two line preech about nothing at all in general - lorum ipsum dolar sit amet, consectetur adipiscing elit. Proin phareta lorem aba aba aba</p>

                    {/* vvv Link page vvv*/}
                    {/* ()=>  -- stop stuff from auto running*/}
                    <div className="mapButton">
                        <Link to ="/">GO TO THE MAP</Link>
                    </div>
                    <div className="actionButton">
                        <Button onClick={this.signUp}>REGISTER</Button>
                        <Button onClick={this.logIn}>LOGIN</Button>
                    </div>
                    <Link to ="/home">Business Page</Link>
                </div>
                <div className="right">
                    <p>sendhelp</p>
                    <p>Whyyyy</p>
                </div>
                <footer>
                    <p>Behind the project: Our names yayyyy</p>
                </footer>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage)