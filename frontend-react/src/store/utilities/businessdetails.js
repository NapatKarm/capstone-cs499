
// Action Types
const B_VIEW = "B_VIEW";
const B_CLEAR = "B_CLEAR";

// Action Creator
const bView = (result) => {
    return {
        type: B_VIEW,
        payload: {
            bDetails: result
        }
    }
}

const bClear = () => {
    return {
        type: B_CLEAR
    }
}

// Thunks
export const bViewThunk = (business) => async (dispatch) => {
    dispatch(bView(business))
}

export const bClearThunk = () => async (dispatch) => {
    dispatch(bClear())
}
// Reducer Function
const businessdetails = (state = {},action) => {
    switch(action.type){
        case B_VIEW:
            return action.payload;
        case B_CLEAR:
            return {}
        default:
            return state;
    }
}

export default businessdetails;