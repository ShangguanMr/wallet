import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Animated,
    Easing,
    Platform,
    Image,
    BackHandler,
    StatusBar
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Camera from 'react-native-camera';
import BackButton from '../components/backButton'
import {width, height, isAndroid, isIos , isIphoneX} from '../utils/common_utils'

const IMG_RIGHTUP = require('../assets/img/rightUp.png');
const IMG_RIGHTDOWN = require('../assets/img/rightDown.png');
const IMG_LEFTUP = require('../assets/img/leftUp.png');
const IMG_LEFTDOWN = require('../assets/img/leftDown.png');


export default class Qr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            anim: new Animated.Value(0),
            top: new Animated.Value(0),
        };
        this.interval = null
    }

    startAnimation() {
        if (this.state.show) {
            this.state.anim.setValue(0)
            Animated.timing(this.state.anim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
            }).start(() => this.startAnimation());
        }
    }

    barcodeReceived = (e) => {
        let {goBack, state} = this.props.navigation;
        if (this.state.show) {
            // this.state.show = false;
            this.setState({show: false})
            if (e) {
                let receiveAddressQr = e.data;
                state.params.callback(receiveAddressQr);
                goBack();
            } else {
                Alert.alert(
                    '提示',
                    '扫描失败'
                        [{text: '确定'}]
                )
            }
        }
    }

    componentDidMount() {
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);
        }
        this.startAnimation()
        const that = this
        this.interval =
            setInterval(function () {
                Animated.timing(that.state.top, {
                    toValue: 1,
                    duration: 2200
                }).start(() => that.setState({top: new Animated.Value(0)}))
            }, 2260)
    }

    componentWillUnmount() {
        if (isAndroid) {
            BackHandler.removeEventListener('hardwareBackPress', this._onBackPressed)
        }
        this.setState({
            show: false
        });
        clearInterval(this.interval)
    }

    _onBackPressed = () => {
        let {navigation} = this.props;
        navigation.goBack();
        return true
    }

    _goback = () => {
        this.props.navigation.goBack(null);
    }

    render() {
        return (
            <View style={styles.container}>
                {isIos ? isIphoneX() ?
                    <View style={{height: 88,marginTop:10}}>
                        <View style={{height:10,backgroundColor:'rgba(0,0,0,0.7)',marginTop:30}}></View>
                        <View style={styles.navBarStyle}>
                            <BackButton _onPress={this._goback}></BackButton>
                            <Text style={styles.navTitleStyle}>
                                扫描钱包二维码
                            </Text>
                        </View>
                    </View>
                    :<View style={{height: 70}}>
                        <View style={styles.navBarStyle}>
                            <BackButton _onPress={this._goback}></BackButton>
                            <Text style={styles.navTitleStyle}>
                                扫描钱包二维码
                            </Text>
                        </View>
                    </View>
                    : <View style={styles.navBarStyle}>
                        <BackButton _onPress={this._goback}></BackButton>
                        <Text style={styles.navTitleStyle}>
                            扫描钱包二维码
                        </Text>
                    </View>}
                <StatusBar barStyle="dark-content" translucent={false} backgroundColor={'#fff'}/>
                {isIos ?
                    <RNCamera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        style={styles.preview}
                        onBarCodeRead={this.barcodeReceived.bind(this)}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    >
                        <View
                            style={{
                                height: Platform.OS == 'ios' ? (height - 264) / 3 : (height - 244) / 3,
                                width: width,
                                backgroundColor: '#000000',
                                opacity: 0.5
                            }}>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{
                                height: 265,
                                width: (width - 265) / 2,
                                backgroundColor: '#000000',
                                opacity: 0.5
                            }}></View>
                            <View style={{}}>
                                <View style={styles.itemStyle}>
                                    <Image style={[styles.rectangle, {left: 0, top: 0}]} source={IMG_LEFTUP}>
                                    </Image>
                                    <Image style={[styles.rectangle, {right: 0, top: 0}]} source={IMG_RIGHTUP}>
                                    </Image>
                                    <Image style={[styles.rectangle, {left: 0, bottom: 0}]} source={IMG_LEFTDOWN}>
                                    </Image>
                                    <Image style={[styles.rectangle, {right: 0, bottom: 0}]} source={IMG_RIGHTDOWN}>
                                    </Image>
                                    <Animated.View style={{
                                        width: 265,
                                        height: 1,
                                        backgroundColor: '#ffcb00',
                                        borderRadius: 50,
                                        transform: [{
                                            translateY: this.state.top.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 265]
                                            })
                                        }]
                                    }}/>
                                </View>
                            </View>
                            <View style={{
                                height: 265,
                                width: (width - 265) / 2,
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }}></View>
                        </View>
                        <View style={{
                            flex: 1,
                            width: width,
                            alignItems: 'center',
                            paddingTop: 15,
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                            <Text style={styles.textStyle}>将二维码放入框内,即可自动扫描</Text>
                        </View>
                    </RNCamera> :
                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        style={styles.preview}
                        onBarCodeRead={this.barcodeReceived.bind(this)}
                        barCodeTypes={['qr']}
                    >
                        <View
                            style={{
                                height: Platform.OS == 'ios' ? (height - 264) / 3 : (height - 244) / 3,
                                width: width,
                                backgroundColor: '#000000',
                                opacity: 0.5
                            }}>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{
                                height: 265,
                                width: (width - 265) / 2,
                                backgroundColor: '#000000',
                                opacity: 0.5
                            }}></View>
                            <View style={{}}>
                                <View style={styles.itemStyle}>
                                    <Image style={[styles.rectangle, {left: 0, top: 0}]} source={IMG_LEFTUP}>
                                    </Image>
                                    <Image style={[styles.rectangle, {right: 0, top: 0}]} source={IMG_RIGHTUP}>
                                    </Image>
                                    <Image style={[styles.rectangle, {left: 0, bottom: 0}]} source={IMG_LEFTDOWN}>
                                    </Image>
                                    <Image style={[styles.rectangle, {right: 0, bottom: 0}]} source={IMG_RIGHTDOWN}>
                                    </Image>
                                    <Animated.View style={{
                                        width: 265,
                                        height: 1,
                                        backgroundColor: '#ffcb00',
                                        borderRadius: 50,
                                        transform: [{
                                            translateY: this.state.top.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 265]
                                            })
                                        }]
                                    }}/>
                                </View>
                            </View>
                            <View style={{
                                height: 265,
                                width: (width - 265) / 2,
                                backgroundColor: '#000000',
                                opacity: 0.5
                            }}></View>
                        </View>
                        <View style={{
                            flex: 1,
                            width: width,
                            alignItems: 'center',
                            paddingTop: 15,
                            backgroundColor: '#000000',
                            opacity: 0.5
                        }}>
                            <Text style={styles.textStyle}>将二维码放入框内,即可自动扫描</Text>
                        </View>
                    </Camera>}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    itemStyle: {
        // backgroundColor: 'yellow',
        // opacity:0,
        width: 265,
        height: 265,
        // marginLeft: (width - 265) / 2,
        position: 'relative',
    },
    textStyle: {
        color: '#ffcb00',
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16
    },
    navBarStyle: { // 导航条样式
        marginTop: isIos ? isIphoneX() ? 0 : 20 : 0,
        height: 50,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.8)',
        // 设置主轴的方向
        flexDirection: 'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems: 'center',
    },
    navTitleStyle: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: "center",
        fontFamily: 'PingFangSC-Regular',
        letterSpacing: 2,
        fontWeight: '400',
        width: width - 96
    },
    leftViewStyle: {
        // 绝对定位
        // 设置主轴的方向
        flexDirection: 'row',
        position: 'absolute',
        left: 10,
        bottom: Platform.OS === 'ios' ? 15 : 12,
        alignItems: 'center',
        width: 30
    },
    animatiedStyle: {
        height: 2,
        // backgroundColor: '#00FF00'
    },
    container: {
        flex: 1,
    },
    preview: {
        flex: 1,
    },
    rectangle: {
        height: 15,
        width: 15,
        position: 'absolute'
    }
});