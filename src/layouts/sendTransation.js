import React, {Component} from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    WebView,
    Dimensions,
    BackHandler,
    NetInfo,
    TouchableHighlight,
    Keyboard,
    TouchableWithoutFeedback,
    ART,
    NativeModules,
    ScrollView
} from "react-native";
import Password from '../components/password';
import {
    getStorage,
    isIos,
    setStorage,
    width,
    height,
    isAndroid,
    isIphoneX,
    getNetWorkState
} from "../utils/common_utils";
import {toastShort} from '../utils/ToastUtil'
import {connect} from 'react-redux';
import {transactionDetails} from '../reducers/actions/wallet/wallet';
import LoadingView from '../components/loading'
import KeyboardSpacer from 'react-native-keyboard-spacer';

const IMG_CLEAN = require('../assets/img/cleanX.png')

const path1 = new ART.Path()
    .moveTo(8, 0)
    .lineTo(0, 8)
    .close();
const path2 = new ART.Path()
    .moveTo(0, 0)
    .lineTo(8, 8);

// let startTime = 0;

class SendTransation extends Component {
    constructor(props) {
        super(props);
        this._onEnd = this._onEnd.bind(this);
        this.state = {
            //按钮变色设置
            enableClick: {
                borderColor: '#fed853',
                color: '#231815',
                backgroundColor: '#fed853',
                disabled: false,
            },
            unableClick: {
                borderColor: '#c1c1c1',
                color: '#c1c1c1',
                backgroundColor: '#f9f9f9',
                disabled: true,
            },
            inAddress: '',
            transTokenTotalNum: '',
            placeholderFirst: '现有 ',
            placeholderSecond: ' : ',
            transToken: '',
            transNumberInput: '',
            wallettitle: '请输入交易密码',
            showPass: false,
            showMiddle: true,
            notice: '',
            showLoading: false,
            fee: 0,
            scrollEnabled: false
        };
    }

