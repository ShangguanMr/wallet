import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    FlatList,
    TouchableHighlight,
} from 'react-native';
import {width, height, getStorage, setStorage, getNetWorkState,isIos, isIphoneX} from "../../utils/common_utils";
import {connect} from "react-redux";
import {
    getLastBlock,
    getWallet,
    getEKTPrice
} from "../../reducers/actions/wallet/wallet";
import LoadingView from '../../components/loading'
import {toastShort} from '../../utils/ToastUtil';

const topbg = require('../../assets/img/topbg.jpg');
const bgadd = require('../../assets/img/addh.png');
const logoEKT = require('../../assets/img/logoEKT.png');
let gasToken = '';
const initData = [{
    icon: logoEKT,
    name: 'EKT',
    status: true,
    number: 0,
    price: 0,
    pricision: 8,
    tokenAddress: ''
},
];

class wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addressEKT: '',
            allmoney: 0,
            dataList: [
                {
                    icon: logoEKT,
                    name: 'EKT',
                    status: true,
                    number: 0,
                    price: 0,
                }
            ],
            dataRequest: [],
            showLoading: true,
            isRefreshing: true,
        }
    }

    componentWillMount() {
    }

    async fromHashGetValue(hash) {
        let value = "";
        if (!!hash) {
            const {dispatch} = this.props;
            value = await dispatch(getWallet({"hash": hash}));
            return value
        } else {
            return value

        }
    }

    async getLeafhash(hash, address) {
        let that = this;
        let str_address = "";
        let path_hash = "";
        let result = await this.fromHashGetValue(hash);
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
                                break
                            }
                        }
                        if (isAddressSub) {
                            str_address = address.substr(item['pathValue'].length);
                            path_hash = item['hash'];
                        }
                    }
                });
                return that.getLeafhash(path_hash, str_address)
            }
        } else {
            return ""
        }

    }

    componentWillReceiveProps(nextProps) {
        let that = this;
        if (nextProps.listFocus.length !== this.props.listFocus.length || nextProps.listFocus !== this.props.listFocus) {
            let list = nextProps.listFocus.concat(nextProps.listNoFocus);
            let dataList = that.changeDataList(list, that.state.dataList)
            this.setState({
                dataList: dataList,
                isRefreshing: false,
            })
        }
    }

    async componentDidMount() {
        let that = this;
        let params = {};
        const {dispatch} = this.props;
        let address = await getStorage("address") || '';
        let listFocus = await getStorage('listFocus') || [];
        let listNoFocus = await getStorage('listNoFocus') || [];
        let newData = listFocus.concat(listNoFocus);
        params['address'] = address;
        let isConnected = await getNetWorkState();
        if (isConnected) {
            let {height, totalFee, statRoot} = await dispatch(getLastBlock()).then((res) => {
                return res['result']
            }).catch((err) => {
                that.setState({showLoading: false, isRefreshing: false})
            });
            let EKTPrice = await dispatch(getEKTPrice()).then((res) => {
                return res['result']['price']
            }).catch((err) => {
                that.setState({showLoading: false, isRefreshing: false})
            })
            setStorage('EKTPrice', EKTPrice||0);
            let leafhash = await this.getLeafhash(statRoot, address);

            if (!!leafhash) {
                let result = await this.fromHashGetValue(leafhash);
                let tokenType = [];
                let indexData = [];
                setStorage('nonce', result['nonce']);
                setStorage('EKTnumber', Math.floor(result['amount'] / Math.pow(10, 8) * 10000) / 10000);
                if (!!result['balances']) {
                    for (let key in result['balances']) {
                        let value = await this.fromHashGetValue(key) || {};
                        value['tokenAddress'] = key;
                        value['currentNum'] = result['balances'][key];
                        tokenType.push(value);
                    }
                }
                indexData.push({
                    icon: logoEKT,
                    name: 'EKT',
                    status: true,
                    number: Math.floor(result['amount'] / Math.pow(10, 8) * 10000) / 10000,
                    price: Math.floor(EKTPrice * result['amount'] / (Math.pow(10, 8)) * 100) / 100,
                    pricision: 8,
                    tokenAddress: ''
                })
                let allmoney = Math.floor(EKTPrice * result['amount'] / (Math.pow(10, 8)) * 100) / 100;
                tokenType.map((item) => {
                    indexData.push({
                        icon: logoEKT,
                        name: item['symbol'],
                        status: true,
                        number: Math.floor(item['currentNum'] / Math.pow(10, item['decimals']) * 10000) / 10000,
                        price: 0,
                        pricision: item['decimals'],
                        tokenAddress: item.tokenAddress,
                    })
                });
                setStorage('allmoney', allmoney);
                setStorage('indexData', indexData);

                that.setState({
                    dataList: (listFocus.length > 0 || listNoFocus.length > 0) ?
                        that.changeDataList(newData, indexData) : indexData,
                    showLoading: false,
                    isRefreshing: false,
                    allmoney: allmoney
                })
            } else {
                let indexData = initData;
                setStorage('nonce', 0);
                setStorage('EKTnumber', 0);
                setStorage('indexData', indexData);
                setStorage('EKTPrice', 0);
                setStorage('allmoney', 0);
                that.setState({
                    dataList: (listFocus && listFocus.length > 0) ?
                        that.changeDataList(newData, indexData) : indexData,
                    showLoading: false,
                    isRefreshing: false,
                    allmoney: 0
                })
            }
        } else {
            let indexData = await getStorage('indexData') || initData;
            let allmoney = await getStorage('allmoney') || 0;
            that.setState({
                dataList: (listFocus.length > 0 || listNoFocus.length > 0) ?
                    that.changeDataList(newData, indexData) : indexData,
                showLoading: false,
                isRefreshing: false,
                allmoney: allmoney
            })
        }
    }

    changeDataList = (newData, indexData) => {
        let datahave = new Array(newData.length);
        for (let m = 0; m < datahave.length; m++) {
            datahave[m] = 0;
        }

        newData.map((item, index) => {
            for (let i = 0; i < indexData.length; i++) {
                if (indexData[i].name === item.name) {
                    indexData[i].status = item.status;
                    datahave[index] = 1;
                }
            }
        })

        for (let j = 0; j < datahave.length; j++) {
            if (datahave[j] !== 1) {
                indexData.push({
                    icon: logoEKT,
                    name: newData[j].name,
                    status: newData[j].status,
                    number: 0,
                    price: 0,
                    tokenAddress: '',
                    pricision: 0
                })
            }
        }
        return indexData
    }

    pressTo = () => {
        const {navigate} = this.props.nav;
        navigate('CurrencyList', {
            headerTitle: '显示币种',
        })
    };

    pressToDetail = (item) => {
        const {navigate, state} = this.props.nav;
        navigate('AssetDetails', {
            headerTitle: item.name,
            token: item.name,
            tokenTotalNum: item.number,
            tokenTotalPrice: item.price,
            pricision: item.pricision,
            tokenAddress: item.tokenAddress,
            addressEKT: state.params.addressEKT,
            privkey: state.params.privkey,
            callback: () => {
                this._onRefresh();
            }
        })
    };

    async _onRefresh() {
        let that = this;
        let params = {};
        const {dispatch} = that.props;
        let address = await getStorage("address") || '';
        let listFocus = await getStorage('listFocus') || [];
        let listNoFocus = await getStorage('listNoFocus') || [];
        let newData = listFocus.concat(listNoFocus);
        params['address'] = address;
        let isConnected = await getNetWorkState();
        if (isConnected) {
            let {height, totalFee, statRoot} = await dispatch(getLastBlock()).then((res) => {
                return res['result']
            }).catch((err) => {
                that.setState({showLoading: false, isRefreshing: false})
            });
            let EKTPrice = await dispatch(getEKTPrice()).then((res) => {
                return res['result']['price']
            }).catch((err) => {
                that.setState({showLoading: false, isRefreshing: false})
            })
            setStorage('EKTPrice', EKTPrice||0);
            let leafhash = await that.getLeafhash(statRoot, address);
            if (!!leafhash) {
                let result = await that.fromHashGetValue(leafhash);
                setStorage('nonce', result['nonce']);
                let tokenType = [];
                if (!!result['balances']) {
                    for (let key in result['balances']) {
                        let value = await that.fromHashGetValue(key);
                        value['tokenAddress'] = key;
                        value['currentNum'] = result['balances'][key];
                        tokenType.push(value);
                    }
                }
                let indexData = [];
                indexData.push({
                    icon: logoEKT,
                    name: 'EKT',
                    status: true,
                    number: Math.floor(result['amount'] / Math.pow(10, 8) * 10000) / 10000,
                    price: Math.floor(EKTPrice * result['amount'] / (Math.pow(10, 8)) * 100) / 100,
                    pricision: 8,
                    tokenAddress: ''
                });
                let allmoney = Math.floor(EKTPrice * result['amount'] / (Math.pow(10, 8)) * 100) / 100;
                tokenType.map((item) => {
                    indexData.push({
                        icon: logoEKT,
                        name: item.symbol,
                        status: true,
                        number: Math.floor(item['currentNum'] / Math.pow(10, item['decimals']) * 10000) / 10000,
                        price: 0,
                        pricision: item['decimals'],
                        tokenAddress: item.tokenAddress,
                    })
                });
                setStorage('indexData', indexData);
                setStorage('EKTnumber', Math.floor(result['amount'] / Math.pow(10, 8) * 10000) / 10000);
                setStorage('allmoney', allmoney);
                that.setState({
                    dataList: (listFocus && listFocus.length > 0) ?
                        that.changeDataList(newData, indexData) : indexData,
                    showLoading: false,
                    isRefreshing: false,
                    allmoney: allmoney
                })
            } else {
                let indexData = initData;
                setStorage('nonce', 0);
                setStorage('EKTnumber', 0);
                setStorage('indexData', indexData);
                setStorage('EKTPrice', 0);
                setStorage('allmoney', 0);
                that.setState({
                    dataList: (listFocus && listFocus.length > 0) ?
                        that.changeDataList(newData, indexData) : indexData,
                    showLoading: false,
                    isRefreshing: false,
                    allmoney: 0
                })
            }
        } else {
            let indexData = await getStorage('indexData') || initData;
            let allmoney = await getStorage('allmoney') || 0;
            that.setState({
                dataList: (listFocus && listFocus.length > 0) ?
                    that.changeDataList(newData, indexData) : indexData,
                showLoading: false,
                isRefreshing: false,
                allmoney: allmoney
            })
        }
    }

    _renderItem = ({item}) => (
        item.status ?
            <TouchableHighlight
                style={{
                    width: width,
                    paddingLeft: 16,
                    paddingRight: 17
                }}
                onPress={() => this.pressToDetail(item)}
                underlayColor='#ffffff'>
                <View style={{
                    flexDirection: 'row',
                    height: 75,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomColor: "#ddd",
                    borderBottomWidth: 1
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{
                            height: 40,
                            width: 40,
                            backgroundColor: '#ffffff',
                            borderWidth: 1,
                            borderColor: '#dddddd',
                            borderRadius: 20
                        }} source={item.icon}/>
                        <Text
                            style={{
                                marginLeft: 10,
                                fontSize: 16,
                                color: '#231815',
                                fontFamily: 'PingFangSC-Medium',
                            }}>{item.name}</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={{
                            fontFamily: 'PingFangSC-Semibold',
                            fontSize: 24,
                            textAlign: "right",
                            color: '#444444'
                        }}>{item.number !== 0 ? item.number : '0.0000'}</Text>
                        <Text style={{
                            textAlign: "right",
                            fontFamily: 'PingFangSC-Regular',
                            fontSize: 12,
                            color: '#7d7d7d'
                        }}> {item.price !== 0 ? ' ≈ ¥ ' + item.price : ' - '}</Text>
                    </View>
                </View>
            </TouchableHighlight>
            : null
    )

    _keyExtractor = (item, index) => item.name;

    render() {
        let {isRefreshing, showLoading} = this.state;
        const HeaderComponent = () => {
            return (<TouchableHighlight onPress={this.pressTo}>
                <ImageBackground
                    source={topbg}
                    style={styles.topcontent}>
                    <View
                        style={styles.topword}>
                        <Text
                            style={{
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: 14,
                                fontFamily: 'PingFangSc-Light'
                            }}>我的总资产( ￥ )</Text>
                        <Text
                            style={{
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: 30,//40
                                marginTop: 16,
                                fontFamily: 'PingFangSC-Medium'
                            }}>{this.state.allmoney !== 0 ? this.state.allmoney : '0.00'}</Text>
                    </View>
                    <ImageBackground style={styles.add} source={bgadd}>
                        <Text style={{width: 30, height: 30,}}></Text>
                    </ImageBackground>
                </ImageBackground></TouchableHighlight>)
        };
        return (
            <View style={{backgroundColor: '#ffffff', flex: 1,marginTop:isIos?isIphoneX()?40:20:0}}>
                <View style={{backgroundColor: '#ffffff', width: width, flex: 1}}>
                    {!showLoading ?
                        <FlatList
                            ListHeaderComponent={HeaderComponent}
                            showsVerticalScrollIndicator={false}
                            style={{flex: 1}}
                            data={this.state.dataList}
                            renderItem={this._renderItem}
                            ref={(flatList) => this._flatList = flatList}
                            keyExtractor={this._keyExtractor}
                            initialListSize={15}
                            // onEndReachedThreshold={0} //滚动距底部0像素触发
                            onRefresh={this._onRefresh.bind(this)} //刷新
                            // onEndReached={this._onEndReach.bind(this)} //分页处理函数
                            refreshing={isRefreshing} //刷新加载中提示
                            // ListFooterComponent={this._renderFooter.bind(this)}//分页底部提示框
                        />
                        : null}
                    <LoadingView showLoading={showLoading}/>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    let {init, isRefreshing} = state.wallet;
    let {listFocus, listNoFocus} = state.currency;
    return {init, isRefreshing, listFocus, listNoFocus};
}

export default connect(mapStateToProps)(wallet)

const styles = StyleSheet.create({
    topcontent: {
        backgroundColor: '#000',
        height: 200,
        position: 'relative'
    },

    icon: {
        width: 30,
        height: 30
    },
    topword: {
        position: 'absolute',
        top: 65,
        width: '100%'
    },
    add: {
        position: 'absolute',
        width: 30,
        height: 30,
        bottom: 20,
        right: 25
    }
});
