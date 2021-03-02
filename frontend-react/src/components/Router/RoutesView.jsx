import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { userLoginThunk, userLogoutThunk, userSignupThunk } from "../../store/utilities/userinfo";

//Page Imports
import TestLanding from '../Pages/TestLanding/TestLandingPage';
import LandingPage from '../Pages/Landing/LandingPage';
import HomePage from '../Pages/Home/HomePage';


class RoutesView extends Component {
    render() {
        const TestLandingComponent = () => (<TestLanding userSignup={this.props.userSignup} userLogin={this.props.userLogin} userLogout={this.props.userLogout} userData={this.props.userData} signupResult={this.props.signupResult}/>)
        const LandingPageComponent = () => (<LandingPage userSignup={this.props.userSignup} userLogin={this.props.userLogin} userData={this.props.userData} signupResult={this.props.signupResult} loggedIn={this.props.loggedIn}/>)
        const HomePageComponent = () => (<HomePage/>)
        return (
            <Router>
                <Switch>
                    <Route exact path="/test" render={TestLandingComponent} />
                    <Route exact path="/" render={LandingPageComponent} />
                    <Route exact path="/home" render={HomePageComponent} />
                </Switch>
            </Router>
        )
    }
}

const mapState = (state) => {
    return {
        userData: state.userinfo.UserData,
        signupResult: state.userinfo.SignupResult,
        userinfoError: state.ErrorInfo,
        loggedIn: !!state.userinfo.UserData
    }
}

const mapDispatch = (dispatch) => {
    return {
        userSignup: (firstName, lastName, email, password) => dispatch(userSignupThunk(firstName, lastName, email, password)),
        userLogin: (email, password) => dispatch(userLoginThunk(email,password)),
        userLogout: () => dispatch(userLogoutThunk())
    }
}

export default connect(mapState, mapDispatch)(RoutesView);