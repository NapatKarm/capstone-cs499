import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class TestLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }
    changeUsername = (event) => {
        this.setState({ username: event.target.value })
    }
    changePassword = (event) => {
        this.setState({ password: event.target.value })
    }

    signUp = () => {
        this.props.userSignup(this.state.username, this.state.password)
    }
    logIn = () => {
        this.props.userLogin(this.state.username, this.state.password)
    }
    logOut = () => {
        this.props.userLogout()
    }
    render() {
        return (
            <div>
                <p>Welcome to the most gucci landing page</p>
                <div>
                    <TextField variant="filled" id="usernameinput" label="Username" color="primary" onChange={this.changeUsername} />
                </div>
                <div>
                    <TextField variant="filled" id="passwordinput" label="Password" color="primary" onChange={this.changePassword} />
                </div>
                <div>
                    <Button variant="contained" onClick={this.signUp} disableElevation>
                        Sign Up
                </Button>
                    <Button variant="contained" onClick={this.logIn} disableElevation>
                        Log In
                </Button>
                    <Button variant="contained" onClick={this.logOut} disableElevation>
                        Log Out
                </Button>
                </div>
                <div>
                    Sign Up Result:
                    <div>
                        {this.props.signupResult ?
                            <p>{this.props.signupResult}</p>
                            :
                            <p></p>
                        }
                    </div>
                </div>
                <div>
                    Log In Result:
                    <div>
                        {this.props.userData ?
                            <div>
                                <div>
                                    {this.props.userData.username}
                                </div>
                                <div>
                                ################################################

                                    {this.props.userData.grouplist ? (this.props.userData.grouplist.map((group) => (
                                        <div>
                                            <p class="tab">
                                            Group Name: {group.groupname}
                                            </p>
                                            <p class="tab">
                                            Group ID: {group.groupid}
                                            </p>
                                            <div>
                                            {group.groupmembers.map((member) => (
                                                <div>
                                                    Member Name: {member.username}
                                                </div>
                                            ))}
                                            </div>
                                            ################################################
                                        </div>
                                    ))) :
                                        (<div></div>)}
                                </div>
                            </div>
                            :
                            <div></div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(TestLanding)