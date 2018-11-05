import React, {Component} from "react";
import {
    StyleSheet,
    Clipboard,
    View,
    Text,
    InteractionManager,
    Animated,
    Easing,
    Platform,
    TouchableHighlight,
    StatusBar, BackHandler
} from "react-native";
import QRCode from "react-native-qrcode";
import {isAndroid, isIos , width} from '../utils/common_utils'
import {toastShort} from "../utils/ToastUtil";

export default class exEkt extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    _setContent() {
        try {
            let {addressEKT} = this.props.navigation.state.params;
            Clipboard.setString('0x' + addressEKT)
            toastShort('复制成功！');
        } catch (e) {
            toastShort('复制失败！')
        }

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

    render() {
        let {addressEKT} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" translucent={false} backgroundColor={"#fff"}/>
                <QRCode
                    value={'0x' + addressEKT}
                    size={250}
                    bgColor='black'
                    fgColor='white'/>
                <View style={{width: '100%', borderBottomWidth: 1, borderBottomColor: '#dddddd'}}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 14,
                        lineHeight: 20,
                        color: '#444444',
                        marginTop: 30,
                        marginLeft: 16,
                        marginRight: 16,
                        marginBottom: 20
                    }}>
                        {'0x' + addressEKT}
                    </Text>
                </View>
                <TouchableHighlight
                    style={styles.btn1}
                    onPress={() => this._setContent()}
                    underlayColor={'#ffcb00'}>
                    <Text style={styles.btnText1}>
                        复制地址
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn1: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: 45,
        width: width - 32 ,
        maxWidth : 343 ,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#fed853',
        backgroundColor: '#fed853'
    },
    btnText1: {
        fontSize: 14,
        color: '#231815'
    },
});