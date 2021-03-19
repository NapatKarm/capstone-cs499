import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CVIVIDNav from '../SharedComponent/Navbar'

import './BusinessDetailsPage.css';

class BusinessDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessDetails: undefined,
            role: undefined,
            action: false,
            actionName: "",
            actionVictim: "",
            changingBPass: false,
            passError: ""
        }
    }
    componentDidMount() {
        this.setState({
            businessDetails: this.props.bDetails
        }, () => {
            console.log("Updated Business Details", this.state.businessDetails)
            let roleGrab = this.state.businessDetails.members.find(element => element.email == this.props.userData.email)
            if (roleGrab !== undefined) {
                this.setState({
                    role: roleGrab.role
                })
            }
            else alert("Something is wrong, you are not in this business but you can still see it.")

        })
    }
    logout = () => {
        this.props.bUserLogout()
        this.props.userLogout()
        this.props.history.push("/")
    }
    updateDetails = async () => {
        console.log("UPDATING")
        axios.post(`https://c-vivid-backend.herokuapp.com/getSingleBusinessData`, {
            business_id: this.state.businessDetails.business_id,
            email: this.props.userData.email,
            token: this.props.userData.token
        })
            .then(res => {
                this.setState({
                    businessDetails: res.data,
                    action: false
                })
                let roleGrab = this.state.businessDetails.members.find(element => element.email == this.props.userData.email)
                if (roleGrab !== undefined) {
                    this.setState({
                        role: roleGrab.role
                    })
                }
                else {
                    alert("You have been removed from the business")
                    this.props.history.push("/home");
                }
            })
            .catch(err => {
                console.log("Error from UPDATE", err)
                alert("You are no longer in this business")
                this.props.history.push("/home");

            })
    }
    cancelBPassChange = () => {
        this.setState({
            changingBPass: false,
            passError: ""
        })
    }
    changingBPass = () => {
        this.setState({
            changingBPass: true,
            bPass: "",
        })
    }
    changeBPass = (event) => {
        this.setState({ bPass: event.target.value })
    }
    BPassChange = async () => {
        await axios.put(`https://c-vivid-backend.herokuapp.com/passcodeChange`, {
            business_id: this.state.businessDetails.business_id,
            email: this.props.userData.email,
            token: this.props.userData.token,
            businesspass: this.state.bPass
        })
            .then(res => {
                console.log("Response from PASS CHANGE", res);
                this.updateDetails();
                this.setState({
                    changingBPass: false
                })
            })
            .catch(err => {
                console.log("Error from PASS CHANGE", err)
                alert("Something went wrong, check console")

            })
    }
    cancelAction = () => {
        this.setState({
            action: false
        })
    }
    runPromote = (changeeEmail) => {
        console.log("Promoting")
        this.setState({
            actionName: "promote",
            actionVictim: changeeEmail,
            action: true
        })
    }
    runDemote = (changeeEmail) => {
        console.log("Demoting")
        this.setState({
            actionName: "demote",
            actionVictim: changeeEmail,
            action: true
        })
    }
    runKick = (kickeeEmail) => {
        console.log("Kicking")
        this.setState({
            actionName: "kick",
            actionVictim: kickeeEmail,
            action: true
        })
    }
    runClose = (bName) => {
        console.log("Closing")
        this.setState({
            actionName: "close",
            actionVictim: bName,
            action: true
        })
    }
    goBackHome = () => {
        this.props.bClear()
        this.props.history.push("/home")
    }
    confirmAction = async () => {
        if (this.state.actionName === "promote") {
            await axios.put(`https://c-vivid-backend.herokuapp.com/roleChange`, {
                business_id: this.state.businessDetails.business_id,
                changerEmail: this.props.userData.email,
                changeeEmail: this.state.actionVictim,
                newRole: "Admin",
                token: this.props.userData.token
            })
                .then(res => {
                    console.log("Response from PROMOTE", res);
                    this.updateDetails();
                })
                .catch(err => {
                    console.log("Error from PROMOTE", err)
                    alert("Something went wrong, check console")

                })
        }
        else if (this.state.actionName === "demote") {
            await axios.put(`https://c-vivid-backend.herokuapp.com/roleChange`, {
                business_id: this.state.businessDetails.business_id,
                changerEmail: this.props.userData.email,
                changeeEmail: this.state.actionVictim,
                newRole: "Employee",
                token: this.props.userData.token
            })
                .then(res => {
                    console.log("Response from DEMOTE", res);
                    this.updateDetails();

                })
                .catch(err => {
                    console.log("Error from DEMOTE", err)
                    alert("Something went wrong, check console")

                })
        }
        else if (this.state.actionName === "kick") {
            await axios.put(`https://c-vivid-backend.herokuapp.com/kickMember`, {
                business_id: this.state.businessDetails.business_id,
                kickerEmail: this.props.userData.email,
                kickeeEmail: this.state.actionVictim,
                token: this.props.userData.token
            })
                .then(res => {
                    console.log("Response from KICK", res);
                    this.updateDetails();
                })
                .catch(err => {
                    console.log("Error from KICK", err)
                    alert("Something went wrong, check console")

                })
        }
        else if (this.state.actionName === "close") {
            await axios.put(`https://c-vivid-backend.herokuapp.com/businessClose`, {
                business_id: this.state.businessDetails.business_id,
                email: this.props.userData.email,
                token: this.props.userData.token
            })
                .then(res => {
                    console.log("Response from CLOSE", res);
                    this.updateDetails();
                })
                .catch(err => {
                    console.log("Error from CLOSE", err)
                    alert("Something went wrong, check console")

                })
        }
        else console.log("No Action Set")
    }
    render() {
        return (
            <div className="businessDetailsPage">
                <div>
                    <CVIVIDNav userData={this.props.userData} logout={this.logout} />
                </div>
                <div className="fullContainerBDP">
                    <div className="topButtons">
                        <div>
                            <Button onClick={this.goBackHome} style={{ padding: '5px 20px 5px 20px', backgroundColor: '#ab191e', color: 'white' }}>Back Home</Button>
                            <IconButton aria-label="refresh" onClick={() => this.updateDetails()}>
                                <RefreshIcon style={{ color: "white" }} />
                            </IconButton>
                        </div>
                        <div>
                            {this.state.businessDetails ? (
                                ((this.state.role == "Admin") | (this.state.role == "Owner")) ? (
                                    this.businessOpened ? (
                                        <div>
                                            <Button style={{ padding: '5px 20px 5px 20px', backgroundColor: '#64646420', color: 'rgb(255 255 255 / 26%)' }} disabled>Change Passcode</Button>
                                            <Button style={{ marginLeft: "10px", padding: '5px 20px 5px 20px', backgroundColor: '#64646420', color: 'rgb(255 255 255 / 26%)' }} disabled>Open</Button>
                                            <Button style={{ marginLeft: "10px", padding: '5px 20px 5px 20px', backgroundColor: '#ab191e' }} onClick={this.runClose}>Close</Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Button onClick={this.changingBPass} style={{ padding: '5px 20px 5px 20px', backgroundColor: '#ebebeb', color: 'black' }}>Change Passcode</Button>
                                            <Button style={{ marginLeft: "10px", padding: '5px 20px 5px 20px', backgroundColor: '#ab191e', color: 'white' }}>Open</Button>
                                            <Button style={{ marginLeft: "10px", padding: '5px 20px 5px 20px', backgroundColor: '#64646420', color: 'rgb(255 255 255 / 26%)' }} disabled>Close</Button>
                                        </div>
                                    )
                                ) : ("")
                            ) : ("")}
                        </div>
                    </div>
                    {this.state.businessDetails ? (
                        <div>
                            <div>
                                <div className="businessNameTitle">{this.state.businessDetails.businessname}</div>
                            </div>
                            <div className="topInfo">
                                <div>
                                    <div>{this.state.businessDetails.businessaddr}</div>
                                    <div>Role: {this.state.role}</div>
                                </div>
                                <div className="topRight">
                                    <div>ID: {this.state.businessDetails.business_id} </div>
                                    <div>Passcode: {this.state.businessDetails.businesspass}</div>
                                </div>
                            </div>
                            <div className="workersTableDiv">
                                <TableContainer component={Paper}>
                                    <Table className="workersTable" size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow className="workersRow">
                                                <TableCell className="tableText large-text">First name</TableCell>
                                                <TableCell className="tableText large-text" align="right">Last name</TableCell>
                                                <TableCell className="tableText large-text" align="right">Email</TableCell>
                                                <TableCell className="tableText large-text" align="right">Role</TableCell>
                                                <TableCell className="tableText large-text"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="workersTable">
                                            {this.state.businessDetails.members.map((member) => (
                                                <TableRow className="workersRow" key={member.email}>
                                                    <TableCell className="tableText" component="th" scope="row">
                                                        {member.firstname}
                                                    </TableCell>
                                                    <TableCell className="tableText" align="right">{member.lastname}</TableCell>
                                                    <TableCell className="tableText" align="right">{member.email}</TableCell>
                                                    <TableCell className="tableText" align="right" style={{width:'100px'}}>{member.role}</TableCell>
                                                    {(((this.state.role === "Owner") | (this.state.role === "Admin")) && (this.props.userData.email !== member.email)) ?
                                                        (
                                                            this.state.role === "Owner" ?
                                                                (
                                                                    member.role === "Admin" ?
                                                                        (
                                                                            <TableCell className="buttonText" align="center">
                                                                                <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                                    <Button className="disabledButton" onClick={() => this.runPromote(member.email)} disabled>Promote</Button>
                                                                                    <Button className="clickableButton" onClick={() => this.runDemote(member.email)}>Demote</Button>
                                                                                    <Button className="clickableButton" onClick={() => this.runKick(member.email)}>Kick</Button>
                                                                                </ButtonGroup>
                                                                            </TableCell>
                                                                        ) : (
                                                                            <TableCell className="buttonText" align="center">
                                                                                <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                                    <Button className="clickableButton" onClick={() => this.runPromote(member.email)}>Promote</Button>
                                                                                    <Button className="disabledButton" onClick={() => this.runDemote(member.email)} disabled>Demote</Button>
                                                                                    <Button className="clickableButton" onClick={() => this.runKick(member.email)}>Kick</Button>
                                                                                </ButtonGroup>
                                                                            </TableCell>
                                                                        )

                                                                ) : (
                                                                    ((member.role === "Admin") | (member.role === "Owner")) ?
                                                                        (
                                                                            <TableCell align="center">
                                                                                <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                                    <Button onClick={() => this.runPromote(member.email)} disabled>Promote</Button>
                                                                                    <Button onClick={() => this.runDemote(member.email)} disabled>Demote</Button>
                                                                                    <Button onClick={() => this.runKick(member.email)} disabled>Kick</Button>
                                                                                </ButtonGroup>
                                                                            </TableCell>
                                                                        ) : (
                                                                            <TableCell align="center">
                                                                                <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                                    <Button onClick={() => this.runPromote(member.email)} disabled>Promote</Button>
                                                                                    <Button onClick={() => this.runDemote(member.email)} disabled>Demote</Button>
                                                                                    <Button onClick={() => this.runKick(member.email)}>Kick</Button>
                                                                                </ButtonGroup>
                                                                            </TableCell>
                                                                        )
                                                                )

                                                        ) : (
                                                            <TableCell className="tableText"></TableCell>
                                                        )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    ) : (
                        <div>
                            No Info: If you can see this, you've encountered a bug (:
                            or you know.. you did something you weren't supposed to
                        </div>
                    )}
                </div>
                <div>
                    <Dialog open={this.state.action} onClose={this.cancelAction} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Warning</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to {this.state.actionName} {this.state.actionVictim}?
                                 </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.cancelAction} color="primary">
                                Cancel
                                </Button>
                            <Button onClick={this.confirmAction} color="primary">
                                Confirm
                                </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={this.state.changingBPass} onClose={this.cancelBPassChange} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Changing Passcode</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                What would you like to change passcode to?
                                 </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="bPass"
                                label="New Passcode"
                                type="string"
                                onChange={this.changeBPass}
                                fullWidth
                            />
                            {this.state.passError}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.cancelBPassChange} color="primary">
                                Cancel
                                </Button>
                            <Button onClick={this.BPassChange} color="primary">
                                Change
                                </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        )
    }
}

export default withRouter(BusinessDetailsPage)