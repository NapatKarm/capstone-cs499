import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
import {Endpoint} from '../../Endpoint';

import './BusinessDetailsPage.css';

class BusinessDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessDetails: undefined,
            role: undefined,
            action: false,
            isopened: false,
            actionName: "",
            actionVictim: "",
            changingBPass: false,
            passError: "",
            openingBusiness: false,
            limitNum: "",
            openERR: "",
            returnERR: ""
        }
    }
    componentDidMount() {
        this.props.socket.on("kickResponse",({ success, error }) => {
            if(error!==undefined){
                console.log("Kick error: ",error);
                alert("Something went wrong check the console")
            }
            if(success!==undefined){
                console.log("Successfully kicked user")
                this.updateDetails();
            }
        })
        this.props.socket.on("kicked",({businessId}) => {
            console.log("KICKED SOCKETS",businessId)
            if(this.state.businessDetails !== undefined)
            {
                if(businessId===this.state.businessDetails.businessId){
                    this.props.socket.removeAllListeners();
                    alert("You have been removed from the business")
                    this.props.history.push("/home")
                }
            }
        })
        this.setState({
            businessDetails: this.props.bDetails
        }, () => {
            console.log("Updated Business Details", this.state.businessDetails)
            let roleGrab = this.state.businessDetails.memberList.find(element => element.email === this.props.userData.email)
            if (roleGrab !== undefined) {
                this.setState({
                    role: roleGrab.role,
                    isopened: this.state.businessDetails.isopened
                })
                this.updateDetails()
            }
            else alert("Something is wrong, you are not in this business but you can still see it.")
        })
    }
    // componentDidUpdate() {
    //     // this.props.socket.on("closeResponse", ({ success, error }) => {
    //     //     console.log("REEEEE Close Response",success,error)
    //     //     if(error!==undefined) this.setState({returnERR:"An Error has occurred, please try again"});
    //     //     else if(success!==undefined) {
    //     //         this.setState({
    //     //             action: false
    //     //         })
    //     //         this.updateDetails();
    //     //         }
    //     //     }
    //     // )
    // }

    logout = () => {
        this.props.socket.removeAllListeners();
        this.props.bUserLogout()
        this.props.userLogout()
        this.props.history.push("/")
    }
    updateDetails = async () => {
        console.log("UPDATING")
        axios.post(`${Endpoint}/getSingleBusinessData`, {
            businessId: this.state.businessDetails.businessId,
            email: this.props.userData.email,
            token: this.props.userData.token
        })
            .then(res => {
                this.setState({
                    businessDetails: res.data,
                    action: false
                })
                let roleGrab = this.state.businessDetails.memberList.find(element => element.email === this.props.userData.email)
                if (roleGrab !== undefined) {
                    this.setState({
                        role: roleGrab.role,
                        isopened: this.state.businessDetails.isopened
                    })
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
    cancelOpening = () => {
        this.setState({
            openingBusiness: false,
            limitNum: ""
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
    BOpen = () => {
        console.log("Should be running Business Open",this.state)
        if(this.state.limitNum==="")
        {
            this.setState({openERR:"Please enter a limit"});
        }
        else 
        {
            this.props.socket.emit('openBusiness', { 
                businessId: this.state.businessDetails.businessId,
                businessname: this.state.businessDetails.businessname,
                businessaddr: this.state.businessDetails.businessaddr,
                limit: this.state.limitNum,
                email: this.props.userData.email,
                token: this.props.userData.token
             })
            this.props.socket.once("openResponse", ({ success, error }) => {
                console.log("Open Response",success,error)
                if(error!==undefined) this.setState({openERR:"An Error has occurred, please try again"});
                else if(success!==undefined) {
                    this.setState({
                        openingBusiness: false
                    })
                    }
                    this.updateDetails();
                }
            )
        }

    }
    BPassChange = async () => {
        await axios.put(`${Endpoint}/passcodeChange`, {
            businessId: this.state.businessDetails.businessId,
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
    deleteB = () => {
        console.log("DELETING")
        this.setState({
            actionName: "delete",
            actionVictim: "this business",
            action: true
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
    runClose = () => {
        console.log("Closing")
        this.setState({
            actionName: "close",
            actionVictim: this.state.businessDetails.businessname,
            action: true
        })
    }
    runOpen = () => {
        console.log("Opening")
        this.setState({
            openingBusiness: true,
            openERR: "",
            limitNum: ""
        })
    }
    joinTracker = (bID, information) => {
        this.props.socket.emit('joinTracker', {businessId:bID,email:this.props.userData.email})
        this.props.socket.once("joinCheck", ({ counter, limit, error }) => {
            console.log("JOIN Response",counter,limit,error)
            if(error!==undefined) this.setState({joinERR:error});
            else if(counter!==undefined&&limit!==undefined) {
                console.log("Time to reroute")
                    var cInfo = {
                        limit: limit,
                        counter: counter
                    }
                    this.props.cUpdate(cInfo)
                    if (this.props.cInfo){
                        this.props.bView(information)
                        if (this.props.bDetails) {
                            this.props.socket.removeAllListeners();
                            this.props.history.push("/counter")
                        }
                    }
                }
            }
        )
    }
    changeLimit = (event) => {
        this.setState({ limitNum: event.target.value })
    }
    goBackHome = () => {
        this.props.bClear()
        this.props.history.push("/home")
    }
    confirmAction = async () => {
        if (this.state.actionName === "promote") {
            await axios.put(`${Endpoint}/roleChange`, {
                businessId: this.state.businessDetails.businessId,
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
            await axios.put(`${Endpoint}/roleChange`, {
                businessId: this.state.businessDetails.businessId,
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
            this.props.socket.emit('kickMember', {
                businessId: this.state.businessDetails.businessId,
                kickerEmail: this.props.userData.email,
                kickeeEmail: this.state.actionVictim,
                token: this.props.userData.token
            })
        }
        else if (this.state.actionName === "close") {
            console.log("Should be running Business CLOSE",this.state)
            this.props.socket.emit('closeBusiness', { 
                businessId: this.state.businessDetails.businessId,
                email: this.props.userData.email,
                token: this.props.userData.token
             })
            this.props.socket.once("closeResponse", ({ success, error }) => {
                console.log("Close Response",success,error)
                if(error!==undefined) this.setState({returnERR:"An Error has occurred, please try again"});
                else if(success!==undefined) {
                    this.setState({
                        action: false
                    })
                    this.updateDetails();
                    }
                }
            )
        }
        else if (this.state.actionName === "delete") {
            await axios.delete(`${Endpoint}/businessDelete`, {data: {
                businessId: this.state.businessDetails.businessId,
                email: this.props.userData.email,
                token: this.props.userData.token
            }})
                .then(res => {
                    console.log("Response from DELETE", res);
                    this.props.history.push("/home");
                })
                .catch(err => {
                    console.log("Error from DELETE", err)
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
                                ((this.state.role === "Admin") | (this.state.role === "Owner")) ? (
                                    this.state.isopened ? (
                                        <div>
                                            <Button style={{ padding: '5px 20px 5px 20px', backgroundColor: '#64646420', color: 'rgb(255 255 255 / 26%)' }} disabled>Change Passcode</Button>
                                            <Button onClick={()=>this.joinTracker(this.state.businessDetails.businessId,this.state.businessDetails)} style={{ marginLeft: "10px", padding: '5px 20px 5px 20px', backgroundColor: 'white', color: 'black'}}>Track</Button>
                                            <Button className="forcedWhiteColor"style={{ marginLeft: "10px", padding: '5px 20px 5px 20px', backgroundColor: '#ab191e' }} onClick={this.runClose}>Close</Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Button onClick={this.changingBPass} style={{ padding: '5px 20px 5px 20px', backgroundColor: '#ebebeb', color: 'black' }}>Change Passcode</Button>
                                            <Button style={{ marginLeft: "10px", padding: '5px 20px 5px 20px', backgroundColor: '#64646420', color: 'rgb(255 255 255 / 26%)' }} disabled>Track</Button>
                                            <Button onClick={this.runOpen} style={{ marginLeft: "10px", padding: '5px 20px 5px 20px', backgroundColor: '#ab191e', color: 'white'}}>Open</Button>
                                        </div>
                                    )
                                ) : ("")
                            ) : ("")}
                        </div>
                    </div>
                    {this.state.businessDetails ? (
                        <div>
                            <div className="NameDeleteDiv">
                                <div className="businessNameTitle">{this.state.businessDetails.businessname}</div>
                                {this.state.role === "Owner" ? (
                                    <div className="deleteBusiness" onClick={this.deleteB}>Delete Business</div>
                                ):(
                                    ""
                                )}
                            </div>
                            <div className="topInfo">
                                <div>
                                    <div>{this.state.businessDetails.businessaddr}</div>
                                    <div>Role: {this.state.role}</div>
                                </div>
                                <div className="topRight">
                                    <div>ID: {this.state.businessDetails.businessId} </div>
                                    <div>Passcode: {this.state.businessDetails.businesspass}</div>
                                </div>
                            </div>
                            <div className="workersTableDiv">
                                <TableContainer component={Paper}>
                                    <Table className="workersTable" size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow className="workersRow">
                                                <TableCell className="tableText large-text">FIRST NAME</TableCell>
                                                <TableCell className="tableText large-text">LAST NAME</TableCell>
                                                <TableCell className="tableText large-text">EMAIL</TableCell>
                                                <TableCell className="tableText large-text">ROLE</TableCell>
                                                <TableCell className="tableText large-text"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="workersTable">
                                            {this.state.businessDetails.memberList.map((member) => (
                                                <TableRow className="workersRow" key={member.email}>
                                                    <TableCell className="tableText" component="th" scope="row">
                                                        {member.firstname}
                                                    </TableCell>
                                                    <TableCell className="tableText">{member.lastname}</TableCell>
                                                    <TableCell className="tableText">{member.email}</TableCell>
                                                    <TableCell className="tableText" style={{width:'100px'}}>{member.role}</TableCell>
                                                    {(((this.state.role === "Owner") | (this.state.role === "Admin")) && (this.props.userData.email !== member.email)) ?
                                                        (
                                                            this.state.role === "Owner" ?
                                                                (
                                                                    member.role === "Admin" ?
                                                                        (
                                                                            <TableCell className="buttonText buttonCell" align="center">
                                                                                <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                                    <Button className="disabledButton" onClick={() => this.runPromote(member.email)} disabled>Promote</Button>
                                                                                    <Button className="clickableButton" onClick={() => this.runDemote(member.email)}>Demote</Button>
                                                                                    <Button className="clickableButton" onClick={() => this.runKick(member.email)}>Kick</Button>
                                                                                </ButtonGroup>
                                                                            </TableCell>
                                                                        ) : (
                                                                            <TableCell className="buttonText buttonCell" align="center">
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
                                                                            <TableCell className="buttonCell" align="center">
                                                                                <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                                    <Button className="disabledButton" onClick={() => this.runPromote(member.email)} disabled>Promote</Button>
                                                                                    <Button className="disabledButton" onClick={() => this.runDemote(member.email)} disabled>Demote</Button>
                                                                                    <Button className="disabledButton" onClick={() => this.runKick(member.email)} disabled>Kick</Button>
                                                                                </ButtonGroup>
                                                                            </TableCell>
                                                                        ) : (
                                                                            <TableCell className="buttonCell" align="center">
                                                                                <ButtonGroup color="primary" aria-label="outlined primary button group">
                                                                                    <Button className="disabledButton" onClick={() => this.runPromote(member.email)} disabled>Promote</Button>
                                                                                    <Button className="disabledButton" onClick={() => this.runDemote(member.email)} disabled>Demote</Button>
                                                                                    <Button className="clickableButton" onClick={() => this.runKick(member.email)}>Kick</Button>
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
                            or you know... you did something you weren't supposed to
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
                                 {this.state.returnERR}
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
                    <Dialog open={this.state.openingBusiness} onClose={this.cancelOpening} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Open Store</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                What is your maximum capacity for the day?
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="limit"
                                label="Capacity"
                                type="number"
                                onChange={this.changeLimit}
                                fullWidth
                            />
                            {this.state.openERR}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.cancelOpening} color="primary">
                                Cancel
                            </Button>
                            <Button  onClick={this.BOpen}color="primary">
                                Open
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        )
    }
}

export default withRouter(BusinessDetailsPage)