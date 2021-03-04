import React, { Component } from 'react';
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
        submit.preventDefault()
        if(validator.isEmail(this.state.email)) {
            if (this.state.password === this.state.passwordConfirm) {
                console.log(this.state.firstName, this.state.lastName, this.state.email, this.state.password, this.state.passwordConfirm, this.state.password === this.state.passwordConfirm)
                await this.props.userSignup(this.state.firstName, this.state.lastName, this.state.email, this.state.password)
                if(this.props.signUpError) {
                    this.setState({errorMessage:this.props.signUpError})
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
                <div className='registerPage'>
                    <form onSubmit={this.handleSubmit} className="form">
                        <table className='registerTable'>
                            <thead>
                            <tr><td colSpan={2}><h1 className="registerTitle">REGISTRATION</h1></td></tr>
                            </thead>
                            <tbody>
                                <tr><td className="TextField">First Name:</td><td className="inputFieldR"><input type="text" className="firstName" onChange={this.changeFirstName} /></td></tr>
                                <tr><td className="TextField">Last Name:</td><td className="inputFieldR"><input type="text" className="lastName"  onChange={this.changeLastName}></input></td></tr>
                                <tr><td className="TextField">Email:</td><td className="inputFieldR"><input type="text" className="email"  onChange={this.changeEmail}></input></td></tr>
                                <tr><td className="TextField">Password:</td><td className="inputFieldR"><input type="password" className="Password" id="password" onChange={this.changePassword}></input></td></tr>
                                <tr><td className="TextField">Confirm password:</td><td className="inputFieldR"><input type="password" className="confirmPassword" id="confirmPassword" onChange={this.changePasswordConfirm}></input></td></tr>
                                <tr><td colSpan={2} className="showPassword"><input type="checkbox" className="showPassCheck"id='show-password' onClick={this.showPass}></input><label for='show-password'>Show Password</label></td></tr>
                                <tr><td className="TextField">{this.state.errorMessage}</td></tr>
                                <tr><td colSpan={2}><button className="registerButton">Register</button></td></tr>
                                <tr></tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                {/* Name (first name, last name), Email (as username), Password (ability to hide the password), Confirm password */}
            </div>
        )
    }
}

export default RegisterTable