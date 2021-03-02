 const FakeSignup = (firstName, lastName, email, password) => {
     console.log("Received SignUp Info",firstName, lastName, email, password);
     return "Successfully signed up";
 }

 const FakeLogin = (email,password) => {
     console.log("Received Login Info",email,password);
     let UserData = {
         email: email,
         grouplist: [
             {
                 groupname: "TEST1",
                 groupid: "vxwa6t",
                 groupmembers: [
                     {
                         email: email,
                         role: 'Admin'
                     },
                     {
                         email: "Monkey@gmail.com",
                         role: 'Worker'
                     },
                     {
                         email: "Chicken@aol.com",
                         role: 'Worker'
                     }
                 ]
             },
             {
                groupname: "EXAMPLE4",
                groupid: "ICUPLO",
                groupmembers: [
                    {
                        email: email,
                        role: 'Worker'
                    },
                    {
                        email: "Smurf@aol.com",
                        role: 'Worker'
                    },
                    {
                        email: "Thrower@gmail.com",
                        role: 'Admin'
                    }
                ]
            }
         ]
     }
     return UserData
 }


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


// Thunks
export const userSignupThunk = (firstName, lastName, email, password) => async (dispatch) => {
    let res
    try {
        // This is we will send sign up info to the backend and wait for response
        res = await FakeSignup(firstName, lastName, email, password)
        dispatch(userSignup(res))
    }
    catch (fetchError) {
        dispatch(errorCatch(fetchError))
    }
}

export const userLoginThunk = (email,password) => async (dispatch) => {
    let res
    try {
        // This is we will send log in info to the backend and wait for response
        res = await FakeLogin(email,password)
        dispatch(userLogin(res))
    }
    catch (fetchError) {
        dispatch(errorCatch(fetchError))
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
export default (state = {},action) => {
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