import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
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
import ReactMapGL, {Marker} from 'react-map-gl';
// import Geocoder from 'react-mapbox-gl-geocoder';

const mapStyle = {
    width: '80%',
    height: '100%'
}

const mapboxApiKey = 'pk.eyJ1IjoibmFwYXRrYXJtIiwiYSI6ImNrbWRzejdmZTJwOGIyb29qem5kaGdnYWQifQ.0qB-jB0GW4iI1V3ban2fXQ';

class TrackingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessList: undefined,
            searched: "",
            searchedVal: "",
            viewport: {
                latitude: 40.767824,
                longitude: -73.964216,
                zoom: 15
            },
        }
    }

    componentDidMount = () => {
        this.props.socket.on("updateMap", ({ allData }) => {
            console.log("from UPDATE MAP", allData)
            this.setState({ businessList: allData }, () => { 
                const filteredRows = this.state.businessList.filter((row) => {
                    return row.businessname.toLowerCase().includes(this.state.searchedVal.toLowerCase());
                });
                this.setState({ filterBList: filteredRows })
            })
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
        this.setState({ searchedVal: searchedVal }, () => { 
            const filteredRows = this.state.businessList.filter((row) => {
                return row.businessname.toLowerCase().includes(this.state.searchedVal.toLowerCase());
            });
            this.setState({ filterBList: filteredRows })
        })
    };
    cancelSearch = () => {
        this.setState({ searched: "" });
        this.requestSearch(this.state.searched);
    };
    refreshTB = () => {
        this.props.socket.emit("getAllData")
    }

    render() {
        const { viewport } = this.state;
        return (
            <div className="TrackingBody">
                <div className="mapSide">
                    <ReactMapGL
                        mapboxApiAccessToken={mapboxApiKey}
                        mapStyle="mapbox://styles/mapbox/light-v10"
                        width="100%"
                        height="100%"
                        {...viewport}
                        onViewportChange={(viewport) => this.setState({ viewport })}
                    >
                    { this.state.businessList!=undefined ? (
                                                this.state.businessList.map((business) => 
                                                <Marker
                                                    longitude={business.long}
                                                    latitude={business.lat}
                                                >
                                                    <div className="marker temporary marker"><span ><div className="markerText">{business.limit-business.counter}</div></span></div>
                                                </Marker>
                                            )
                    ):("")}

                    </ReactMapGL>
                </div>
                <div className="leftSide-map">
                    <div className="topButtons trackTopButtons">
                        <Button onClick={this.goBackHome} style={{ padding: '5px 20px 5px 20px', backgroundColor: '#ab191e', color: 'white' }}>Register/Sign In</Button>
                        <IconButton aria-label="refresh" onClick={() => this.refreshTB()} style={{ textAlign: "right" }}>
                            <RefreshIcon style={{ color: "white" }} />
                        </IconButton>
                    </div>
                    <div>
                        <Paper>
                            <div style={{paddingLeft:"3%",paddingRight:'3%',backgroundColor:'#191919'}}>
                            <SearchBar
                                value={this.state.searched}
                                onChange={(searchVal) => this.requestSearch(searchVal)}
                                onCancelSearch={() => this.cancelSearch()}
                                placeholder="Search active business..."
                            />
                            </div>
                            <TableContainer className="trackTable">
                                <Table className="searchTable">
                                    <TableHead>
                                        {/* <TableRow>
                                            <TableCell className="tableText large-text">BUSINESS NAME</TableCell>
                                            <TableCell className="tableText large-text">ADDRESS</TableCell>
                                            <TableCell className="tableText large-text">CURRENT CAPACITY</TableCell>
                                            <TableCell className="tableText large-text">MAX CAPACITY</TableCell>
                                        </TableRow> */}
                                    </TableHead>
                                    <TableBody className="bListTable">
                                        {this.state.filterBList ? (
                                            this.state.filterBList.map((business) => (
                                                <TableRow>
                                                    <TableCell className="whiteText">
                                                        <div>
                                                            <div className="businessHeader">{business.businessname}</div>
                                                            {business.businessaddr}
                                                        </div>
                                                        <div>
                                                            Spaces Left: {business.limit-business.counter}
                                                        </div>
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
            </div>
        )
    }
}

export default withRouter(TrackingPage)