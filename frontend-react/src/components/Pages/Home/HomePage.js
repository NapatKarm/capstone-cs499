import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class HomePage extends Component {
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

    render() {
        return(
            <div>
                <h2>BUSINESS SIDE STUFF</h2>
            </div>
        )
    }
}

export default withRouter(HomePage)