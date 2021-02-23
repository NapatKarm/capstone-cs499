import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { userLoginThunk, userLogoutThunk, userSignupThunk } from "../../store/utilities/userinfo";

//Page Imports
import TestLanding from '../Pages/TestLanding/TestLandingPage';


class RoutesView extends Component {
    render() {
        const TestLandingComponent = () => (<TestLanding userSignup={this.props.userSignup} userLogin={this.props.userLogin} userLogout={this.props.userLogout} userData={this.props.userData} signupResult={this.props.signupResult}/>)
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={TestLandingComponent} />
                </Switch>
            </Router>
        )
    }
}

const mapState = (state) => {
    return {
        userData: state.userinfo.UserData,
        signupResult: state.userinfo.SignupResult,
        userinfoError: state.ErrorInfo
    }
}

const mapDispatch = (dispatch) => {
    return {
        userSignup: (username, password) => dispatch(userSignupThunk(username, password)),
        userLogin: (username, password) => dispatch(userLoginThunk(username,password)),
        userLogout: () => dispatch(userLogoutThunk())
    }
}

export default connect(mapState, mapDispatch)(RoutesView);