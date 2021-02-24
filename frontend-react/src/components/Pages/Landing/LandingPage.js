import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

    render() {
        return(
            <div>
                <h2>This is our Title</h2>
                <p>Some two line preech about nothing at all in general</p>

                {/* vvv Link page vvv*/}
                {/* ()=>  -- stop stuff from auto running*/}
                <Button onClick={this.signUp}>Sign Up</Button> 
            </div>
        )
    }
}

export default withRouter(LandingPage)