import axios from 'axios';

// Action Types
const B_REG = "B_REG";
const B_JOIN = "B_JOIN";
const B_GET = "B_GET";

const ERROR = "ERROR";
const LOGOUT = "LOGOUT";
// Action Creator
const bRegister = (result) => {
    return {
        type: B_REG,
        payload: {
            BRResult: result
        }
    }
}

const bJoin = (result) => {
    return {
        type: B_JOIN,
        payload: {
            BJResult: result
        }
    }
}

const bGet = (businesses) => {
    return {
        type: B_GET,
        payload: {
            Businesses: businesses
        }
    }
}

const bRegErrorCatch = (err) => {
    return {
        type: ERROR,
        payload: {
            BRegError: err
        }
    }
}

const bJoinErrorCatch = (err) => {
    return {
        type: ERROR,
        payload: {
            BJoinError: err
        }
    }
}

const bGetErrorCatch = (err) => {
    return {
        type: ERROR,
        payload: {
            BGetError: err
        }
    }
}

const userLogout = () => {
    return {
        type: LOGOUT
    }
}
// Thunks
export const bRegisterThunk = (bname, baddress, email, businesspass) => async (dispatch) => {
    try {
        await axios.post(`https://c-vivid-backend.herokuapp.com/businessRegister`, {
            businessname: bname,
            businessaddr: baddress,
            email: email,
            businesspass: businesspass
        })
        .then(res => {
            console.log("Response from Business Register",res);
            dispatch(bRegister(res));
        })
        .catch(err => {
            console.log("Error from Business Register",err)
            dispatch(bRegErrorCatch(err.response.data));
            
        })
    }
    catch (fetchError) {
        dispatch(bRegErrorCatch(fetchError))
    }
}

export const bJoinThunk = (email,businessid,businesspass) => async (dispatch) => {
    try {
        await axios.post(`https://c-vivid-backend.herokuapp.com/businessJoin`, {
            email: email,
            business_id: businessid,
            businesspass: businesspass,
            role: "Employee"
        })
        .then(res => {
            console.log("Response from Business join",res.data);
            dispatch(bJoin(res.data));
        })
        .catch(err => {
            console.log("Error from Business Join",err)
            dispatch(bJoinErrorCatch(err.response.data));
            
        })
    }
    catch (fetchError) {
        dispatch(bJoinErrorCatch(fetchError))
    }
}

export const bGetThunk = (email,token) => async (dispatch) => {
    try {
        await axios.post(`https://c-vivid-backend.herokuapp.com/getBusinessData`, {
            email: email,
            token: token
        })
        .then(res => {
            console.log("Response from Business Get",res.data);
            dispatch(bGet(res.data));
        })
        .catch(err => {
            console.log("Error from Business Get",err)
            dispatch(bGetErrorCatch(err.response.data));
            
        })
    }
    catch (fetchError) {
        dispatch(bGetErrorCatch(fetchError))
    }
}

export const bUserLogoutThunk = () => async (dispatch) => {
    dispatch(userLogout())
}
// Reducer Function
export default (state = {},action) => {
    switch(action.type){
        case B_GET:
            return action.payload;
        case B_JOIN:
            return action.payload;
        case B_REG:
            return action.payload;
        case LOGOUT:
            return {}
        case ERROR:
            return action.payload;
        default:
            return state;
    }
}