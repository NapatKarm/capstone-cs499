import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import './AccessDenied.css';
import longLogo from '../../Imgs/long-logo.png';

class AccessDenied extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    componentDidUpdate=()=>{
        if (this.props.loggedIn){
            this.props.history.push("/home");
        }
    }

    componentDidMount=()=>{
        this.setState({show:false})
    }

    toLanding=()=>{
        this.props.history.push("/");
    }
    render() {
        return(
            <div className="bodyT">
                <div className="bgImage">
                    <div className="content deniedContent">
                        <div className="gifLeft">
                            <img src="https://media.giphy.com/media/vfxlMY6YCQESKoB4hV/giphy.gif"/>
                        </div>
                        <div className="textRight">
                            <div className="cookieDiv">{this.state.show ? (<img className="cookie" src="https://media.discordapp.net/attachments/807321317426462760/822606734916452404/COOKIEMAN.png"/>) : ("")}</div>
                            <h1 className="deniedHeader">ACCESS DENIED</h1>
                            <p><span onClick={()=>this.setState({show: !this.state.show})}>Who</span> are you? How have you come to our sacred quarters...</p>
                            <p>TURN AROUND AT ONCE</p>
                            <Button onClick={()=>this.toLanding()} style={{color: 'white', backgroundColor: '#ab191e', maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px', marginTop: '10px'}}>Return</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(AccessDenied)