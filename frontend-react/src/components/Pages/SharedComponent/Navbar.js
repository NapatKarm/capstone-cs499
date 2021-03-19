import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
class CVIVIDNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uFirst: "",
            uLast: "",
        }
    }
    componentDidMount() {
        if(this.props.userData) {
            this.setState({
                uFirst: this.props.userData.firstname,
                uLast: this.props.userData.lastname
            },()=>{console.log("Nav Check",this.state.uFirst,this.state.uLast)})
        }
    }
    render() {
        return (
            <div>
                <AppBar position="static" style={{ padding: '5px',backgroundColor: "#8a0602" }}>
                    <Toolbar style={{display:'flex',justifyContent:'space-between'}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        </div>
                        <div>
                            <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                        <div style={{display:'flex', flexDirection:'column',textAlign:'right',fontSize:'18px',marginRight:'20px'}}>
                            <div>
                                {this.state.uFirst} {this.state.uLast}
                            </div>
                            <div>
                            <Button style={{ padding: '5px 20px 5px 20px', backgroundColor: '#ab191e', color: 'rgb(255 255 255 / 100%)' }} onClick={this.props.logout}>Logout</Button>
                            </div>
                        </div>
                        <div>
                        <AccountCircle fontSize="large"/>
                        </div>
                        </div>
                        <div>
                        
                        </div>
                        
                        </div>
                            
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default CVIVIDNav