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

class ManagedBusinessTable extends Component {
    state = {
        businessList: undefined
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
    joinTracker = (bID, information) => {
        this.props.socket.emit('joinTracker', {businessId:bID,email:this.props.userData.email})
        this.props.socket.once("joinCheck", ({ counter, limit, error }) => {
            //console.log("JOIN Response",counter,limit,error)
            if(error!==undefined) this.setState({joinERR:error});
            else if(counter!==undefined&&limit!==undefined) {
                //console.log("Time to reroute")
                    var cInfo = {
                        limit: limit,
                        counter: counter
                    }
                    this.props.cUpdate(cInfo)
                    if (this.props.cInfo){
                        this.props.bView(information)
                        if (this.props.bDetails) {
                            this.props.history.push("/counter")
                        }
                    }
                }
            }
        )
    }
    render() {
        return (
            <TableContainer className="MBusinessTable" component={Paper}>
                <Table aria-label="simple table" size="medium">
                    <TableHead>
                        <TableRow >
                            <TableCell >
                            </TableCell>
                            <TableCell className="topRowT" align="left">
                                Affiliated Businesses
                            </TableCell>
                            <TableCell>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right">
                                <IconButton aria-label="refresh" onClick={() => this.props.businessUpdate()} style={{ textAlign: "right" }}>
                                    <RefreshIcon style={{ color: "white" }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="MTableBody">
                        {this.props.businessList ? (
                            this.props.businessList.length > 0 ? (this.props.businessList.map((business) => (
                                <TableRow key={business.businessId}>
                                    <TableCell component="th" scope="row" align="left" style={{ textAlign: "center", width: "50px" }}>
                                        <StarBorderIcon fontSize="medium" style={{ color: '#8a0602' }} />
                                    </TableCell>
                                    <TableCell className="MTableBody" component="th" scope="row" style={{ fontWeight: "bold",fontSize: "21px" }}>
                                        {business.businessname}
                                    </TableCell>
                                    <TableCell className="MTableBody" align="left">
                                        <div>
                                            <div>
                                                {business.businessId}
                                            </div>
                                            <div>
                                                BusinessID
                                        </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="MTableBody" align="left">
                                        <div>
                                            <div>
                                                {business.businessaddr}
                                            </div>
                                            <div>
                                                Location
                                        </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="right" className="Tbuttons">
                                        {business.isopened ?
                                            (
                                                <Button onClick={()=>this.joinTracker(business.businessId,business)} style={{ padding: '5px 20px 5px 20px', backgroundColor: '#ebebeb', color: 'black' }}>Track</Button>
                                            ) :
                                            (
                                                <Button style={{ padding: '5px 20px 5px 20px', backgroundColor: '#64646420', color: 'rgb(255 255 255 / 26%)' }} disabled>Closed</Button>
                                            )
                                        }
                                        <Button className="MTableBody" style={{ marginLeft:"10px", padding: '5px 20px 5px 20px', backgroundColor: '#ab191e' }} onClick={() => this.viewDetails(business)}>Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))) : (
                                <TableRow>
                                    <TableCell/>
                                    <TableCell>
                                    <div className="MTableBody"> Currently not in any business</div>
                                    </TableCell>
                                    <TableCell>
                                    <div className="MTableBody"> Register or join a business to get started</div>
                                    </TableCell>
                                    <TableCell/>
                                    <TableCell/>
                                </TableRow>
                            )) : (
                            <TableRow key="loading">
                                <TableCell />
                                <TableCell component="th" scope="row" style={{ textAlign: "center" }}>
                                    <div style={{ justifyContent: "center", padding: "30px" }}><CircularProgress fontSize="small" /></div>
                                </TableCell>
                                <TableCell component="th" scope="row" style={{ textAlign: "center" }}>
                                    <div className="MTableBody"> Loading Data . . .</div>
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>

                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default ManagedBusinessTable;