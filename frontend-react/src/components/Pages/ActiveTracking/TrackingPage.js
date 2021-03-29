import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SearchBar from "material-ui-search-bar";
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import './TrackingPage.css';
import longLogo from '../../Imgs/long-logo.png';

class TrackingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessDetails: undefined,
            searched: "",
            searchedVal: "",
            businessList: [],
            filterBList: []
        }
    }
    componentDidMount = () => {
        this.props.socket.on("updateMap", ({ allData }) => {
            console.log("from UPDATE MAP", allData)
            this.setState({ businessList: allData, filterBList: allData }, () => { console.log("New Business List", this.state.businessList) })
        })
        this.props.socket.on("test", ({ data }) => {
            console.log("from DEBUGGGGG", data)
        })
    }
    goBackHome = () => {
        // this.props.bClear()
        this.props.history.push("/")
    }
    requestSearch = (searchedVal) => {
        const filteredRows = this.state.businessList.filter((row) => {
            return row.businessname.toLowerCase().includes(searchedVal.toLowerCase());
        });
        this.setState({ filterBList: filteredRows })
    };
    cancelSearch = () => {
        this.setState({ searched: "" });
        this.requestSearch(this.state.searched);
    };
    refreshTB = () => {
        this.props.socket.emit("getAllData")
    }

    render() {
        return (
                <div className="TrackingBody">
                    <div className="topButtons trackTopButtons">
                        <Button onClick={this.goBackHome} style={{ padding: '5px 20px 5px 20px', backgroundColor: '#ab191e', color: 'white' }}>Register/Sign In</Button>
                        <IconButton aria-label="refresh" onClick={() => this.refreshTB()} style={{ textAlign: "right" }}>
                            <RefreshIcon style={{ color: "white" }} />
                        </IconButton>
                    </div>
                    <div>
                        <Paper>
                            <SearchBar
                                value={this.state.searched}
                                onChange={(searchVal) => this.requestSearch(searchVal)}
                                onCancelSearch={() => this.cancelSearch()}
                            />
                            <TableContainer className="trackTable">
                                <Table className="searchTable">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="tableText large-text">BUSINESS NAME</TableCell>
                                            <TableCell className="tableText large-text">ADDRESS</TableCell>
                                            <TableCell className="tableText large-text">CURRENT CAPACITY</TableCell>
                                            <TableCell className="tableText large-text">MAX CAPACITY</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="bListTable">
                                        {this.state.filterBList ? (
                                            this.state.filterBList.map((business) => (
                                                <TableRow>
                                                    <TableCell className="whiteText">
                                                        {business.businessname}
                                                    </TableCell>
                                                    <TableCell className="whiteText">
                                                        {business.businessaddr}
                                                    </TableCell>
                                                    <TableCell className="whiteText">
                                                        {business.counter}
                                                    </TableCell>
                                                    <TableCell className="whiteText">
                                                        {business.limit}
                                                    </TableCell>
                                                </TableRow>
                                            ))) : (
                                            <TableRow>
                                                <TableCell>
                                                    No Current Active Business
                                        </TableCell>
                                                <TableCell>
                                                </TableCell>
                                                <TableCell>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                </div>
        )
    }
}

export default withRouter(TrackingPage)