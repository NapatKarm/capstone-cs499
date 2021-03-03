import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ManagedBusinessTable from './ManagedBusinessTable'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData:{},
            businessList: []
        }
    }
    componentDidMount = () => {
        this.setState({
            userData: this.props.userData
        }, () => {
            if(this.state.userData){
                this.setState({
                    businessList: this.state.userData.businesses
            })
            }
        })
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
                        <ManagedBusinessTable businessList={this.state.businessList}/>
                    </div>
                    <div className="workedBusinessTable">

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(HomePage)