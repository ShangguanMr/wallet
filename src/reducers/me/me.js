
let initialState = {
    ETHdata: {result:""},
    init: true,

};

export default function me(state = initialState, action) {
    switch (action.type) {
        case "getETHAddressSuccess":
            return Object.assign({}, state, {
                ETHdata:action.data,
                init:false
            });
        default:
            return state;
    }
}