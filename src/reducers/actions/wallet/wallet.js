import {API_CONFIG} from "../../../services/api";
import {xFetch} from "../../../utils/xfetch";

export function getWallet(params) {
    return dispatch => {
        let url = API_CONFIG.host_first + "/db/api/getByHex";
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            dispatch({type: "getWalletInfoSuccess", data: res});
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch({type: "getWalletInfoError", msg: err});//或者全局去处理错误；
            return Promise.reject(err);
        })
    }
}


export function getLastBlock(params) {
    return dispatch => {
        let url = API_CONFIG.host_first + "/block/api/last";
        console.log(url);
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            dispatch(getLastBlockSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(getLastBlockError(err));//或者全局去处理错误；
            return Promise.reject(err);
        })
    }
}

function getLastBlockSuccess(data) {
    return {
        type: "getLastBlockSuccess",
        data: data
    }
}

function getLastBlockError(err) {
    return {
        type: "getLastBlockError",
        data: err
    }
}

export function getBlocks(params) {
    return dispatch => {
        let url = API_CONFIG.host_first + "/block/api/getHeaderByHeight";
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            dispatch(getBlocksSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(getBlocksError(err));//或者全局去处理错误；
            return Promise.reject(err);
        })
    }
}

function getBlocksSuccess(data) {
    return {
        type: "getBlocksSuccess",
        data: data
    }
}

function getBlocksError(err) {
    return {
        type: "getBlocksError",
        data: err
    }
}

export function transactionDetails(params) {
    return dispatch => {
        let url = API_CONFIG.host_first + "/transaction/api/newTransaction";
        console.log(url);
        return xFetch(url, {
            method: "POST",
            body: params
        }).then((res) => {
            dispatch(transactionDetailsSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(transactionDetailsError(err));
            return Promise.reject(err);
        })
    }
}

function transactionDetailsSuccess(data) {
    return {
        type: "transactionDetailsSuccess",
        data: data
    }
}

function transactionDetailsError(err) {
    return {
        type: "transactionDetailsError",
        data: err
    }
}