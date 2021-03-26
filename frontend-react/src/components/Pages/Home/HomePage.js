import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import BusinessIcon from '@material-ui/icons/Business';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import CVIVIDNav from '../SharedComponent/Navbar'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './HomePage.css';


import ManagedBusinessTable from './ManagedBusinessTable'

var geocoder = new MapboxGeocoder({
    accessToken: 'pk.eyJ1IjoibmFwYXRrYXJtIiwiYSI6ImNrbWRzejdmZTJwOGIyb29qem5kaGdnYWQifQ.0qB-jB0GW4iI1V3ban2fXQ',
    types: 'country,region,place,postcode,locality,neighborhood'
});

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            businessList: undefined,
            registeringBusiness: false,
            joiningBusiness: false,
            bName: "",
            bAddress: "",
            bPass: "",
            bID: "",
            joinError: "",
            registerError: undefined
        }
    }
    componentDidMount = async () => {
        this.setState({
            userData: this.props.userData,
        }, () => {
            if (this.state.userData) {
                this.businessUpdate()
        }})
    }
    logout = () => {
        this.props.bUserLogout()
        this.props.userLogout()
        this.props.history.push("/")
    }
    businessUpdate = async () => {
        this.setState({
            businessList: []
        })
        await this.props.bGet(this.state.userData.email,this.state.userData.token) 
        if(this.props.businessData) {
            this.setState({businessList:this.props.businessData, registeringBusiness:false},()=>(console.log("BUSINESS DATAX",this.props.businessData)))    
        }
    }
    cancelBReg = () => {
        this.setState({
            registeringBusiness: false
        })
    }
    startBReg = () => {
        this.setState({
            registeringBusiness: true,
            bName: "",
            bAddress: "",
            bPass: "",
            bID: "",
            registerError: undefined
        })
    }
    cancelBJoin = () => {
        this.setState({
            joiningBusiness: false,
            joinError: ""
        })
    }
    startBJoin = () => {
        this.setState({
            joiningBusiness: true,
            bName: "",
            bAddress: "",
            bPass: "",
            bID: ""
        })
    }
    changeBName = (event) => {
        this.setState({ bName: event.target.value })
    }
    changeBID = (event) => {
        this.setState({ bID: event.target.value })
    }
    changeBAddress = (event) => {
        this.setState({ bAddress: event.target.value })
    }
    changeBPass = (event) => {
        this.setState({ bPass: event.target.value })
    }
    regBusiness = async () => {
        
        await this.props.bRegister(this.state.bName, this.state.bAddress, this.state.userData.email, this.state.bPass)
        console.log(this.props.bRegError,"Look at reg info!#################")
        if(this.props.bRegError===undefined){
            await this.props.bGet(this.state.userData.email,this.state.userData.token) 
            if(this.props.businessData) {
                this.setState({businessList:this.props.businessData, registeringBusiness:false},()=>(console.log(this.props.businessData)))    
            }
        }
        else this.setState({registerError:this.props.bRegError})


    }
    joinBusiness = async () => {
        await this.props.bJoin(this.state.userData.email,this.state.bID,this.state.bPass)
        if(this.props.bJoinError){
            this.setState({joinError: this.props.bJoinError},()=>(console.log("This should have ran",this.state.joinError)))
        }
        else {
            await this.props.bGet(this.state.userData.email,this.state.userData.token) 
            if(this.props.businessData) {
                this.setState({businessList:this.props.businessData, joiningBusiness: false},()=>(console.log(this.props.businessData)))    
            }
        } 
    }
        render() {
        return (
            <div className="homePage">
                <div>
                    <CVIVIDNav socket={this.props.socket} userData={this.props.userData} logout={this.logout}/>
                </div>
                <div>
                    <div>
                        <div className="topButtonGroup">
                        <div className="topButtonBox" onClick={this.startBReg}>
                            <div>
                                <div className="topText">
                                    REGISTER
                                </div>
                                <div className="buttomText">
                                    Business
                                </div>
                            </div>
                            <div>
                                <BusinessIcon fontSize="large"/>
                            </div>
                        </div>
                        <div className="topButtonBox" onClick={this.startBJoin}>
                            <div>
                                <div className="topText">
                                    JOIN
                                </div>
                                <div className="buttomText">
                                    Business
                                </div>
                            </div>
                            <div>
                                <BusinessCenterIcon fontSize="large"/>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="BusinessTable">
                        <ManagedBusinessTable  cUpdate={this.props.cUpdate} cInfo={this.props.cInfo} userData={this.props.userData}socket={this.props.socket} logout={this.logout} businessUpdate={this.businessUpdate} history={this.props.history}bDetails={this.props.bDetails} businessList={this.state.businessList} bView={this.props.bView}/>
                    </div>
                    <div className="BusinessRegisterComponent">
                        <Dialog open={this.state.registeringBusiness} onClose={this.cancelBReg} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Business Registration</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Fill this out and bam you CREATE business hummie
                                 </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="BName"
                                    label="Business Name"
                                    type="string"
                                    onChange={this.changeBName}
                                    fullWidth
                                />
                                {/* {geocoder.addTo('#geocoder')} */}
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="BAddress"
                                    id="geocoder"
                                    label="Business Address"
                                    type="string"
                                    onChange={this.changeBAddress}
                                    fullWidth
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="BCode"
                                    label="Business Passcode"
                                    type="string"
                                    onChange={this.changeBPass}
                                    fullWidth
                                />
                                {this.state.registerError}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.cancelBReg} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.regBusiness} color="primary">
                                    Register
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className="BusinessJoinComponent">
                        <Dialog open={this.state.joiningBusiness} onClose={this.cancelBJoin} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Joining a Business</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Fill this out and bam you JOIN business hummie
                                 </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="BID"
                                    label="Business ID"
                                    type="string"
                                    onChange={this.changeBID}
                                    fullWidth
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="BCode"
                                    label="Business Passcode"
                                    type="string"
                                    onChange={this.changeBPass}
                                    fullWidth
                                />
                                {this.state.joinError}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.cancelBJoin} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.joinBusiness} color="primary">
                                    Join
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(HomePage)