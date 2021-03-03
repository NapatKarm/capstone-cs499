import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import StarsIcon from '@material-ui/icons/Stars';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green,red,cyan } from '@material-ui/core/colors';

class ManagedBusinessTable extends Component {
    state = {
        businessList: []
    }
    componentDidMount() {
        this.setState({
            businessList: this.props.businessList,
        })
    }
    render() {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table" size="medium">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#FFFFFF' }}>
                            Businesses
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.businessList ? (
                            this.props.businessList.length > 0 ? (this.props.businessList.map((business) => (
                            <TableRow key={business.business_id}>
                                <TableCell component="th" scope="row" style={{ textAlign: "center" }}>
                                    <StarsIcon fontSize="small" style={{ color: cyan[500] }} />
                                </TableCell>
                                <TableCell component="th" scope="row" style={{ textAlign: "center" }}>
                                    {business.businessname}
                                </TableCell>
                                <TableCell align="center">
                                    <div>
                                        <div>
                                            xx
                                        </div>
                                        <div>
                                            Current Visitors
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell align="center">
                                    <div>
                                        <div>
                                            xx
                                        </div>
                                        <div>
                                            Location
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button>Track</Button>
                                </TableCell>
                                <TableCell>
                                    <Button>Details</Button>
                                </TableCell>
                            </TableRow>
                        ))):(
                            <div> Currently not in any business</div>
                        )) : (
                                <TableRow key="loading">
                                    <TableCell />
                                    <TableCell component="th" scope="row" style={{ textAlign: "center" }}>
                                        <div style={{ justifyContent: "center", padding: "30px" }}><CircularProgress fontSize="small" /></div>
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ textAlign: "center" }}>
                                       <div> Loading Data... </div>
                            </TableCell>
                                </TableRow>

                            )}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default ManagedBusinessTable;