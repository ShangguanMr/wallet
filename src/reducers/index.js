import {combineReducers} from 'redux';
import me from "../reducers/me/me";
import wallet from "../reducers/wallet/wallet";
import currency from "../reducers/currency/currency";

const rootReducer = combineReducers({
    me,
    wallet,
    currency,
});
export default rootReducer;
