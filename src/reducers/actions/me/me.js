import {API_CONFIG} from "../../../services/api";
import {xFetch} from "../../../utils/xfetch";
export function getETHAddress(params) {
    return dispatch => {
        let url = API_CONFIG.ekt_host + "/address/api/getETHAddress";
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            console.log("请求ETH address成功==>>>", res);
            dispatch({type: "getETHAddressSuccess", data: res});
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch({type: "getETHAddressError", msg: err});
            console.log("请求ETH address失败==>>>", err);
            return Promise.reject(err);
        })
    }
}