    async componentDidMount() {
        let fee = await getStorage('fee') || 0;
        this.setState({fee: fee / Math.pow(10, 8)})
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);
        }
    }

    componentWillUnmount() {
        if (isAndroid) {
            BackHandler.removeEventListener('hardwareBackPress', this._onBackPressed)
        }
    }


    _onBackPressed = () => {
        console.log('sss', this.state)
        let {showPass} = this.state;
        if (showPass) {
            this.setState({showPass: false})
        } else {
            let {navigation} = this.props;
            navigation.goBack();
            return true
        }
    }

    allIn() {
        let {transTokenTotalNum} = this.props.navigation.state.params
        this.setState({
            transNumberInput: String(transTokenTotalNum)
        });
    }

    _confirm = async () => {
        let isConnected = await getNetWorkState();
        let {transNumberInput} = this.state;
        if (Number(transNumberInput) >= 1) {
            if (transNumberInput.indexOf('.') > -1) {
                let num = transNumberInput.split('.');
                let zerNum = num[1].length;
                if (zerNum > 4) {
                    toastShort('请输入小数点后4位！');
                    return;
                }
            }
        } else {
            toastShort('转出数量必须大于1个！');
            return;
        }
        if (isConnected) {
            let {showPass} = this.state;
            this.setState({
                showPass: !showPass
            })
        } else {
            toastShort('请联网后重试！')
        }
    }

    leftClick = () => {
        let {showPass} = this.state;
        this.setState({
            showPass: !showPass
        })
        Keyboard.dismiss();
    }


    async _onEnd(password) {
        let pwd = await getStorage("password") || '';
        console.log("22222", pwd, password);
        if (password === pwd) {
            this.giveh5();
        } else {
            this.setState({
                showPass: false
            })
            toastShort('密码错误，请重试！')
        }
    }

    giveh5 = async () => {
        let nonce = await getStorage("nonce") || 0;
        let fee = await getStorage("fee") || 0;
        nonce += 1;
        let date = new Date();
        let {transNumberInput} = this.state;
        let {addressEKT, privkey, inAddress, pricision, tokenAddress} = this.props.navigation.state.params;
        let {notice} = this.state;
        let time = date.valueOf();
        let len = inAddress.length;
        inAddress = inAddress.substring(2, len)
        let tx = {
            from: addressEKT,
            to: inAddress,
            time: time,
            amount: parseFloat(transNumberInput) * Math.pow(10, pricision),
            nonce: nonce,
            data: notice,
            tokenAddress: tokenAddress,
            fee: fee
        };
        setStorage('tx', tx);
        let data = '{"from": ' + '"' + tx['from'] + '"' + ', "to": ' + '"' + tx['to'] + '"' + ', "time": ' + tx['time'] + ', "amount": ' + tx['amount'] + ', "fee": ' + tx['fee'] + ', "nonce": ' + tx['nonce'] + ', "data": ' + '"' + tx['data'] + '"' + ', "tokenAddress": ' + '"' + tx['tokenAddress'] + '"' + '}'
        if (isAndroid) {
            NativeModules.MyNativeModule.getSign(data, privkey, (res) => {
                let that = this;
                let data = {};
                setStorage("sign", res.toLowerCase());
                getStorage('tx').then((restx) => {
                    let tx = restx || {};
                    tx['EventType'] = "transaction";
                    tx['sign'] = res.toLowerCase();
                    let nonce = tx['nonce'];
                    getStorage('txData').then((restxdata) => {
                        let txData = restxdata || [];
                        setStorage("nonce", nonce);
                        that.props.dispatch(transactionDetails(tx)).then(res => {
                            if (res.status === 0 && res.msg === 'ok') {
                                toastShort('ok');
                                tx['success'] = true;
                                tx['txId'] = res['result'];
                                txData.push(tx);
                                setStorage('txData', txData);
                                let {key, callback} = that.props.navigation.state.params;
                                if (callback) callback();
                                that.props.navigation.goBack(key);
                                toastShort('新交易发送成功！')
                            } else {
                                this.setState({showPass: false}, () => {
                                    toastShort("交易失败请重试！");
                                })
                            }
                        }).catch((err) => {
                            if (!!err) {
                                this.setState({showPass: false}, () => {
                                    toastShort("交易发送失败请重试！");
                                })
                            }
                        });
                    })
                })
            })
        } else if (isIos) {
            NativeModules.MyNativeModule.getSignMsg((data), (privkey), (res) => {
                let that = this;
                let data = {};
                setStorage("sign", res.toLowerCase());
                getStorage('tx').then((restx) => {
                    let tx = restx || {};
                    tx['EventType'] = "transaction";
                    tx['sign'] = res.toLowerCase();
                    let nonce = tx['nonce'];
                    getStorage('txData').then((restxdata) => {
                        let txData = restxdata || [];
                        setStorage("nonce", nonce);
                        that.props.dispatch(transactionDetails(tx)).then(res => {
                            if (res.status === 0 && res.msg === 'ok') {
                                console.log("=====>", res);
                                toastShort('ok');
                                tx['success'] = true;
                                tx['txId'] = res['result'];
                                txData.push(tx);
                                setStorage('txData', txData);
                                let {key, callback} = that.props.navigation.state.params;
                                if (callback) callback();
                                that.props.navigation.goBack(key);
                                toastShort('新交易发送成功！')
                            } else {
                                this.setState({showPass: false}, () => {
                                    toastShort("交易失败请重试！");
                                })
                            }
                        }).catch((err) => {
                            if (!!err) {
                                this.setState({showPass: false}, () => {
                                    toastShort("交易发送失败请重试！");
                                })
                            }
                        });
                    })
                })
            })
        }
    }
    _success = () => {
    }
    _fail = () => {
    }

    noticeFocus = () => {
        this.setState({
            scrollEnabled: true,

        }, () => this._scrollView.scrollTo({
            x: 0,
            y: isIos ? 100 : 150,
            animated: true
        }))
    }

    noticeBlur = () => {
        this.setState({
            scrollEnabled: false,

        }, () => this._scrollView.scrollTo({
            x: 0,
            y: 0,
            animated: true
        }))
    }

    render() {
        let {placeholderFirst, placeholderSecond, transNumberInput, wallettitle, showPass, showMiddle, enableClick, unableClick, notice, showLoading, scrollEnabled} = this.state;
        let {transToken, inAddress, transTokenTotalNum} = this.props.navigation.state.params;
        let {borderColor, color, backgroundColor, disabled} = (transNumberInput > 0 && transNumberInput <= transTokenTotalNum) ? enableClick : unableClick;
        let _renderClean = (transNumberInput)
            ? (
                <ImageBackground source={IMG_CLEAN} style={{width: 13, height: 13}}>
                    <Text style={{width: 13, height: 35}}
                          onPress={() => this.setState({transNumberInput: ''})}/>
                </ImageBackground>
            )
            : (<View/>)
        return (
            <View style={{flex: 1, backgroundColor: '#f9f9f9'}}>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }} underlayColor='#fff'>
                    <ScrollView ref={(scrollView) => {
                        this._scrollView = scrollView;
                    }} scrollEnabled={scrollEnabled}>
                        <View style={{backgroundColor: '#f9f9f9', flex: 1}}>
                            <View style={{marginTop: 10, backgroundColor: '#ffffff', height: 115}}>
                                <Text style={{
                                    marginTop: 30,
                                    fontSize: 14,
                                    fontFamily: 'PingFangSC-Regular',
                                    textAlign: 'center',
                                    color: '#7d7d7d'
                                }}>转入地址</Text>
                                <Text style={{
                                    marginTop: 20,
                                    fontFamily: 'PingFangSC-Regular',
                                    fontSize: 14,
                                    color: '#231815',
                                    textAlign: 'left',
                                    width: width - 30,
                                    marginLeft: 15
                                }}>{inAddress}</Text>
                            </View>
                            <View style={{marginTop: 10, backgroundColor: '#ffffff'}}>
                                <View style={{marginLeft: 16, marginRight: 16}}>
                                    <Text style={{
                                        marginTop: 20,
                                        fontFamily: 'PingFangSC-Regular',
                                        fontSize: 16,
                                        color: '#231815',
                                        textAlign: 'left'
                                    }}>转出 {transToken} 数量</Text>
                                    <View style={{
                                        marginTop: 20,
                                        width: '100%',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <TextInput
                                            style={{
                                                fontFamily: 'PingFangSC-Regular',
                                                fontSize: transNumberInput ? 30 : 16, color: '#231815',
                                                height: 35, padding: 0, width: '70%'
                                            }}
                                            underlineColorAndroid="transparent"
                                            placeholder={placeholderFirst + transToken + placeholderSecond + transTokenTotalNum}
                                            value={transNumberInput}
                                            onChangeText={(transNumberInput) => {
                                                if (transNumberInput > transTokenTotalNum) {
                                                    toastShort("转出数量超出资产总和，请输入合理的数量")
                                                }
                                                this.setState({transNumberInput})
                                            }}
                                        />
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            {_renderClean}
                                            <TouchableOpacity style={{height: 35, marginLeft: 10}}>
                                                <Text style={{
                                                    textAlign: 'right',
                                                    fontSize: 12,
                                                    lineHeight: 35,
                                                    fontFamily: 'PingFangSC-Regular',
                                                    color: '#ffcb00',
                                                }}
                                                      onPress={() => this.allIn()}>全部转出</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{marginTop: 24, width: width, flexDirection: 'row'}}>
                                    <View style={{
                                        height: 8,
                                        width: 36,
                                        borderBottomColor: '#ddd',
                                        borderBottomWidth: 1
                                    }}/>
                                    <View>
                                        <ART.Surface height={8} width={8}>
                                            <ART.Shape d={path1} stroke="#dddddd" strokeWidth={1}/>
                                        </ART.Surface>
                                    </View>
                                    <View>
                                        <ART.Surface height={8} width={8}>
                                            <ART.Shape d={path2} stroke="#dddddd" strokeWidth={1}/>
                                        </ART.Surface>
                                    </View>
                                    <View style={{
                                        height: 8,
                                        width: width - 48,
                                        borderBottomColor: '#ddd',
                                        borderBottomWidth: 1
                                    }}/>
                                </View>
                                <View style={{marginLeft: 16, marginRight: 16}}>
                                    <View>
                                        <Text style={{
                                            marginTop: 15,
                                            textAlign: 'left',
                                            fontSize: 13,
                                            color: '#444444'
                                        }}>免手续费用</Text>
                                        <View style={styles.notice}>
                                            <TextInput
                                                style={{
                                                    fontSize: 12,
                                                    color: "#444444",
                                                    fontFamily: "PingFangSC-Regular",
                                                    padding: 0,
                                                    marginLeft: 10,
                                                    marginRight: 10,
                                                    maxHeight: isIos ? 100 : 70,
                                                    width: width - 50,
                                                    marginBottom: isIos ? 4 : 0
                                                }}
                                                multiline={true}
                                                placeholder='添加备注'
                                                // textAlignVertical="top"
                                                onFocus={this.noticeFocus}
                                                onBlur={this.noticeBlur}
                                                underlineColorAndroid="transparent"
                                                onChangeText={(notice) => this.setState({notice})}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{width: width, marginTop: 10, flex: 1}}>
                                <Text
                                    style={{
                                        marginLeft: 16,
                                        fontFamily: 'PingFangSC-Regular',
                                        fontSize: 14,
                                        color: '#7d7d7d',
                                        textAlign: 'left'
                                    }}>请仔细核对并确认信息，转出后无法撤销
                                </Text>
                                <TouchableOpacity
                                    disabled={disabled}
                                    style={{
                                        marginTop: 30,
                                        marginLeft: 16,
                                        marginRight: 16,
                                        borderWidth: 1,
                                        borderColor: borderColor,
                                        backgroundColor: backgroundColor,
                                        height: 45,
                                        borderRadius: 22.5
                                    }}
                                    onPress={this._confirm}
                                >
                                    <Text
                                        style={{
                                            color: color,
                                            fontFamily: 'PingFangSC-Regular',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            lineHeight: 45
                                        }}>转出</Text>
                                </TouchableOpacity>
                            </View>
                            <Password wallettitle={wallettitle}
                                      showPass={showPass}
                                      transToken={transToken}
                                      inAddress={inAddress}
                                      LeftFunc={this.leftClick}
                                      onEnd={this._onEnd}
                                      transNumberInput={transNumberInput}
                                      showMiddle={showMiddle}
                                      fee={this.state.fee}
                                      onRequestClose={this._onBackPressed}
                                      onBlur={() => {
                                          this.setState({showPass: false})
                                      }}/>
                        </View>
                        {scrollEnabled&&isAndroid ? <View style={{width:width,height: 150,backgroundColor:'#f9f9f9'}}/> : null}
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    onMessage = (e) => {
        let that = this;
        let data = {};
        console.log(e.nativeEvent.data);

        if (e.nativeEvent.data) {
            data = JSON.parse(e.nativeEvent.data);
        }
        setStorage("sign", data.sign);
        getStorage('tx').then((restx) => {
            let tx = restx || {};
            tx['EventType'] = "transaction";
            tx['sign'] = data.sign;
            let nonce = tx['nonce'];
            getStorage('txData').then((restxdata) => {
                let txData = restxdata || [];
                setStorage("nonce", nonce);
                that.props.dispatch(transactionDetails(tx)).then(res => {
                    if (res.status === 0 && res.msg === 'ok') {
                        console.log("=====>", res);
                        toastShort('ok');
                        tx['success'] = true;
                        tx['txId'] = res['result'];
                        txData.push(tx);
                        setStorage('txData', txData);
                        let {key, callback} = that.props.navigation.state.params;
                        if (callback) callback();
                        that.props.navigation.goBack(key);
                        toastShort('新交易发送成功！')
                    } else {
                        toastShort("交易发送失败请重试！");
                    }
                }).catch((err) => {
                    if (!!err) {
                        toastShort('交易发送失败请重试！');
                    }
                });
            })
        })
    };

}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps)(SendTransation);

const styles = StyleSheet.create({
    notice: {
        marginTop: 15,
        marginBottom: 15,
        borderWidth: 0.4,
        borderColor: "#b7b7b7",
        borderRadius: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
