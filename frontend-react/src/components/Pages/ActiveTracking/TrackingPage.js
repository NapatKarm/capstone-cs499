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
import PopupComponent from './PopupComponent';
import Geocoder from 'react-mapbox-gl-geocoder'
import {mapAccess,queryParams} from '../SharedComponent/Shared';

const mapStyle = {
    width: '80%',
    height: '100%'
}

const mapboxApiKey = 'pk.eyJ1IjoibmFwYXRrYXJtIiwiYSI6ImNrbWRzejdmZTJwOGIyb29qem5kaGdnYWQifQ.0qB-jB0GW4iI1V3ban2fXQ';

class TrackingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterBList: [],
            businessList: [],
            businessDetails: undefined,
            markerPopupState: "false",
            searched: "",
            searchedVal: "",
            selectedBusiness: "",
            addrSelection: undefined,
            viewport: {
                latitude: 40.767824,
                longitude: -73.964216,
                zoom: 15
            }
        }
    }

    componentDidMount = () => {
        this.props.socket.emit("getAllData")
        this.props.socket.on("updateMap", ({ allData }) => {
            //console.log("from UPDATE MAP", allData)
            this.setState({ businessList: allData }, () => { 
                const filteredRows = this.state.businessList.filter((row) => {
                    return row.businessname.toLowerCase().includes(this.state.searchedVal.toLowerCase());
                });
                this.setState({ filterBList: filteredRows })
                if(this.state.businessDetails!=undefined){
                    let tempBusiness = this.state.businessList.find(business => business.businessId == this.state.businessDetails.businessId)
                    this.setState({businessDetails:tempBusiness})
                }
            })
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
    viewChange = (lat,long,id) => {
        this.setState({
            selectedBusiness:id,
            viewport: {
                ...this.state.viewport,
                latitude: lat,
                longitude: long
            },
            addrSelection: undefined
        })
    }
    cancelSearch = () => {
        this.setState({ searched: "" });
        this.requestSearch(this.state.searched);
    };
    refreshTB = () => {
        this.props.socket.emit("getAllData")
    }
    businessMarker = (business) => {
        // console.log("Business",business)
        // let location = {
        //     latitude: business.lat,
        //     longitude: business.long
        // }
        this.setState({markerPopupState: "true", businessDetails: business,selectedBusiness:business.businessId})
    }
    onSelected = (viewport,item) => {
        if(this.state.businessList.length>0){
            let SBusiness = this.state.businessList.find(business => (business.long == viewport.longitude && business.lat == viewport.latitude))
            if(SBusiness!=undefined){
                this.setState({viewport,selectedBusiness:SBusiness.businessId})
            }
            else this.setState({viewport, addrSelection:viewport,selectedBusiness:undefined})
        }
        else this.setState({viewport, addrSelection:viewport,selectedBusiness:undefined})

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
                                                business.businessId == this.state.selectedBusiness ?
                                                    (
                                                        <Marker
                                                        longitude={business.long}
                                                        latitude={business.lat}
                                                        onClick={()=>this.businessMarker(business)}
                                                    >
                                                        <div className="cmarker temporary cmarker"><span ><div className="markerText">{business.limit-business.counter}</div></span></div>
                                                    </Marker>
                                                    ):(
                                                        <Marker
                                                        longitude={business.long}
                                                        latitude={business.lat}
                                                        onClick={()=>this.businessMarker(business)}
                                                    >
                                                        <div className="marker temporary marker"><span ><div className="markerText">{business.limit-business.counter}</div></span></div>
                                                    </Marker>
                                                    )//, ()=>{
                                                    //     if(business.businessId == this.state.businessDetails.businessId){
                                                    //         this.setState({businessDetails: business})
                                                    // }},
                                            )
                    ):("")}
                    { this.state.addrSelection ? 
                    (   <Marker 
                        longitude={this.state.addrSelection.longitude}
                        latitude={this.state.addrSelection.latitude}>
                        <div className="cmarker temporary cmarker"><span ><div className="markerText">X</div></span></div>
                        </Marker>):("")}
                    </ReactMapGL>
                </div>
                <div>
                    {this.state.markerPopupState==="false" ? ("") : (<div className="markerPopup"><PopupComponent businessDetails={this.state.businessDetails}/></div>)}
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
                                        {this.state.filterBList.length!=0 ? (
                                            this.state.filterBList.map((business) => (
                                                <TableRow>
                                                    <TableCell className="businessCell" onClick={()=>this.viewChange(business.lat,business.long,business.businessId)}>
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
                                                <TableCell className="whiteText">
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
                <div className="addrSearchBar">
                    <div className="actualSearch">
                    <Geocoder
                        id="BAddress"
                        {...mapAccess} hideOnSelect={false}
                        onSelected={this.onSelected}
                        value=""
                        queryParams={queryParams}
                        viewport={viewport}
                        updateInputOnSelect
                    />
                    </div>
                    </div>
            </div>
        )
    }
}

export default withRouter(TrackingPage)