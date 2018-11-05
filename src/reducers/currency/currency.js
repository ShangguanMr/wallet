let initialState = {
    listFocus: [],
    listNoFocus: []
};

export default function currency(state = initialState, action) {
    switch (action.type) {
        case "deleteCurrency":
            return Object.assign({}, state, {
                listFocus: action.listFocus,
                listNoFocus: action.listNoFocus
            });
        case "addCurrency":
            return Object.assign({}, state, {
                listFocus: action.listFocus,
                listNoFocus: action.listNoFocus
            });
        default:
            return state;
    }
}
