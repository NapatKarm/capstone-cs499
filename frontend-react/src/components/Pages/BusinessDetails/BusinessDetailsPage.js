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

class BusinessDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessDetails: undefined,
            role: undefined,
            action: false,
            actionName: "",
            actionVictim: ""
        }
    }
    componentDidMount() {
        this.setState({
            businessDetails: this.props.bDetails
        }, () => {
            console.log("Updated Business Details", this.state.businessDetails)
            let roleGrab = this.state.businessDetails.members.find(element => element.email == this.props.userData.email)
            if(roleGrab!==undefined) {
                this.setState({
                    role: roleGrab.role
                })
            }
            else alert("Something is wrong, you are not in this business but you can still see it.")

        })
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
            if(roleGrab!==undefined) {
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
            console.log("Error from UPDATE",err)
            alert("You are no longer in this business")
                this.props.history.push("/home");
            
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
            action:true
        })
    }
    runDemote = (changeeEmail) => {
        console.log("Demoting")
        this.setState({
            actionName: "demote",
            actionVictim: changeeEmail,
            action:true
        })
    }
    runKick = (kickeeEmail) => {
        console.log("Kicking")
        this.setState({
            actionName: "kick",
            actionVictim: kickeeEmail,
            action:true
        })
    }
    goBackHome = () => {
        this.props.bClear()
        this.props.history.push("/home")
    }
    confirmAction = async () => {
        if(this.state.actionName==="promote") {
            await axios.put(`https://c-vivid-backend.herokuapp.com/roleChange`, {
                business_id: this.state.businessDetails.business_id,
                changerEmail: this.props.userData.email,
                changeeEmail: this.state.actionVictim,
                newRole: "Admin",
                token: this.props.userData.token
            })
            .then(res => {
                console.log("Response from PROMOTE",res);
                this.updateDetails();
            })
            .catch(err => {
                console.log("Error from PROMOTE",err)
                
            })
        }
        else if(this.state.actionName==="demote") {
            await axios.put(`https://c-vivid-backend.herokuapp.com/roleChange`, {
                business_id: this.state.businessDetails.business_id,
                changerEmail: this.props.userData.email,
                changeeEmail: this.state.actionVictim,
                newRole: "Employee",
                token: this.props.userData.token
            })
            .then(res => {
                console.log("Response from DEMOTE",res);
                this.updateDetails();

            })
            .catch(err => {
                console.log("Error from DEMOTE",err)
                
            })
        }
        else if(this.state.actionName==="kick") {
            await axios.put(`https://c-vivid-backend.herokuapp.com/kickMember`, {
                business_id: this.state.businessDetails.business_id,
                kickerEmail: this.props.userData.email,
                kickeeEmail: this.state.actionVictim,
                token: this.props.userData.token
            })
            .then(res => {
                console.log("Response from KICK",res);
                this.updateDetails();
            })
            .catch(err => {
                console.log("Error from KICK",err)
                
            })
        }
        else console.log("No Action Set")
    }
    render() {
        return (
            <div>
                <div>
                    <Button onClick={this.goBackHome}>Back Home</Button>
                    <IconButton aria-label="refresh" onClick={()=>this.updateDetails()}>
                                <RefreshIcon />
                    </IconButton>
                </div>
                <div>Your Role: {this.state.role}</div>
                {this.state.businessDetails ? (
                    <div>
                        <div className="topInfo">
                            <div>Business ID: {this.state.businessDetails.business_id} </div>
                            <div>Business Name: {this.state.businessDetails.businessname}</div>
                            <div>Business Address: {this.state.businessDetails.businessaddr}</div>
                            <div>Business Passcode: {this.state.businessDetails.businesspass}</div>
                        </div>
                        <div className="workersTable">
                            <TableContainer component={Paper}>
                                <Table className="workersTable" size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>First name</TableCell>
                                            <TableCell align="right">Last name</TableCell>
                                            <TableCell align="right">Email</TableCell>
                                            <TableCell align="right">Role</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.businessDetails.members.map((member) => (
                                            <TableRow key={member.email}>
                                                <TableCell component="th" scope="row">
                                                    {member.firstname}
                                                </TableCell>
                                                <TableCell align="right">{member.lastname}</TableCell>
                                                <TableCell align="right">{member.email}</TableCell>
                                                <TableCell align="right">{member.role}</TableCell>
                                                {(((this.state.role === "Owner") | (this.state.role === "Admin")) && (this.props.userData.email !== member.email)) ?
                                                    (
                                                        this.state.role === "Owner" ?
                                                            (
                                                                member.role === "Admin" ?
                                                                    (
                                                                        <TableCell align="center">
                                                                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                                <Button onClick={() => this.runPromote(member.email)} disabled>Promote</Button>
                                                                                <Button onClick={() => this.runDemote(member.email)}>Demote</Button>
                                                                                <Button onClick={() => this.runKick(member.email)}>Kick</Button>
                                                                            </ButtonGroup>
                                                                        </TableCell>
                                                                    ) : (
                                                                        <TableCell align="center">
                                                                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                                <Button  onClick={() => this.runPromote(member.email)}>Promote</Button>
                                                                                <Button  onClick={() => this.runDemote(member.email)} disabled>Demote</Button>
                                                                                <Button  onClick={() => this.runKick(member.email)}>Kick</Button>
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
                                                        <TableCell></TableCell>
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
            </div>
            </div>
        )
    }
}

export default withRouter(BusinessDetailsPage)