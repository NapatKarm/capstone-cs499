import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Geocoder from 'react-mapbox-gl-geocoder'
import ReactMapGL from 'react-map-gl';

const mapAccess = {
    mapboxApiAccessToken: "pk.eyJ1IjoibmFwYXRrYXJtIiwiYSI6ImNrbWRzejdmZTJwOGIyb29qem5kaGdnYWQifQ.0qB-jB0GW4iI1V3ban2fXQ"
}

const queryParams = {
    country: 'us'
}
 

class TestLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            viewport: {
                latitude: 40.767824,
                longitude: -73.964216,
                zoom: 15
            }
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
    onSelected = (viewport, item) => {
        this.setState({viewport})
    }
    render() {
        const { viewport } = this.state;
        return (
            <div>
                <p>Welcome to the most gucci landing page</p>
                <Geocoder
                    {...mapAccess} hideOnSelect={true}
                    onSelected={this.onSelected}
                    value=""              
                    queryParams={queryParams}
                    viewport={viewport}  
                />
                <ReactMapGL
                {...mapAccess}
                width="500px"
                height="500px"
                mapStyle="mapbox://styles/mapbox/streets-v11"
                {...viewport}
                onViewportChange={(viewport) => this.setState({viewport})}
                ></ReactMapGL>
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