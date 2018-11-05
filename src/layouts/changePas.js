import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Keyboard,
    BackHandler
} from 'react-native';
import Toast from '../components/toast'
import {toastShort} from '../utils/ToastUtil'
import {getStorage, isAndroid, setStorage, width} from '../utils/common_utils';

export default class changePas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPas: '',
            newPas: '',
            againNewPas: '',

            unableClick: {
                borderColor: '#c1c1c1',
                backgroundColor: '#ffffff',
                color: '#c1c1c1',
                disabled: true,
            },
            enableClick: {
                borderColor: '#ffd944',
                backgroundColor: '#ffd944',
                color: '#231815',
                disabled: false,
            },

            pressText: '提示',
            showSuccessChange: false,
            SuccessChangeBtnList: [
                {
                    pressFn: () => {
                        this.setState({showSuccessChange: false});
                        this.props.navigation.navigate('Setting', {
                            headerTitle: '设置'
                        })
                    },
                    btnTitle: '确认'
                }
            ],
            SuccessChangeBtnContent: '密码修改成功'
        };
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

    toSetting = async () => {
        let passwordFromStorage = await getStorage('password');
        let {oldPas, newPas, againNewPas} = this.state;
        if (passwordFromStorage === oldPas) {
            if (newPas === againNewPas) {
                if (/^\d{6}$/.test(newPas) && /^\d{6}$/.test(againNewPas)) {
                    setStorage('password', newPas);
                    this.setState({
                        showSuccessChange: true
                    })
                } else {
                    toastShort('新密码包含非数字字符，请重新输入！')
                }
            } else {
                toastShort('两次输入的新密码不一致，请重新输入！')
            }
        } else {
            toastShort('当前密码输入错误，请重新输入!')
        }
    }

    render() {
        let {showSuccessChange, SuccessChangeBtnContent, SuccessChangeBtnList, pressText, oldPas, newPas, againNewPas, enableClick, unableClick} = this.state;
        let {borderColor, backgroundColor, color, disabled} = oldPas && oldPas.length === 6 && newPas && newPas.length === 6 && againNewPas && againNewPas.length === 6 ? enableClick : unableClick;
        let {privkey, addressEKT} = this.props.navigation.state.params;
        return (
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
                            justifyContent: 'center'
                        }}>
                        <View style={styles.ChangePasInput}>
                            <Text style={styles.ChangePasInputText}>当前密码</Text>
                            <TextInput
                                style={styles.ChangePasInputIn}
                                maxLength={6}
                                underlineColorAndroid="transparent"
                                secureTextEntry={true}
                                keyboardType={"numeric"}
                                placeholderTextColor='#c1c1c1'
                                placeholder='请输入 6 位旧密码'
                                onChangeText={(oldPas) => this.setState({oldPas})}
                                value={oldPas}>
                            </TextInput>
                        </View>
                        <View style={styles.ChangePasInput}>
                            <Text style={styles.ChangePasInputText}>新设密码</Text>
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
                            <Text style={styles.ChangePasInputText}>确认密码</Text>
                            <TextInput
                                style={styles.ChangePasInputIn}
                                maxLength={6}
                                underlineColorAndroid="transparent"
                                secureTextEntry={true}
                                keyboardType={"numeric"}
                                placeholderTextColor='#c1c1c1'
                                placeholder='请再次输入钱包密码'
                                onChangeText={(againNewPas) => this.setState({againNewPas})}
                                value={againNewPas}>
                            </TextInput>
                        </View>
                        <View style={{marginTop: 25, alignItems: 'center'}}>
                            <TouchableHighlight
                                onPress={this.toSetting}
                                underlayColor='#fff'
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
                    <Toast showToast={showSuccessChange} btnList={SuccessChangeBtnList} toastTitle={pressText}
                           btnContent={SuccessChangeBtnContent}></Toast>
                    <View style={styles.ChangePasFooter}>
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 12,
                                color: '#c1c1c1',
                                textAlign: 'center'
                            }}
                        >忘记密码？可导入私钥重置密码</Text>
                        <TouchableHighlight
                            style={{marginTop: 15}}
                            onPress={() => this.props.navigation.navigate('InPk', {
                                headerTitle: '导入钱包',
                                inPath: 'changePas',
                                privkey: privkey,
                                addressEKT: addressEKT
                            })} underlayColor='#ffffff'>
                            <Text
                                style={{
                                    fontFamily: 'PingFangSC-Regular',
                                    fontSize: 14,
                                    color: '#feca2e',
                                    textAlign: 'center'
                                }}
                            >导入私钥</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
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
        marginLeft: 15,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 16,
        color: '#231815',
        textAlign: 'left',
        padding: 0,
        width: '70%'
    },
    ChangePasFooter: {
        position: 'absolute',
        bottom: 40
    }
});
