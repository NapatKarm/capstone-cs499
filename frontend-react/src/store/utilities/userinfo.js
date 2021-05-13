import axios from 'axios';
import {Endpoint} from '../../components/Endpoint';
import socket from '../../components/socket'; 

// Action Types
const USER_SIGNUP = "USER_SIGNUP";
const USER_LOGIN = "USER_LOGIN";
const USER_LOGOUT = "USER_LOGOUT";

const ERROR = "Error";

// Action Creator
const userSignup = (result) => {
    return {
        type: USER_SIGNUP,
        payload: {
            SignupResult: result
        }
    }
}

const userLogin = (userinfo) => {
    return {
        type: USER_LOGIN,
        payload: {
            UserData: userinfo
        }
    }
}

const userLogout = () => {
    return {
        type: USER_LOGOUT
    }
}

const errorCatch = (err) => {
    return {
        type: ERROR,
        payload: {
            ErrorInfo: err
        }
    }
}

const signUpErrorCatch = (err) => {
    return {
        type: ERROR,
        payload: {
            signUpError: err
        }
    }
}

const logInErrorCatch = (err) => {
    return {
        type: ERROR,
        payload: {
            logInError: err
        }
    }
}

// Thunks
export const userSignupThunk = (firstName, lastName, email, password) => async (dispatch) => {
    try {
        // This is we will send sign up info to the backend and wait for response
        await axios.post(`${Endpoint}/signup`, {
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password
        })
        .then(res => {
            console.log("Response from signup",res);
            dispatch(userSignup(res));
        })
        .catch(err => {
            console.log("Error from signup",err)
            if(err.response) dispatch(signUpErrorCatch(err.response.data));
            else dispatch(signUpErrorCatch(err.message))
            
        })
    }
    catch (fetchError) {
        dispatch(signUpErrorCatch(fetchError))
    }
}

export const userLoginThunk = (email,password) => async (dispatch) => {
    try {
        // This is we will send log in info to the backend and wait for response
        await axios.post(`${Endpoint}/signin`, {
            email: email,
            password: password
        })
        .then(res => {
            console.log("Response from login",res);
            socket.emit('userInit', { email:email })
            dispatch(userLogin(res.data));
        })
        .catch(err => {
            console.log("Error from login",err)
            if(err.response) dispatch(logInErrorCatch(err.response.data));
            else dispatch(logInErrorCatch(err.message))
            
        })
    }
    catch (fetchError) {
        dispatch(logInErrorCatch(fetchError))
    }
}

export const userLogoutThunk = () => async (dispatch) => {
    try {
        // This is where we will tell the backend that someone has logged out, this will be implemented with cookies
        // Though for the frontend this is to wipe data from previous user
        dispatch(userLogout())
    }
    catch (fetchError) {
        dispatch(errorCatch(fetchError))
    }
}

// Reducer Function
const userinfo = (state = {},action) => {
    switch(action.type){
        case USER_SIGNUP:
            return action.payload;
        case USER_LOGIN:
            return action.payload;
        case USER_LOGOUT:
            return {};
        case ERROR:
            return action.payload;
        default:
            return state;
    }
}

export default userinfo;