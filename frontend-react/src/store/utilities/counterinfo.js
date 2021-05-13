// Action Types
const C_UPDATE = "C_UPDATE";
const C_WIPE = "C_WIPE";

// Action Creator
const cUpdate = (result) => {
    return {
        type: C_UPDATE,
        payload: {
            cInfo: result
        }
    }
}

const cWipe = () => {
    return {
        type: C_WIPE,
    }
}

// Thunks
export const cUpdateThunk = (cInfo) => (dispatch) => {
    dispatch(cUpdate(cInfo))
}

export const cWipeThunk = () => (dispatch) => {
    dispatch(cWipe())
}

// Reducer Function
const counterinfo = (state = {},action) => {
    switch(action.type){
        case C_UPDATE:
            return action.payload;
        case C_WIPE:
            return {}
        default:
            return state;
    }
}
export default counterinfo;