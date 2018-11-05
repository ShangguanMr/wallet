
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    TouchableHighlight,
    ScrollView,
    NetInfo,
    StatusBar,
    BackHandler
} from 'react-native';
import {connect} from "react-redux";
import {
    width,
    height,
    getStorage,
    useStar,
    resetData,
    dateTrans,
    setStorage,
    isIos,
    oldDateTrans,
    compareTime,
    isAndroid,
    isIphoneX
} from "../utils/common_utils";
import LoadingView from '../components/loading'
import {toastShort} from "../utils/ToastUtil";

let address = "";

class assetDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transToken: '',
            transTokenTotalNum: '',
            transTokenTotalPrice: '',
            headerTitleIn: '',
            headerTitleOut: '',
            dataNull: [],
            data: [],
            show: true,
            addressEKT: '',
            showLoading: true,
            isRefreshing: true
        }
    }

    async componentDidMount() {
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);
        }
        address = await getStorage('address');
        let txData = await getStorage('txData') || [];
        let resData = await getStorage('resData') || [];
        let data = resData.concat(txData);
        let {tokenAddress} = this.props.navigation.state.params;
        let list = [];
        data.map((item) => {
            if (item.tokenAddress === tokenAddress) {
                list.push(item);
            }
        });
        this.setState({
            data: list,
            showLoading: false,
            isRefreshing: false
        });
    }

    componentWillUnmount() {
        if (isAndroid) {
            BackHandler.removeEventListener('hardwareBackPress', this._onBackPressed)
        }
        address = "";
    }

    _onBackPressed = () => {
        let {navigation} = this.props;
        navigation.goBack();
        return true
    }

    //下拉刷新；
    async _onRefresh() {
        let txData = await getStorage('txData') || [];
        let resData = await getStorage('resData') || [];
        let data = resData.concat(txData);
        let {tokenAddress} = this.props.navigation.state.params;
        let list = [];
        data.map((item) => {
            if (item.tokenAddress === tokenAddress) {
                list.push(item);
            }
        });
        this.setState({
            data: list,
            showLoading: false,
            isRefreshing: false
        });
    }

    exDetail(item) {
        let {token} = this.props.navigation.state.params;
        this.props.navigation.push('ExDetails', {
            headerTitle: '交易详情',
            transType: item.transType,
            number: item.number,
            //交易单号
            transitionTicket: item.transitionTicket,
            time: item.time,
            transitionAddressIn: item.transitionAddressIn,
            transitionAddressOut: item.transitionAddressOut,
            result: item.result,
            notice: item.data,
            token: token
        });
    }

    _randomItem = ({item, index}) => {
        let {pricision, token} = this.props.navigation.state.params;
        item['number'] = item['amount'] / Math.pow(10, pricision);
        item['transitionAddressIn'] = item['to'];
        item['transitionAddressOut'] = item['from'];
        item['transitionTicket'] = item['txId'];
        item['result'] = item['success'];
        if (item['from'] === address) {
            item['transType'] = '转出';
        } else if (item['to'] === address) {
            item['transType'] = '转入';
        }
        let failIcon = item.result
            ? <View/>
            :
            <View
                style={{
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    backgroundColor: '#dddddd',
                    borderRadius: 3,
                    marginLeft: 2
                }}>
                <Text
                    style={{
                        width: 30,
                        height: 16,
                        lineHeight: 16,
                        fontFamily: 'PingFangSC-Medium',
                        fontSize: 12,
                        color: '#7d7d7d',
                        textAlign: 'center',
                    }}
                >失败</Text>
            </View>

        return (
            <TouchableHighlight
                style={styles.MDListItem}
                onPress={this.exDetail.bind(this, item)}
                underlayColor='#ffffff'>
                <View style={{width: '100%'}}>
                    <View style={styles.MDListItemF}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text
                                style={{
                                    fontFamily: 'PingFangSC-Medium',
                                    fontSize: 16,
                                    color: '#231815',
                                    textAlign: 'left'
                                }}
                            >{item.transType}{token}</Text>
                            {failIcon}
                        </View>
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Medium',
                                fontSize: 16,
                                color: '#231815',
                                textAlign: 'right'
                            }}
                        >{item.transType === '转入' ? '+' : '-'} {item.number}</Text>
                    </View>
                    <View style={styles.MDListItemS}>
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 14,
                                color: '#444444',
                                textAlign: 'left',
                            }}
                            numberOfLines={1}>
                            {item.transType === '转入'?useStar('0x' + item.transitionAddressOut):useStar('0x' + item.transitionAddressIn)}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 14,
                                color: '#7d7d7d',
                                textAlign: 'right'
                            }}
                        >{oldDateTrans(item.time)}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };

    _keyExtractor = (item, index) => `${item.txId}`;

    EmptyList() {
        return (
            <View style={{backgroundColor: '#f8f8f8', marginBottom: 48, height: height - 220}}>
                <Text
                    style={{
                        marginTop: 75,
                        textAlign: 'center',
                        fontFamily: 'PingFangSC-Regular',
                        fontSize: 14,
                        color: '#444444',
                    }}
                >暂时还没有交易记录哦～</Text>
            </View>
        )
    }

    render() {
        let {addressEKT, privkey, token, tokenTotalNum, tokenTotalPrice, pricision, tokenAddress, callback} = this.props.navigation.state.params;
        let {key} = this.props.navigation.state;
        const HeaderComponent = () => {
            return (
                <View style={styles.MD}>
                    <View style={styles.MDTotal}>
                        <Text style={styles.MDTotalCount}>{tokenTotalNum}</Text>
                        <Text style={styles.MDTotalPrice}> ≈
                            ¥ {tokenTotalPrice ? tokenTotalPrice : '-'}</Text>
                    </View>
                    {
                        this.state.data.length !== 0
                            ? <View style={styles.MDTrans}>
                                <Text style={styles.MDTransText}>交易记录</Text>
                            </View>
                            : null
                    }
                </View>
            )
        }
        return (
            <View style={{backgroundColor: '#fff', flex: 1, position: 'relative'}}>
                <StatusBar barStyle="dark-content" translucent={false} backgroundColor={'#fff'}/>
                <View style={styles.MDList}>
                    {!this.state.showLoading
                        ? <FlatList
                            data={this.state.data.sort(compareTime)}
                            style={{flex: 1}}
                            ref={(flatList) => this._flatList = flatList}
                            renderItem={this._randomItem}
                            keyExtractor={this._keyExtractor}
                            ListEmptyComponent={this.EmptyList}
                            ListHeaderComponent={HeaderComponent}
                            showsVerticalScrollIndicator={false}
                            onRefresh={this._onRefresh.bind(this)}
                            refreshing={this.state.isRefreshing}
                        />
                        : null}
                    <LoadingView showLoading={this.state.showLoading}/>
                </View>
                <View
                    style={{
                        position: 'absolute',
                        bottom: isIphoneX() ? 20 : 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopWidth: 1,
                        borderTopColor: '#dddddd',
                        width: '100%',
                        height: 48,
                    }}>
                    <TouchableHighlight
                        style={{
                            width: '50%',
                            backgroundColor: '#ffffff',
                            height: 48
                        }}
                        onPress={() => this.props.navigation.navigate('ItemDeExEkttail', {
                            headerTitle: '转入' + token,
                            addressEKT: addressEKT
                        })}
                        underlayColor='#ffffff'
                    >
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 16,
                                color: '#ffcb00',
                                textAlign: 'center',
                                lineHeight: 48
                            }}>转入</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{
                            backgroundColor: '#ffcb00',
                            width: '50%',
                            height: 48,
                        }}
                        underlayColor='#ffcb00'
                        onPress={() => this.props.navigation.navigate('SendoutCoin', {
                            headerTitle: '转出' + token,
                            transToken: token,
                            transTokenTotalNum: tokenTotalNum,
                            addressEKT: addressEKT,
                            privkey: privkey,
                            pricision: pricision,
                            tokenAddress: tokenAddress,
                            key: key,
                            callback: callback
                        })}>
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 16,
                                color: '#ffffff',
                                textAlign: 'center',
                                lineHeight: 48
                            }}>转出</Text>
                    </TouchableHighlight>
                </View>
                { isIphoneX() ? <View style={{height:20}}></View> : null}
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(assetDetails)

