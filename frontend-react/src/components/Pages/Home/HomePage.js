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

import ManagedBusinessTable from './ManagedBusinessTable'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            businessList: [],
            registeringBusiness: false,
            bName: "",
            bAddress: "",
            bPass: ""
        }
    }
    componentDidMount = async () => {
        this.setState({
            userData: this.props.userData
        }, () => {
            console.log("USER INFOIOIOOJP",this.state.userData)
            if (this.state.userData) {
                this.props.bGet(this.state.userData.email,this.state.userData.token) 
                if(this.props.businessData) {
                    this.setState({businessList:this.props.businessData.businesses})
                    console.log("BUSINESS DATA",this.props.businessData)
                }
            }
        })
    }
    cancelBReg = () => {
        this.setState({
            registeringBusiness: false
        })
    }
    startBReg = () => {
        this.setState({
            registeringBusiness: true
        })
    }
    changeBName = (event) => {
        this.setState({ bName: event.target.value })
    }
    changeBAddress = (event) => {
        this.setState({ bAddress: event.target.value })
    }
    changeBPass = (event) => {
        this.setState({ bPass: event.target.value })
    }
    regBusiness = () => {
        console.log(this.state,"Look at reg info!")
        this.props.bRegister(this.state.bName, this.state.bAddress, this.state.userData.email, this.state.bPass)
    }
        render() {
        return (
            <div>
                <div>Top Nav</div>
                <div>
                    <div>
                        <Button onClick={this.startBReg}>Register business</Button><Button>Join Business</Button>
                    </div>
                    <div className="BusinessTable">
                        <ManagedBusinessTable businessList={this.state.businessList} />
                    </div>
                    <div className="BusinessRegisterComponent">
                        <Dialog open={this.state.registeringBusiness} onClose={this.cancelBReg} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Business Registration</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Fill this out and bam you business hummie
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
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="BAddress"
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
                </div>
            </div>
        )
    }
}

export default withRouter(HomePage)