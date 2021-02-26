import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ManagedBusinessTable from './ManagedBusinessTable'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            grouplist: []
        }
    }
    componentDidMount = () => {
        this.setState({
            grouplist: this.props.grouplist
        })
    }
    signUp = () => {
        this.props.userSignup(this.state.username, this.state.password)
    }

    render() {
        return(
            <div>
                <div>Top Nav</div>
                <div>
                    <div>
                        <Button>Register business</Button><Button>Join Business</Button>
                    </div>
                    <div className="managedBusinessTable">
                        <ManagedBusinessTable grouplist={this.state.grouplist}/>
                    </div>
                    <div className="workedBusinessTable">

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(HomePage)