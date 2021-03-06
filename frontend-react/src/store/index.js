import { combineReducers, applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// Reducer functions
import userinfo from "./utilities/userinfo";
import businessinfo from './utilities/businessinfo'
import businessdetails from './utilities/businessdetails'

const rootReducer = combineReducers({userinfo,businessinfo,businessdetails});
const logger = createLogger({ collapsed: true });
const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware, logger));
const store = createStore(rootReducer, middleware);

export default store;