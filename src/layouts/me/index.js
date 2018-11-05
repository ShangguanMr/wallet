import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableHighlight,
    Clipboard,
    NetInfo,
    BackHandler,
    Image
} from 'react-native';
import MeItem from '../../components/meItem.js' ;
import Password from '../../components/password';
import Toast from '../../components/toast'
import {getStorage, setStorage, isAndroid,isIos,isIphoneX} from '../../utils/common_utils.js';
import {toastShort} from '../../utils/ToastUtil'

const mebg = require('../../assets/img/mebg.jpg');
const rightYellow = require('../../assets/img/rightyellow.png');

export default class me extends Component {
    constructor() {
        super()
        this.state = {
            walletName: '',
            //两种情况
            showBackUp: false,
            step1No: '导出私匙',
            step1Yes: '导出私钥（请备份）',

            step2: '兑换EKT主网币',

            step3: '设置',

            wallettitle: '请输入钱包密码',
            showPass: false,
            show : '',

            content: '',
            //显示私钥toast
            showPriv: false,
            privList: [
                {pressFn: this._hideKey.bind(this), btnTitle: '复制文本'}
            ],
            pressText: '我的私钥',
        }
    }

    async componentWillMount() {
        let showBackUp = await getStorage('showBackUp') || false;
        let walletName = await getStorage('walletName') || '';
        this.setState({
            showBackUp: showBackUp,
            walletName : walletName,
        })
    }

    componentDidMount() {
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);
        }
    }

    componentWillUnmount() {
        if (isAndroid) {
            BackHandler.removeEventListener('hardwareBackPress', this._onBackPressed);
        }
    }

    _onBackPressed = () => {
        this.setState({showPass: false})
    }

    _hideKey() {
        try {
            let {privkey} = this.props.nav.state.params;
            Clipboard.setString(privkey);
            setStorage('showBackUp', false)
            this.setState({
                showPriv: false,
                showBackUp: false
            });
            toastShort('复制成功！')
        } catch (e) {
            this.setState({
                showPriv: false
            });
            toastShort('复制失败！')
        }
    }

    useStar(vl) {
        let hideVl = vl.substr(10, vl.length - 20);
        let showVl = vl.replace(hideVl, "***");
        return showVl;
    }

    toTwo = () => {
        let {navigate} = this.props.nav;
        let {addressEKT} = this.props.nav.state.params;
        navigate('ItemDeExEkttail', {
            headerTitle: '我的EKT钱包地址',
            addressEKT: addressEKT
        })
    }

    //备份秘钥输入密码框弹出
    press1 = () => {
        let {showPass} = this.state;
        this.setState({
            showPass: !showPass,
            show : 'privkey'
        })
    }

    press2 = () => {
        this.props.nav.navigate('ExETH', {
            headerTitle: '兑换EKT主网币',
            addressETH: 'sdksdksjdksjdksjdksjdksndksdkn'
        })
    }

    //跳转设置
    press3 = () => {
        let {navigate} = this.props.nav;
        let {privkey, addressEKT} = this.props.nav.state.params;
        navigate('Setting', {
            headerTitle: '设置',
            privkey: privkey,
            addressEKT: addressEKT
        })
    }

    //密码输入返回键函数
    leftClick = () => {
        this.setState({
            showPass: false
        })
    }

    //显示私钥
    showPrivkey = async (value) => {
        let {privkey} = this.props.nav.state.params;
        let password = await getStorage('password') || '';
        if (password === value) {
            this.setState(
                {
                    showPass: false,
                },
                () => {
                    this.setState({
                        showPriv: true
                    })
                }
            )
        } else {
            this.setState({showPass: false});
            toastShort('密码错误！');
        }
    }

    render() {
        let {wallettitle, showPass, showPriv, privList, pressText, step1No, step1Yes, step3, step2, showBackUp,walletName} = this.state;
        let {addressEKT, privkey} = this.props.nav.state.params;
        return (
            <View
                style={{flex: 1, flexDirection: 'column',marginTop:isIos?isIphoneX()?40:20:0}}>
                <TouchableHighlight onPress={this.toTwo}>
                    <ImageBackground
                        source={mebg}
                        style={{height: 175, position: 'relative'}}>
                        <Text
                            style={{
                                fontSize: 22,
                                color: '#ffffff',
                                marginLeft: 16,
                                marginTop: 65,
                                fontFamily: 'PingFangSC-Semibold'
                            }}>{(walletName||'我')+'的EKT钱包'}</Text>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 16,
                                alignContent: 'center',
                                marginTop: 14
                            }}>
                            <Text
                                style={{
                                    color: '#e6c518',
                                    fontSize: 14,
                                    fontFamily: 'PingFangSC-Regular'
                                }}>{'0x' + this.useStar(addressEKT)}</Text>
                            <Image source={rightYellow} style={{width: 8, height: 14}}></Image>
                        </View>
                    </ImageBackground>
                </TouchableHighlight>
                <View>
                    <MeItem title={showBackUp ? step1Yes : step1No} _pressCb={() => this.press1()}> </MeItem>
                    <MeItem title={step2} _pressCb={() => this.press2()}> </MeItem>
                    <MeItem title={step3} _pressCb={() => this.press3()}> </MeItem>
                </View>
                <Password wallettitle={wallettitle} showPass={showPass} LeftFunc={this.leftClick} onEnd={this.showPrivkey} onRequestClose={this._onBackPressed}/>
                <Toast showToast={showPriv} btnList={privList} toastTitle={pressText} btnContent={privkey} showNotice={true} textAlign={'left'}/>
            </View>
        )
    }
}