const
    styles = StyleSheet.create({
        MD: {
            paddingTop: 30,
        },
        MDTotal: {
            backgroundColor: '#ffffff'
        },
        MDTotalCount: {
            textAlign: 'center',
            fontFamily: 'PingFangSC-Medium',
            fontSize: 40,
            color: '#231815'
        },
        MDTotalPrice: {
            marginTop: 20,
            marginBottom: isIos ? 0 : 20,
            textAlign: 'center',
            fontFamily: 'PingFangSC-Regular',
            fontSize: 14,
            color: '#444444'
        },
        MDTrans: {
            marginTop: 36,
            backgroundColor: '#f8f8f8',
        },
        MDTransText: {
            marginLeft: 16,
            height: 35,
            lineHeight: 35,
            textAlign: 'left',
            fontFamily: 'PingFangSC-Regular',
            fontSize: 16,
            color: '#231815'
        },
        MDList: {
            flex: 1,
            marginBottom: 48,
            backgroundColor: '#ffffff'
        },
        MDListItem: {
            flexDirection: 'column',
            height: 74,
            borderBottomWidth: 1,
            borderBottomColor: '#dddddd',
            marginLeft: 16,
            marginRight: 16,
        },
        MDListItemF: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 18,
            justifyContent: 'space-between',
        },
        MDListItemS: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    });
