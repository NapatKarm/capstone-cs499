import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green, red, cyan } from '@material-ui/core/colors';

class ManagedBusinessTable extends Component {
    state = {
        businessList: []
    }
    componentDidMount() {
        this.setState({
            businessList: this.props.businessList,
        })
    }
    viewDetails = async (information) => {
        await this.props.bView(information)
        if (this.props.bDetails) {
            this.props.history.push("/details")
        }
    }
    render() {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table" size="medium">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#FFFFFF' }}>
                            Businesses
                            <IconButton aria-label="refresh" onClick={()=>this.props.businessUpdate()}>
                                <RefreshIcon />
                            </IconButton>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.businessList ? (
                            this.props.businessList.length > 0 ? (this.props.businessList.map((business) => (
                                <TableRow key={business.business_id}>
                                    <TableCell component="th" scope="row" style={{ textAlign: "center" }}>
                                        <StarBorderIcon fontSize="medium" style={{ color: '#8a0602' }} />
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ textAlign: "center" }}>
                                        {business.businessname}
                                    </TableCell>
                                    <TableCell align="center">
                                        <div>
                                            <div>
                                                {business.business_id}
                                            </div>
                                            <div>
                                                BusinessID
                                        </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div>
                                            <div>
                                                {business.businessaddr}
                                            </div>
                                            <div>
                                                Location
                                        </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {business.businessOpened ?
                                            (
                                                <Button>Track</Button>
                                            ) :
                                            (
                                                <Button disabled>Closed</Button>
                                            )
                                        }

                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => this.viewDetails(business)}>Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))) : (
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