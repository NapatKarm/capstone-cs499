import React, { Component } from 'react';
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
        submit.preventDefault()
        console.log(this.state.email, validator.isEmail(this.state.email), this.state.password)
        if(validator.isEmail(this.state.email)) {
            console.log("Email validated!")
            await this.props.userLogin(this.state.email, this.state.password)
            if(this.props.logInError) {
                this.setState({
                    errorMessage: this.props.logInError
                })
            }
        } else {
            this.setState({errorMessage: "Please enter a valid Email"})
        }
    }

    render() {
        return (
            <div>
                <div className='loginTable'>
                    <form onSubmit={this.handleSubmit} className="form">
                        <table className='loginTable'>
                            <thead>
                            <tr><td colSpan={2}><h1 className="loginTitle">LOG IN</h1></td></tr>
                            </thead>
                            <tbody>
                                <tr><td className="TextField">Email:</td><td className="inputFieldR"><input type="text" className="email"  id="Email" onChange={this.changeEmail}></input></td></tr>
                                <tr><td className="TextField">Password:</td><td className="inputFieldR"><input type="password" className="Password" id="password" onChange={this.changePassword}></input></td></tr>
                                <tr><td colSpan={2} className="showPassword"><input type="checkbox" className="showPassCheck"id='show-password' onClick={this.showPass}></input><label htmlFor='show-password'>Show Password</label></td></tr>
                                <tr><td className="TextField">{this.state.errorMessage}</td></tr>
                                <tr><td colSpan={2}><button className="loginButton">Log In</button></td></tr>
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

export default LoginTable