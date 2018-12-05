import {
    getLastBlock,
    getWallet,
    getBlocks,
} from "../reducers/actions/wallet/wallet";
import {getStorage, useStar, resetData, dateTrans, setStorage, removeStorage} from "../utils/common_utils";


let heights = [];
let txList = [];

export const filterArray = (arr = []) => {
    let res = arr.filter((element, index, self) => {
        return self.indexOf(element) === index;
    });
    return res
}
export const fromHashGetValue = async (hash) => {
    let value = "";
    if (!!hash) {
        value = await global.store.dispatch(getWallet({"hash": hash}));
        return value
    } else {
        return value
    }
}
export const getLeafhash = async (hash, address) => {
    let str_address = "";
    let path_hash = "";
    let result = await fromHashGetValue(hash);
    if (result['sons'] && result['sons'].length > 0) {
        if (result['leaf'] === true) {
            return result['sons'][0]['hash'];
        } else {
            result['sons'].map((item, index) => {
                if (address.indexOf(item['pathValue']) > -1) {
                    let addressArr = address.split('');
                    let itemArr = item['pathValue'].split('');
                    let isAddressSub = true;
                    for (let i = 0; i < itemArr.length; i++) {
                        if (addressArr[i] !== itemArr[i]) {
                            isAddressSub = false;
                            break;
                        }
                    }
                    if (isAddressSub) {
                        str_address = address.substr(item['pathValue'].length);
                        path_hash = item['hash'];
                    }
                }
            });
            return getLeafhash(path_hash, str_address)
        }
    } else {
        return ""
    }

}

export const fromHeightSearch = async (height, address) => {
    let height_res = await fromHeighGetValue(height);
    let txRoot = height_res['txRoot'];
    let tx_res = await fromHashGetValue(txRoot);
    if (tx_res['sons'] && tx_res['sons'].length > 0) {
        let list = [];
        let tx_item = "";
        let tx_details = "";
        let item_leaf_hash = await getLeafhash(tx_res['sons'][0]['hash'], address);
        if (!!item_leaf_hash) {
            tx_item = await fromHashGetValue(item_leaf_hash);
            if (!!tx_item) {
                list.push(tx_item);
            }
        }
        if (!!list && list.length > 0) {
            tx_details = await fromHashGetValue(list[0]['txId']);
            if ((tx_details['from'] === address || tx_details['to'] === address) && tx_details['EventType'] === 'transaction') {
                tx_details['success'] = list[0]['success'];
                tx_details['txId'] = list[0]['txId'];
                txList.push(tx_details);
            }
        }
    }
    return txList;
}

export const NewfromHeightSearch = async (height, address) => {
    let res = await fromHeighGetValue(height);
    let receiptHash = res['receiptHash'];
    let timestamp = res['timestamp'];
    let receipt_res = await fromHashGetValue(receiptHash);
    if (receipt_res && receipt_res.length > 0) {
        receipt_res.map(async (items)=>{
            if (items['success']) {
                if (items['subTransactions'] && items['subTransactions'].length > 0) {
                    items['subTransactions'].map((item) => {
                        if (item['from'] === address || item['to'] === address) {
                            item['success'] = items['success'];
                            item['fee'] = items['fee'];
                            item['time'] = timestamp;
                            item['txId'] = items['txId'];
                            txList.push(item);
                        }
                    })
                }
            } else {
                //失败的按一个交易记录展示；
                let failHash = items['txId'];
                let failList = await fromHashGetValue(failHash);
                if (failList['from'] === address || failList['to'] === address) {
                    failList['success'] = items['success'];
                    failList['txId'] = failHash;
                    txList.push(failList);
                }
            }
        })
    }
    return txList;
}
export const fromHeighGetValue = async (height, key) => {
    let value = await global.store.dispatch(getBlocks({"height": height})).then((res) => {
        if (!!res['result']) {
            if (key) return res['result'][key];
            return res['result'];
        }
        return ""
    });
    return value
}

