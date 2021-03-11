import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';


class BusinessDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessDetails: undefined,
            role: undefined
        }
    }
    componentDidMount() {
        this.setState({
            businessDetails: this.props.bDetails
        }, () => {
            console.log("Updated Business Details", this.state.businessDetails)
            let roleGrab = this.state.businessDetails.members.find(element => element.email == this.props.userData.email)
            this.setState({
                role: roleGrab.role
            })
        })
    }
    runPromote = (changeeEmail) => {
        console.log("Promoting")
    }
    runDemote = (changeeEmail) => {
        console.log("Demoting")
    }
    runKick = (kickeeEmail) => {
        console.log("Kicking")
    }
    goBackHome =()=> {
        this.props.bClear()
        this.props.history.push("/home")
    }
    render() {
        return (
            <div>
                <div>
                    <Button onClick={this.goBackHome}>Back Home</Button>
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
                                                {(((this.state.role==="Owner")|(this.state.role==="Admin"))&&(this.props.userData.email!==member.email)) ? 
                                                (
                                                    this.state.role==="Owner" ? 
                                                    (
                                                        member.role==="Admin" ? 
                                                        (
                                                            <TableCell>
                                                            <Button color="primary" onClick={()=>this.runPromote(member.email)} disabled>Promote</Button>
                                                            <Button color="primary" onClick={()=>this.runDemote(member.email)}>Demote</Button>
                                                            <Button color="primary" onClick={()=>this.runKick(member.email)}>Kick</Button>
                                                        </TableCell>
                                                        ):(
                                                            <TableCell>
                                                            <Button color="primary" onClick={()=>this.runPromote(member.email)}>Promote</Button>
                                                            <Button color="primary" onClick={()=>this.runDemote(member.email)} disabled>Demote</Button>
                                                            <Button color="primary" onClick={()=>this.runKick(member.email)}>Kick</Button>
                                                        </TableCell>
                                                        )

                                                    ):(
                                                        ((member.role==="Admin")|(member.role==="Owner")) ? 
                                                        (
                                                            <TableCell>
                                                            <Button color="primary" onClick={()=>this.runPromote(member.email)} disabled>Promote</Button>
                                                            <Button color="primary" onClick={()=>this.runDemote(member.email)} disabled>Demote</Button>
                                                            <Button color="primary" onClick={()=>this.runKick(member.email)} disabled>Kick</Button>
                                                        </TableCell>
                                                        ):(
                                                            <TableCell>
                                                            <Button color="primary" onClick={()=>this.runPromote(member.email)} disabled>Promote</Button>
                                                            <Button color="primary" onClick={()=>this.runDemote(member.email)} disabled>Demote</Button>
                                                            <Button color="primary" onClick={()=>this.runKick(member.email)}>Kick</Button>
                                                        </TableCell>
                                                        )                                                     
                                                    )
                                                    
                                                ):(
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
            </div>
        )
    }
}

export default withRouter(BusinessDetailsPage)