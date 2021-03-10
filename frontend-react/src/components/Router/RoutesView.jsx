import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { userLoginThunk, userLogoutThunk, userSignupThunk } from "../../store/utilities/userinfo";
import { bRegisterThunk, bGetThunk, bJoinThunk, bUserLogoutThunk } from "../../store/utilities/businessinfo"
import { bViewThunk, bClearThunk } from "../../store/utilities/businessdetails"

//Page Imports
import TestLanding from '../Pages/TestLanding/TestLandingPage';
import LandingPage from '../Pages/Landing/LandingPage';
import HomePage from '../Pages/Home/HomePage';
import CounterPage from  '../Pages/Counter/CounterPage';
import BusinessDetailsPage from '../Pages/BusinessDetails/BusinessDetailsPage'


class RoutesView extends Component {
    render() {
        const {loggedIn} = this.props
        const {singleView} = this.props
        const TestLandingComponent = () => (<TestLanding userSignup={this.props.userSignup} userLogin={this.props.userLogin} userLogout={this.props.userLogout} userData={this.props.userData} signupResult={this.props.signupResult}/>)
        const LandingPageComponent = () => (<LandingPage logInError={this.props.logInError} signUpError={this.props.signUpError} userSignup={this.props.userSignup} userLogin={this.props.userLogin} userData={this.props.userData} signupResult={this.props.signupResult} loggedIn={this.props.loggedIn}/>)
        const CounterPageComponent = () => (<CounterPage userData={this.props.userData}/>)
        const HomePageComponent = () => (<HomePage bDetails={this.props.bDetails} bView={this.props.bView} userLogout={this.props.userLogout} bUserLogOut={this.props.bUserLogout}businessData={this.props.businessData} userData={this.props.userData} bGet={this.props.bGet} bJoin={this.props.bJoin} bRegister={this.props.bRegister} bJoinError={this.props.bJoinError} bRegError={this.props.bRegError} bUserLogout={this.props.bUserLogout}/>)
        const BusinessDetailsComponent = () => (<BusinessDetailsPage bDetails={this.props.bDetails} bClear={this.props.bClear} userData={this.props.userData}/>)
        return (
            <Router>
                <Switch>
                    <Route exact path="/test" render={TestLandingComponent} />
                    <Route exact path="/" render={LandingPageComponent} />
                    <Route exact path="/counter" render={CounterPageComponent} />
                    {   loggedIn && (
                            <Switch>
                                <Route exact path="/home" render={HomePageComponent} />
                                { singleView && (
                                    <Switch>
                                    <Route exact path="/details" render={BusinessDetailsComponent}/>
                                    </Switch>
                                )}
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
        singleView: !!state.businessdetails.bDetails,
        signUpError: state.userinfo.signUpError,
        logInError: state.userinfo.logInError,
        businessData: state.businessinfo.Businesses,
        bRegError: state.businessinfo.bRegError,
        bJoinError: state.businessinfo.BJoinError,
        bDetails: state.businessdetails.bDetails
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
        bRegister: (bname, baddress, email, businesspass) => dispatch(bRegisterThunk(bname, baddress, email, businesspass)),
        bView: (business) => dispatch(bViewThunk(business)),
        bClear: ()=> dispatch(bClearThunk())
    }
}

export default connect(mapState, mapDispatch)(RoutesView);