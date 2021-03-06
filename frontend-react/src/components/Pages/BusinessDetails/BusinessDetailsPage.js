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


class BusinessDetailsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessDetails: undefined
        }
    }
    componentDidMount() {
        this.setState({
            businessDetails: this.props.bDetails
        }, () => {
            console.log("Updated Business Details", this.state.businessDetails)
        })
    }
    goBackHome =()=> {
        this.props.bClear()
        this.props.history.push("/home")
    }
    render() {
        return (
            <div>
                <Button onClick={this.goBackHome}>Back Home</Button>
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