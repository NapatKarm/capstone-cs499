import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import validator from 'validator'; //https://www.npmjs.com/package/validator

class LoginTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errorMessage: ""
        }
    }

    showPass(){
        var pass = document.getElementById("password");
        if (pass.type === "password") {
          pass.type = "text";
        } else {
          pass.type = "password";
        }
    }

    changeEmail = (event) => {
        this.setState({ email: event.target.value })
    }
    changePassword = (event) => {
        this.setState({ password: event.target.value })
    }

    handleSubmit = async (submit) => {
        // submit.preventDefault()
        console.log(this.state.email, validator.isEmail(this.state.email), this.state.password)
        if(validator.isEmail(this.state.email)) {
            console.log("Email validated!")
            if(this.state.password === "") {
                this.setState({errorMessage: "Please enter a password"})
            } else {
                await this.props.userLogin(this.state.email, this.state.password)
                if(this.props.logInError) {
                    this.setState({
                        errorMessage: this.props.logInError
                    })
                }
            }
        } else {
            this.setState({errorMessage: "Please enter a valid Email"})
        }
    }

    render() {
        return (
            <div>
                <div className='loginTable'>
                    <div><h1 className="loginTitle">SIGN IN</h1></div>
                    <TextField id="standard-full-width" className="email" label="Email" placeholder="Email" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} onChange={this.changeEmail}/>
                    <TextField id="password" className="Password" type="password" label="Password" placeholder="Password" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} onChange={this.changePassword}/>
                    <div className="showPassword"><input type="checkbox" className="showPassCheck"id='show-password' onClick={this.showPass}></input><label htmlFor='show-password'>Show Password</label></div>
                    <div className="TextField errorText" >{this.state.errorMessage}</div>
                    <Button className="loginButton" style={{color: 'white', backgroundColor: '#b71c1c', maxWidth: '295px', maxHeight: '50px', minWidth: '295px', minHeight: '50px'}} onClick={()=>this.handleSubmit()}>Sign In</Button>
                </div>
                {/* Name (first name, last name), Email (as username), Password (ability to hide the password), Confirm password */}
            </div>
        )
    }
}

export default LoginTable