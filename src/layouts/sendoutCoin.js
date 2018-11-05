import React, {Component} from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Image,
    InteractionManager,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Keyboard, BackHandler
} from "react-native";
import {toastShort} from "../utils/ToastUtil";
import BackButton from '../components/backButton'
import {getStorage, isAndroid, width, height} from "../utils/common_utils";

const IMG_SACNNING = require("../assets/img/scanning.png")

export default class SendoutCoin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unableClick: {
                borderColor: '#c1c1c1',
                color: '#c1c1c1',
                backgroundColor: '#ffffff',
                disabled: true,
            },
            enableClick: {
                borderColor: '#fed853',
                color: '#231815',
                backgroundColor: '#fed853',
                disabled: false,
            },

            receiveAddress: '',
            placeholderFirst: '请输入对方 ',
            placeholderSecond: ' 接收地址',
            headerTitleFirst: '转出',

        };
    }

    componentWillMount() {
        this.props.navigation.setParams({
            navigatePress: this.navigatePress,
        })
    }

    componentDidMount() {
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
        let {navigation} = this.props;
        navigation.goBack();
        return true
    }
    navigatePress = () => {
        this.props.navigation.navigate('Qr', {
            headerTitle: '扫描钱包二维码',
            callback: (backData) => {
                let rg = /^0x+([a-zA-Z0-9]{64})$/;
                let isTrue = rg.test(backData);
                if (isTrue) {
                    this.setState({
                        receiveAddress: backData
                    })
                } else {
                    toastShort('该钱包地址无效!')
                }
            }
        })
    }

    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params ? navigation.state.params.headerTitle : null,
        headerRight: (
            <TouchableOpacity
                style={{width: 22, height: 22, marginRight: 16}}
                onPress={navigation.state.params ? navigation.state.params.navigatePress : null}>
                <ImageBackground
                    source={IMG_SACNNING}
                    style={{
                        width: 22,
                        height: 22,
                    }}>
                </ImageBackground>
            </TouchableOpacity>
        ),
        headerLeft: (
            <BackButton _onPress={() => {
                navigation.goBack(null);
            }}></BackButton>
        ),
        headerTitleStyle: {
            color: '#231815',
            fontSize: 18,
            // marginLeft:width/2-100,
            width: width - 96 - width * 2 / 15,
            textAlign: 'center',
            alignSelf: "center",
            letterSpacing: 2,
            fontWeight: '400',
            fontFamily: 'PingFangSC-Regular',
        },
        headerBackTitle: null,
        headerStyle: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            elevation: 0,
            borderBottomColor: '#ddd'
        },
        gesturesEnabled: true,
        headerMode: 'float'
    });

    isRight = async () => {
        let {receiveAddress} = this.state;
        let address = '0x' + await getStorage('address');
        if (String(receiveAddress) === String(address)) {
            toastShort("同一个账户无法相互转账！")
            return;
        }
        let {transToken, transTokenTotalNum, addressEKT, privkey, callback, pricision, tokenAddress, key} = this.props.navigation.state.params;
        let rg = /^0x+([a-zA-Z0-9]{64})$/;
        let isTrue = rg.test(receiveAddress);
        if (isTrue) {
            this.props.navigation.navigate('SendTransation', {
                headerTitle: this.state.headerTitleFirst + transToken,
                transToken: transToken,
                inAddress: this.state.receiveAddress,
                transTokenTotalNum: transTokenTotalNum,
                addressEKT: addressEKT,
                privkey: privkey,
                key: key,
                pricision: pricision,
                tokenAddress: tokenAddress,
                callback: callback
            })
        } else {
            toastShort('该钱包地址无效!')
        }
    }

    render() {
        let {receiveAddress, enableClick, unableClick} = this.state;
        let transToken = 'EKT'
        let {backgroundColor, color, borderColor, disabled} = receiveAddress ? enableClick : unableClick;
        return (
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
            }} underlayColor='#fff'>
                <View style={{backgroundColor: '#ffffff', flex: 1}}>
                    <View style={{
                        borderBottomColor: '#dddddd',
                        borderBottomWidth: 1,
                        minHeight:62,
                        justifyContent:'center'
                    }}>
                        <TextInput
                            underlineColorAndroid="transparent"
                            style={{
                                width : width -32 ,
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 14,
                                color: '#231815',
                                textAlign: 'left',
                                marginLeft: 16,
                                padding: 0
                            }}
                            placeholder={this.state.placeholderFirst + transToken + this.state.placeholderSecond}
                            placeholderTextColor='#c1c1c1'
                            maxLength={66}
                            multiline={true}
                            onChangeText={(receiveAddress) => this.setState({receiveAddress})}
                            value={this.state.receiveAddress}
                        ></TextInput>
                    </View>
                    <View style={{marginTop: 25, position: 'relative'}}>
                        <TouchableOpacity
                            disabled={disabled}
                            style={{
                                position: 'absolute',
                                left: 16,
                                right: 16,
                                borderWidth: 1,
                                borderColor: borderColor,
                                backgroundColor: backgroundColor,
                                height: 45,
                                borderRadius: 22.5
                            }}
                            onPress={this.isRight}
                        >
                            <Text
                                style={{
                                    color: color,
                                    fontFamily: 'PingFangSC-Regular',
                                    fontSize: 16,
                                    // color : this.state.color ,
                                    textAlign: 'center',
                                    lineHeight: 45
                                }}>下一步</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({});