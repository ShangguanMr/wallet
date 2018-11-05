import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    StatusBar,
    NativeModules
} from "react-native";
import CircleCheckBox, {LABEL_POSITION} from "react-native-circle-checkbox";
import {width, height, setStorage, isIos, isAndroid, resetNavigation} from "../utils/common_utils";
import {getWallet} from '../reducers/actions/wallet/wallet';
import {connect} from 'react-redux';
import {toastShort} from '../utils/ToastUtil'


class createwallet extends Component {
    constructor() {
        super();
        this.state = {
            password: "",
            checkPassword: "",
            checked: false,
            isChecked: false,
            unableClick: {
                backgroundColor: '#ffffff',
                borderColor: "#b7b7b7",
                color: "#b7b7b7",
                disabled: true,
            },
            enableClick: {
                backgroundColor: '#fed853',
                borderColor: "#fed853",
                color: "#231815",
                disabled: false,
            }
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    changeChecked = () => {
        this.setState({
            isChecked: !this.state.isChecked
        })
    }

    createToken = () => {
        let {password, checkPassword} = this.state;
        if (/^\d{6}$/.test(password) && /^\d{6}$/.test(checkPassword)) {
            if (password === checkPassword) {
                setStorage('password', password);
                if (isAndroid) {
                    NativeModules.MyNativeModule.getKeyPair((addressEKT, privkey) => {
                        setStorage("address", addressEKT.toLowerCase());
                        setStorage("privkey", privkey);
                            this.props.navigation.dispatch(resetNavigation(0, 'CreateSuccess', {
                                addressEKT: addressEKT.toLowerCase(),
                                privkey: privkey
                            }))
                        })
                } else if (isIos) {
                    NativeModules.MyNativeModule.getAcount((addressEKT, privkey) => {
                        setStorage("address", addressEKT.toLowerCase());
                        setStorage("privkey", privkey);
                            this.props.navigation.dispatch(resetNavigation(0, 'CreateSuccess', {
                                addressEKT: addressEKT.toLowerCase(),
                                privkey: privkey
                            }))
                        })
                }
            } else {
                if (password !== checkPassword) {
                    toastShort('前后密码不一致，请重新输入')
                } else {
                    toastShort('密码长度不够6位，请重新输入！')
                }
            }
        } else {
            toastShort('当前输入密码包含特殊字符，请重新输入！');
        }

    }

    render() {
        let {isChecked, enableClick, unableClick} = this.state;
        let {backgroundColor, disabled, borderColor, color} = isChecked ? enableClick : unableClick;
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar barStyle="dark-content" translucent={false} backgroundColor={"#fff"}/>
                <View style={{backgroundColor: "#ffffff"}}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss()
                        }}
                        underlayColor="transparent">
                        <View>
                            <View style={{
                                height:height, paddingTop: 115,
                                marginLeft: 25,
                                marginRight: 25,
                                backgroundColor: "#ffffff",
                                position: "relative"
                            }}>
                                <Text style={styles.login}>创建EKT钱包</Text>
                                <View style={{marginTop: 42}}>
                                    <TextInput
                                        ref='textInput'
                                        style={styles.password}
                                        placeholder='请设置 6 位数字，作为钱包密码'
                                        maxLength={6}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(password) => this.setState({password})}
                                        value={this.state.password}
                                        secureTextEntry={true}
                                        keyboardType={"numeric"}
                                        placeholderTextColor="#b7b7b7"
                                    />
                                    <TextInput
                                        style={styles.password}
                                        placeholder='请重复钱包密码'
                                        underlineColorAndroid="transparent"
                                        maxLength={6}
                                        onChangeText={(checkPassword) => this.setState({checkPassword})}
                                        value={this.state.checkPassword}
                                        secureTextEntry={true}
                                        placeholderTextColor="#b7b7b7"
                                        keyboardType={"numeric"}
                                    />
                                </View>
                                <View style={styles.agree}>
                                    <CircleCheckBox
                                        checked={isChecked}
                                        onToggle={() => this.changeChecked()}
                                        labelPosition={LABEL_POSITION.RIGHT}
                                        label=""
                                        outerSize={15}
                                        innerSize={9}
                                        filterSize={13}
                                        outerColor="#444"
                                        innerColor="#ffd400"
                                        filterColor="white"
                                        styleCheckboxContainer={{paddingTop: isAndroid ? 2 : 0}}/>
                                    <Text onPress={() => this.changeChecked()}
                                          style={{
                                              color: "#444444",
                                              fontSize: 14,
                                              // height: 54,
                                              width: 110,
                                              paddingLeft: 5
                                          }}>
                                        我已阅读并同意
                                    </Text>
                                    <Text
                                        style={{
                                            color: "#ffcb00",
                                            fontSize: 14,
                                            // height: 54,
                                            width: 100
                                        }}
                                        onPress={() => {
                                            this.props.navigation.navigate('UseServe', {headerTitle: '使用条款'})
                                        }}>
                                        使用条款
                                    </Text>
                                </View>
                                <View style={{marginTop: 0}}>
                                    <TouchableOpacity
                                        style={{
                                            height: 45,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                            borderRadius: 40,
                                            borderWidth: 1,
                                            backgroundColor: backgroundColor,
                                            borderColor: borderColor
                                        }}
                                        disabled={disabled}
                                        onPress={() => this.createToken()}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                color: color
                                            }}>创建钱包</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{position: "absolute", bottom: 44, width: "100%"}}>
                                    <TouchableOpacity
                                        style={styles.btn2}
                                        onPress={() =>
                                            this.props.navigation.navigate('InPk', {
                                                headerTitle: '导入钱包',
                                                inPath: 'createWallet'
                                            })}>
                                        <Text style={styles.btnText2}>导入钱包</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    let {data} = state.wallet;
    return {data: data}
}

//或者直接写在页面里面也可以；
function mapDispatchToProps(dispatch) {
    return {
        getWallet: (params) => dispatch(getWallet(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createwallet);

const styles = StyleSheet.create({
    login: {
        color: "#231815",
        // fontFamily:'Microsoft YaHei',
        fontSize: 18,
    },
    password: {
        height: 50,
        fontSize: 14,
        lineHeight: 18,
        borderBottomColor: "#b7b7b7",
        borderBottomWidth: 1,
        padding: 0,
    },
    agree: {
        flexDirection: "row",
        // fontFamily:'MicrosoftYaHei'
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 50
    },
    btn2: {
        height: 45
    },
    btnText2: {
        fontSize: 15,
        color: "#444444",
        textAlign: "center"
    }
});
