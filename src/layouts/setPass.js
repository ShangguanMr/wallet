import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Keyboard,
    TouchableWithoutFeedback, BackHandler, StatusBar
} from 'react-native';
import Toast from '../components/toast'
import {setStorage, resetNavigation, isAndroid, width} from '../utils/common_utils';
import {toastShort} from '../utils/ToastUtil';
import {getTransactionList} from '../utils/savedata';

export default class SetPas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPas: '',
            newPas: '',
            againNewPas: '',
            walletName:'',

            enableClick: {
                borderColor: '#ffd944',
                backgroundColor: '#ffd944',
                color: '#231815',
                disabled: false,
            },
            unableClick: {
                borderColor: '#c1c1c1',
                backgroundColor: '#ffffff',
                color: '#c1c1c1',
                disabled: true,
            },

            privkey: '',
        };
    }

    componentWillMount() {
        getTransactionList();
    }

    componentDidMount() {
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this._onBackPressed)
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
    toApp = () => {
        let {newPas, againNewPas,walletName} = this.state;
        setStorage('password', newPas);
        setStorage('walletName', walletName);

        let {inPath, addressEKT, privkey} = this.props.navigation.state.params;
        if (!/^\d{6}$/.test(newPas) || !/^\d{6}$/.test(newPas)) {
            toastShort('钱包密码包含非数字字符，请重新输入！')
            return
        }
        if (newPas !== againNewPas) {
            toastShort('两次输入不一致，请重新输入！')
            return
        }
        switch (inPath) {
            case 'changePas':
                this.props.navigation.dispatch(resetNavigation(0, 'App', {
                    addressEKT: addressEKT,
                    privkey:privkey
                }));
                break;

            case 'createWallet':
                this.props.navigation.dispatch(resetNavigation(0, 'App', {
                    addressEKT: addressEKT,
                    privkey: privkey
                }));
                break;

            case 'wakeUp' :
                this.props.navigation.dispatch(resetNavigation(0, 'App', {
                    addressEKT: addressEKT,
                    privkey: privkey
                }));
                break;

            default:
                break;
        }
    }

    render() {
        let {newPas,againNewPas,
            enableClick,
            unableClick,
        } = this.state;
        let {
            borderColor,
            backgroundColor,
            color,
            disabled
        } = againNewPas && newPas && againNewPas.length === 6 && newPas.length === 6 ? enableClick : unableClick
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar barStyle="dark-content" translucent={false} backgroundColor={'#fff'}/>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }} underlayColor='#fff'>
                    <View style={styles.ChangePas}>
                        <View
                            style={{
                                marginTop: 10,
                                borderTopWidth: 1,
                                width: '100%',
                                borderTopColor: '#c1c1c1',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute'
                            }}>
                            <View style={styles.ChangePasInput}>
                                <TextInput
                                    style={styles.ChangePasInputIn}
                                    maxLength={6}
                                    secureTextEntry={true}
                                    keyboardType={"numeric"}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor='#c1c1c1'
                                    placeholder='请设置 6 位数字，作为钱包密码'
                                    onChangeText={(newPas) => this.setState({newPas})}
                                    value={newPas}>
                                </TextInput>
                            </View>
                            <View style={styles.ChangePasInput}>
                                <TextInput
                                    style={styles.ChangePasInputIn}
                                    maxLength={6}
                                    underlineColorAndroid="transparent"
                                    secureTextEntry={true}
                                    keyboardType={"numeric"}
                                    placeholderTextColor='#c1c1c1'
                                    placeholder='请重复钱包密码'
                                    onChangeText={(againNewPas) => this.setState({againNewPas})}
                                    value={againNewPas}>
                                </TextInput>
                            </View>
                            <View style={{marginTop: 25}}>
                                <TouchableHighlight
                                    onPress={this.toApp}
                                    underlayColor='#ffd944'
                                    disabled={disabled}
                                    style={{
                                        height: 45,
                                        maxWidth: 343,
                                        width: width - 32,
                                        borderWidth: 1,
                                        borderColor: borderColor,
                                        backgroundColor: backgroundColor,
                                        borderRadius: 22.5
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            lineHeight: 45,
                                            color: color,
                                            fontFamily: 'PingFangSC-Regular',
                                            fontSize: 16
                                        }}>完成</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    login() {

    }
}

const styles = StyleSheet.create({
    ChangePas: {
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#ffffff',
        position: 'relative'
    },
    ChangePasInput: {
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#c1c1c1',
        width: '100%'
    },
    ChangePasInputText: {
        marginLeft: 16,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 16,
        color: '#231815',
        textAlign: 'left'
    },
    ChangePasInputIn: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 16,
        marginLeft: 16,
        color: '#231815',
        textAlign: 'left',
        padding: 0,
        width: '100%'
    }
});
