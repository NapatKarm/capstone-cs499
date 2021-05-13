import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { userLoginThunk, userLogoutThunk, userSignupThunk } from "../../store/utilities/userinfo";
import { bRegisterThunk, bGetThunk, bJoinThunk, bUserLogoutThunk } from "../../store/utilities/businessinfo"
import { bViewThunk, bClearThunk } from "../../store/utilities/businessdetails"
import { cUpdateThunk, cWipeThunk } from "../../store/utilities/counterinfo"
import socket from '../socket'; 

//Page Imports
import TestLanding from '../Pages/TestLanding/TestLandingPage';
import LandingPage from '../Pages/Landing/LandingPage';
import HomePage from '../Pages/Home/HomePage';
import CounterPage from  '../Pages/Counter/CounterPage';
import BusinessDetailsPage from '../Pages/BusinessDetails/BusinessDetailsPage'
import AccessDenied from '../Pages/SharedComponent/AccessDenied';
import TrackingPage from '../Pages/ActiveTracking/TrackingPage';


class RoutesView extends Component {
    render() {
        const {loggedIn} = this.props
        const {singleView} = this.props
        const AccessDeniedComponent = () => (<AccessDenied/>)
        const TrackingPageComponent =() => (<TrackingPage socket={socket} bDetails={this.props.bDetails}/>)
        const TestLandingComponent = () => (<TestLanding userSignup={this.props.userSignup} userLogin={this.props.userLogin} userLogout={this.props.userLogout} userData={this.props.userData} signupResult={this.props.signupResult}/>)
        const LandingPageComponent = () => (<LandingPage socket={socket} logInError={this.props.logInError} signUpError={this.props.signUpError} userSignup={this.props.userSignup} userLogin={this.props.userLogin} userData={this.props.userData} signupResult={this.props.signupResult} loggedIn={this.props.loggedIn}/>)
        const CounterPageComponent = () => (<CounterPage cInfo={this.props.cInfo} socket={socket} userData={this.props.userData} userLogout={this.props.userLogout} bDetails={this.props.bDetails} bUserLogout={this.props.bUserLogout}/>)
        const HomePageComponent = () => (<HomePage cInfo={this.props.cInfo} cUpdate={this.props.cUpdate} socket={socket} bDetails={this.props.bDetails} bView={this.props.bView} userLogout={this.props.userLogout} businessData={this.props.businessData} userData={this.props.userData} bGet={this.props.bGet} bJoin={this.props.bJoin} bRegister={this.props.bRegister} bJoinError={this.props.bJoinError} bRegError={this.props.bRegError} bUserLogout={this.props.bUserLogout}/>)
        const BusinessDetailsComponent = () => (<BusinessDetailsPage socket={socket} cInfo={this.props.cInfo} cUpdate={this.props.cUpdate} userLogout={this.props.userLogout} bView={this.props.bView} bUserLogout={this.props.bUserLogout} bDetails={this.props.bDetails} bClear={this.props.bClear} userData={this.props.userData}/>)
        return (
            <Router>
                <Switch>
                    <Route exact path="/tracking" render={TrackingPageComponent} />
                    <Route exact path="/denied" render={AccessDeniedComponent} />
                    <Route exact path="/test" render={TestLandingComponent} />
                    <Route exact path="/" render={LandingPageComponent} />
                    <Route exact path="/counter" render={CounterPageComponent} />
                    <Route exact path="/pathgo" render={() => (window.location = "https://PathGo.app")} />
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
                    <Route render={AccessDeniedComponent} />
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
        bRegError: state.businessinfo.BRegError,
        bJoinError: state.businessinfo.BJoinError,
        bDetails: state.businessdetails.bDetails,
        cInfo: state.counterinfo.cInfo
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
        bRegister: (bname, baddress, email, businesspass,blat,blong) => dispatch(bRegisterThunk(bname, baddress, email, businesspass,blat,blong)),
        bView: (business) => dispatch(bViewThunk(business)),
        bClear: ()=> dispatch(bClearThunk()),
        cUpdate: (cInfo)=> dispatch(cUpdateThunk(cInfo)),
        cWipe: ()=> dispatch(cWipeThunk())
    }
}

export default connect(mapState, mapDispatch)(RoutesView);