export const compareObj = (result1, result2) => {
    if (result1 === null && result2 === null) {
        return true
    } else {
        let result1key = [];
        let result1value = [];
        for (let keylow in result1) {
            result1key.push(keylow);
            result1value.push(result1[keylow]);
        }
        let result2key = [];
        let result2value = [];
        for (let keyhigh in result2) {
            result2key.push(keyhigh);
            result2value.push(result2[keyhigh]);
        }
        let result1have = [];
        if (result1key.length === result2key.length) {
            for (let k = 0; k < result1key.length; k++) {
                result1have.push[false];
            }
            for (let i = 0; i < result1key.length; i++) {
                for (let j = 0; j < result2key.length; j++) {
                    if (result1key[i] === result2key[j] && result1value[i] === result2value[j]) {
                        result1have[i] = true;
                    }
                }
            }
            for (let m = 0; m < result1have.length; m++) {
                if (result1have === false) {
                    return false;
                }
            }
            return true;
        } else {
            return false
        }
    }
}
export const halfHeightSearch = async (low, high, address) => {
    let midHeight = Math.floor((low + high) / 2);
    let high_statRoot = await fromHeighGetValue(high, "statRoot");
    let highresult = "";
    if (!!high_statRoot) {
        let highleafhash = await getLeafhash(high_statRoot, address);
        if (!!highleafhash) {
            highresult = await fromHashGetValue(highleafhash);
        }
    }
    let midresult = "";
    let mid_statRoot = await fromHeighGetValue(midHeight, "statRoot");
    if (!!mid_statRoot) {
        let midleafhash = await getLeafhash(mid_statRoot, address);
        if (!!midleafhash) {
            midresult = await fromHashGetValue(midleafhash);
        }
    }
    let lowresult = "";
    let low_statRoot = await fromHeighGetValue(low, "statRoot");
    if (!!low_statRoot) {
        let lowleafhash = await getLeafhash(low_statRoot, address);
        if (!!lowleafhash) {
            lowresult = await fromHashGetValue(lowleafhash);
        }
    }
    if ((lowresult['amount'] === midresult['amount'] && lowresult['nonce'] === midresult['nonce'] && compareObj(lowresult['balances'], midresult['balances']) && lowresult['gas'] === midresult['gas']) && (midresult['amount'] === highresult['amount'] && midresult['nonce'] === highresult['nonce'] && compareObj(midresult['balances'], highresult['balances']) && midresult['gas'] === highresult['gas'])) {
        heights.push(low);
        return heights;
    } else if ((lowresult['amount'] !== midresult['amount'] || lowresult['nonce'] !== midresult['nonce'] || !compareObj(lowresult['balances'], midresult['balances']) || lowresult['gas'] !== midresult['gas']) && (midresult['amount'] !== highresult['amount'] || midresult['nonce'] !== highresult['nonce'] || !compareObj(midresult['balances'], highresult['balances']) || midresult['gas'] !== highresult['gas'])) {
        await Promise.all([halfHeightSearch(low, midHeight, address), halfHeightSearch(midHeight + 1, high, address)]);
    } else if ((lowresult['amount'] === midresult['amount'] && lowresult['nonce'] === midresult['nonce'] && compareObj(lowresult['balances'], midresult['balances']) && lowresult['gas'] === midresult['gas']) && (midresult['amount'] !== highresult['amount'] || midresult['nonce'] !== highresult['nonce'] || !compareObj(midresult['balances'], highresult['balances']) || midresult['gas'] !== highresult['gas'])) {
        await halfHeightSearch(midHeight + 1, high, address);
    } else if ((lowresult['amount'] !== midresult['amount'] || lowresult['nonce'] !== midresult['nonce'] || !compareObj(lowresult['balances'], midresult['balances']) || lowresult['gas'] !== midresult['gas']) && (midresult['amount'] === highresult['amount'] && midresult['nonce'] === highresult['nonce']) && compareObj(midresult['balances'], highresult['balances']) && midresult['gas'] === highresult['gas']) {
        await halfHeightSearch(low, midHeight, address)
    }
}
export const getTransactionList = async () => {
    let preHeight = await getStorage('height') || 0;
    let preData = await getStorage('resData') || [];
    let address = await getStorage('address');
    let {height, statRoot} = await global.store.dispatch(getLastBlock()).then((res) => {
        return res['result']
    }).catch((err) => {

    });
    let leafhash = await getLeafhash(statRoot, address);
    setStorage('height', height);
    if (!!leafhash) {
        await halfHeightSearch(preHeight, height, address);
        if (heights.length > 0) {
            let ress;
            let no_repeat_height = filterArray(heights);
            no_repeat_height.map(async (item, index) => {
                ress = await NewfromHeightSearch(item, address);
                if (index === (no_repeat_height.length - 1)) {
                    let data = ress.concat(preData);
                    setStorage("resData", data);
                    setStorage("txData", []);
                    heights = [];
                    txList = [];
                }
            });
        }
    } else {
        setStorage('resData', [])
        heights = [];
        txList = [];
    }
}