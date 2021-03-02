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
                            <h2>Welcome to C-Vivid</h2>
                            <p>Some two line preech about nothing at all in general - lorum ipsum dolar sit amet, consectetur adipiscing elit. Proin phareta lorem aba aba aba</p>

                            {/* vvv Link page vvv*/}
                            {/* ()=>  -- stop stuff from auto running*/}
                            <div className="mapButton">
                                <Button>GO TO THE MAP</Button>
                            </div>
                            <div className="actionButton">
                                <Button onClick={()=>this.setState({rightState: "register"})}>REGISTER</Button>
                                <Button onClick={()=>this.setState({rightState: "login"})}>LOGIN</Button>
                            </div>
                        </div>
                        <div className="rightSide">
                            {this.state.rightState==="none" ? ("") : (<div>{this.state.rightState==="register" ? (<RegisterTable userSignup={this.props.userSignup}/>) : (<LoginTable userLogin={this.props.userLogin}/>)}</div>)}
                        </div>
                    </div>
                    <footer>
                        <p>Our names</p>
                    </footer>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage)