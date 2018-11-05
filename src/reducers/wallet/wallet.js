let initialState = {
    data: {sons: [{hash: "", pathValue: ""}], leaf: "", root: "", pathValue: ""},
    useData: {result: {account: "", address: "", nonce: 1,}},//用户信息
    itemDetails: {result: {}},//每种类型的币的交易记录详细
    transactionData: {},//交易返回数据
    EKTPriceData : {},//EKT币价返回数据
    lastBlockData: {
        result: {
            height: "",
            timestamp: "",
            nonce: "",
            fee: "",
            totalFee: "",
            previousHash: "",
            currentHash: "",
            signature: "",
            body: "",
            round: {
                currentIndex: "",
                peers: [{peerId: "", address: "", port: "", addressVersion: "", accountAddress: ""}]
            },
            statRoot: "",
            txRoot: "",
            tokenRoot: ""
        }
    },
    blockData: {
        height: "",
        timestamp: "",
        nonce: "",
        fee: "",
        totalFee: "",
        previousHash: "",
        currentHash: "",
        signature: "",
        body: "",
        round: {
            currentIndex: "",
            peers: [{peerId: "", address: "", port: "", addressVersion: "", accountAddress: ""}]
        },
        statRoot: "",
        txRoot: "",
        tokenRoot: ""
    },
    readyBlockListData: {
        result: [
            {
                EventType: "",
                from: "",
                to: "",
                time: "",
                amount: "",
                fee: "",
                nonce: "",
                data: "",
                tokenAddress: "",
                sign: ""
            }]
    },
    BlockListData: {
        result: [
            {
                EventType: "",
                from: "",
                to: "",
                time: "",
                amount: "",
                fee: "",
                nonce: "",
                data: "",
                tokenAddress: "",
                sign: ""
            }]
    },
    init: true,
    isRefreshing: true

};

export default function wallet(state = initialState, action) {
    switch (action.type) {
        case "getWalletInfoSuccess":
            return Object.assign({}, state, {
                data: action.data,
                init: false,
                isRefreshing: false
            });
        case "getLastBlockSuccess":
            return Object.assign({}, state, {
                lastBlockData: action.data,
                init: false,
                isRefreshing: false
            });
        case "getLastBlockError":
            return Object.assign({}, state, {
                lastBlockData: initialState.lastBlockData,
                init: false,
                isRefreshing: false
            });

        case "getBlocksSuccess":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        case "getBlocksError":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        case "readyTransactionListSuccess":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        case "readyTransactionListError":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        case "blockTransactionListSuccess":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        case "blockTransactionListError":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        case "getUserInfoError":
            return Object.assign({}, state, {
                init: false,
                isRefreshing: false,
            });
        case "getUserInfoSuccess":
            return Object.assign({}, state, {
                init: false,
                useData: action.data,
                isRefreshing: false
            });
        case "getItemDetailsSuccess":
            return Object.assign({}, state, {
                init: false,
                itemDetails: action.data,
            });
        case "transactionDetailsSuccess":
            return Object.assign({}, state, {
                init: false,
                transactionData: action.data
            });
        case "transactionDetailsError":
            return Object.assign({}, state, {
                init: false,
            });
        case "getEKTPriceSuccess" :
            return Object.assign({}, state, {
                init: false,
                EKTPriceData: action.data
            });
        case "getEKTPriceError" :
            return Object.assign({}, state, {
                init: false,
            });
        default:
            return state;
    }
}
