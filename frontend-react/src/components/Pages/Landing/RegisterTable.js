import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import validator from 'validator';

class RegisterTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: "",
            errorMessage: "",
            successfulSignup: ""
        }
    }

    showPass(){
        var pass = document.getElementById("password");
        if (pass.type === "password") {
          pass.type = "text";
        } else {
          pass.type = "password";
        }
        var pass = document.getElementById("confirmPassword");
        if (pass.type === "password") {
          pass.type = "text";
        } else {
          pass.type = "password";
        }
    }

    changeFirstName = (event) => {
        this.setState({ firstName: event.target.value })
    }
    changeLastName = (event) => {
        this.setState({ lastName: event.target.value })
    }
    changeEmail = (event) => {
        this.setState({ email: event.target.value })
    }
    changePassword = (event) => {
        this.setState({ password: event.target.value })
    }
    changePasswordConfirm = (event) => {
        this.setState({ passwordConfirm: event.target.value })
    }
    handleSubmit = async (submit) => {
        if(validator.isEmail(this.state.email)) {
            if (this.state.password === this.state.passwordConfirm) {
                console.log(this.state.firstName, this.state.lastName, this.state.email, this.state.password, this.state.passwordConfirm, this.state.password === this.state.passwordConfirm)
                await this.props.userSignup(this.state.firstName, this.state.lastName, this.state.email, this.state.password)
                if(this.props.signUpError) {
                    this.setState({errorMessage:this.props.signUpError})
                } else {
                    this.setState({successfulSignup: this.props.signupResult})
                }
            } else {
                this.setState({errorMessage: "Passwords do not match"})
            }
        } else {
            this.setState({errorMessage: "Please enter a valid Email"})
        }
        
    }

    render() {
        return (
            <div>
                {this.state.successfulSignup!=="" ? (
                    <div className='registerTable registerSuccess'>
                        <br/>
                        Registration successful
                        <br/>
                        Please sign in
                        {/* If we have time before final presentation:
                        <div className="actionButton">
                            <Button onClick={()=>this.props.loginPass}  style={{color: 'white', backgroundColor: '#b71c1c', maxWidth: '160px', maxHeight: '50px', minWidth: '160px', minHeight: '50px'}}>SIGN IN</Button>
                        </div> */}
                    </div>
                ) : (
                    <div>
                        <div className='registerTable'>
                            <div><h1 className="registerTitle">REGISTER</h1></div>
                            <div className="registerName">
                                <TextField id="standard-full-width" className="firstName" label="First Name" placeholder="First Name" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} onChange={this.changeFirstName}/>
                                <TextField id="standard-full-width" className="lastName" label="Last Name" placeholder="Last Name" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} onChange={this.changeLastName}/>
                            </div>
                            <TextField id="standard-full-width" className="email" label="Email" placeholder="Email" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} onChange={this.changeEmail}/>
                            <TextField id="password" className="Password" type="password" label="Password" placeholder="Password" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} onChange={this.changePassword}/>
                            <TextField id="confirmPassword" className="confirmPassword" type="password" label="Confirm Password" placeholder="Confirm Password" fullWidth margin="normal" InputLabelProps={{ shrink: true, }} onChange={this.changePasswordConfirm}/>
                            <div className="showPassword"><input type="checkbox" className="showPassCheck" id='show-password' onClick={this.showPass}></input><label htmlFor='show-password'>Show Password</label></div>
                            <div className="TextField errorText" >{this.state.errorMessage}</div>
                            <Button className="registerButton" style={{color: 'white', backgroundColor: '#b71c1c', maxWidth: '295px', maxHeight: '50px', minWidth: '295px', minHeight: '50px'}} onClick={()=>this.handleSubmit()}>Register</Button>
                        </div>
                        {/* Name (first name, last name), Email (as username), Password (ability to hide the password), Confirm password */}
                    </div>)}
            </div>
        )
    }
}

export default RegisterTable