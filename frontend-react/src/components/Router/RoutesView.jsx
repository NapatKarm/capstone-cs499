import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { userLoginThunk, userLogoutThunk, userSignupThunk } from "../../store/utilities/userinfo";
import { bRegisterThunk, bGetThunk, bJoinThunk, bUserLogoutThunk } from "../../store/utilities/businessinfo"

//Page Imports
import TestLanding from '../Pages/TestLanding/TestLandingPage';
import LandingPage from '../Pages/Landing/LandingPage';
import HomePage from '../Pages/Home/HomePage';


class RoutesView extends Component {
    render() {
        const {loggedIn} = this.props
        const TestLandingComponent = () => (<TestLanding userSignup={this.props.userSignup} userLogin={this.props.userLogin} userLogout={this.props.userLogout} userData={this.props.userData} signupResult={this.props.signupResult}/>)
        const LandingPageComponent = () => (<LandingPage logInError={this.props.logInError} signUpError={this.props.signUpError} userSignup={this.props.userSignup} userLogin={this.props.userLogin} userData={this.props.userData} signupResult={this.props.signupResult} loggedIn={this.props.loggedIn}/>)
        const HomePageComponent = () => (<HomePage businessData={this.props.businessData} userData={this.props.userData} bGet={this.props.bGet} bJoin={this.props.bJoin} bRegister={this.props.bRegister} bUserLogout={this.props.bUserLogout}/>)
        return (
            <Router>
                <Switch>
                    <Route exact path="/test" render={TestLandingComponent} />
                    <Route exact path="/" render={LandingPageComponent} />
                    {   loggedIn && (
                            <Switch>
                                <Route exact path="/home" render={HomePageComponent} />
                            </Switch>
                        )
                    }   
                    <Route render={LandingPageComponent} />
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
        loggedIn: !!state.userinfo.UserData,
        signUpError: state.userinfo.signUpError,
        logInError: state.userinfo.logInError,
        businessData: state.businessinfo.Businesses
    }
}

const mapDispatch = (dispatch) => {
    return {
        userSignup: (firstName, lastName, email, password) => dispatch(userSignupThunk(firstName, lastName, email, password)),
        userLogin: (email, password) => dispatch(userLoginThunk(email,password)),
        userLogout: () => dispatch(userLogoutThunk()),
        bUserLogout: () => dispatch(bUserLogoutThunk()),
        bGet: (email,token) => dispatch(bGetThunk(email,token)),
        bJoin: (email,businessid,businesspass) => dispatch(bJoinThunk(email,businessid,businesspass)),
        bRegister: (bname, baddress, email, businesspass) => dispatch(bRegisterThunk(bname, baddress, email, businesspass))
    }
}

export default connect(mapState, mapDispatch)(RoutesView);