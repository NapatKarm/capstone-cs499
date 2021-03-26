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

import './TrackingPage.css';
import longLogo from '../../Imgs/long-logo.png';

class TrackingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessDetails: undefined,
            searched: "",
            searchedVal: ""
        }
    }

    goBackHome = () => {
        // this.props.bClear()
        this.props.history.push("/")
    }

    cancelSearch = () => {
        this.setState({searched: "blank"});
        console.log(this.state.searched);
        // requestSearch(this.state.searched);
    };

    render() {
        return(
            <div className="TrackingBody">
                <div className="topButtons">
                    <Button onClick={this.goBackHome} style={{ padding: '5px 20px 5px 20px', backgroundColor: '#ab191e', color: 'white' }}>Register/Sign In</Button>
                </div>
                <div>
                <SearchBar
                    
                />
                </div>
            </div>
        )
    }
}

export default withRouter(TrackingPage)