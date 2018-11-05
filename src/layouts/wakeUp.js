import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    InteractionManager,
    StatusBar,
    TouchableHighlight,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import {getStorage, useStar, resetNavigation, isIos , width} from '../utils/common_utils';
import {toastShort} from '../utils/ToastUtil';
import {getTransactionList} from '../utils/savedata';

export default class wakeUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletPas: '',
            //可点击按钮样式
            enableClick: {
                backgroundColor: '#fed853',
                borderColor: '#fed853',
                disabled: false,
                color: '#231815'
            },
            //不可点击按钮样式
            unableClick: {
                backgroundColor: '#ffffff',
                borderColor: '#b7b7b7',
                disabled: true,
                color: '#b7b7b7'
            }
        };
    }

    confirmPas = async () => {
        let {addressEKT, privkey} = this.props.navigation.state.params;
        let passwordFromStorage = await getStorage('password') || '';
            let {walletPas} = this.state;
            if (walletPas === passwordFromStorage) {
                this.props.navigation.dispatch(resetNavigation(0, 'App', {
                    addressEKT: addressEKT,
                    privkey: privkey
                }))
            } else {
                toastShort('密码输入错误，请重新输入！')
            }
    }

    componentWillUnmount() {
        getTransactionList();
    }

    render() {
        let {walletPas, enableClick, unableClick} = this.state;
        let {backgroundColor, borderColor, color, disabled} = walletPas.length === 6 ? enableClick : unableClick;
        let {addressEKT} = this.props.navigation.state.params;
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <StatusBar barStyle="dark-content" translucent={false} backgroundColor={"#fff"}/>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }} underlayColor='#fff'>
                    <View style={styles.wakeUp}>
                        <View style={styles.wakeUpContainer}>
                            <Text
                                style={{
                                    // fontFamily:'MicrosoftYaHei',
                                    fontSize: 18,
                                    color: '#231815',
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >我的EKT钱包</Text>
                            <Text
                                style={{
                                    marginTop: 30,
                                    // fontFamily:'MicrosoftYaHei',
                                    fontSize: 14,
                                    color: '#444444',
                                    textAlign: 'center',
                                    marginLeft: 16,
                                    marginRight: 16
                                }}
                            >{'0x' + useStar(addressEKT)}</Text>
                        </View>
                        <View style={styles.wakeUpPassword}>
                            <TextInput
                                placeholder='输入钱包密码，解锁密码'
                                placeholderTextColor='#b7b7b7'
                                style={styles.wakeUpPasswordInput}
                                maxLength={6}
                                keyboardType={'numeric'}
                                underlineColorAndroid="transparent"
                                secureTextEntry={true}
                                onChangeText={(walletPas) => this.setState({walletPas})}
                                value={this.state.walletPas}
                            ></TextInput>
                            <TouchableOpacity
                                style={{
                                    marginTop: 80,
                                    maxWidth: 325,
                                    width : width -32 ,
                                    height: 45,
                                    borderWidth: 1,
                                    backgroundColor: backgroundColor,
                                    borderColor: borderColor,
                                    justifyContent: 'center',
                                    borderRadius: 40
                                }}
                                disabled={disabled}
                                onPress={this.confirmPas}
                                underlayColor='#feca2e'>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        // fontFamily:'MicrosoftYaHei',
                                        fontSize: 15,
                                        color: color
                                    }}
                                >登录</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.wakeUpFooter}>
                            <Text
                                style={{
                                    fontFamily: 'PingFangSC-Regular',
                                    fontSize: 12,
                                    color: '#c1c1c1',
                                    textAlign: 'center'
                                }}
                            >忘记密码？可导入私钥重置密码</Text>
                            <TouchableOpacity style={{marginTop: 15}}
                                              onPress={() => this.props.navigation.navigate('InPk', {
                                                  headerTitle: '导入钱包',
                                                  inPath: 'wakeUp',
                                                  addressEKT: addressEKT
                                              })}>
                                <Text
                                    style={{
                                        fontFamily: 'PingFangSC-Regular',
                                        fontSize: 14,
                                        color: '#feca2e',
                                        textAlign: 'center'
                                    }}
                                >导入私钥</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wakeUp: {
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#ffffff',
        position: 'relative'
    },
    wakeUpContainer: {
        marginTop: 115
    },
    wakeUpPassword: {
        marginTop: 42 ,
        alignItems : 'center'
    },
    wakeUpPasswordInput: {
        height: 50,
        width: 326,
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 18,
        padding: 0
        // fontFamily:'MicrosoftYaHei',
    },
    wakeUpFooter: {
        position: 'absolute',
        bottom: 40
    }
});
