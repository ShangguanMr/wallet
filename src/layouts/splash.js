import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    StatusBar,
    NativeModules
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {height, width, navigationResetTo, getStorage, resetNavigation, isIos, isAndroid} from '../utils/common_utils'
import {toastShort} from '../utils/ToastUtil';

const launchgif = require('../assets/img/toplaunch.gif');
const logo = require('../assets/img/logo.png');

export default class Launch extends Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        SplashScreen.hide();
        let address = await getStorage('address') || '';
        let privkey = await getStorage('privkey') || '';
        let {navigation} = this.props;
        if (!!address && !!privkey) {
            setTimeout(() => {
                this.props.navigation.dispatch(resetNavigation(0, "WakeUp", {
                    addressEKT: address,
                    privkey: privkey
                }))
            }, 500)
        } else {
            setTimeout(() => {
                this.props.navigation.dispatch(resetNavigation(0, 'CreateWallet'))
            }, 500)
        }

    }

    welcome = () => {
        return (
            <View style={[styles.onLaunch,]}
                  needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
                <StatusBar barStyle={'light-content'} translucent={true} backgroundColor={'transparent'}/>
                <View style={{height:height}}>
                <ImageBackground
                    source={launchgif}
                    style={{width: 375, height: 150, marginTop: 160}}/>
                <View style={styles.bottomSign}>
                    <ImageBackground
                        source={logo}
                        style={styles.bottomImg}/>
                    <Text style={{color: '#7d7d7d', textAlign: 'center', fontSize: 8}}>Copyright © 2018 EKT版权所有</Text>
                </View>
                </View>
            </View>
        )
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View>
                {this.welcome()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    onLaunch: {
        backgroundColor: '#000',
        position: 'relative',
        // justifyContent : 'center',
        alignItems: 'center'
    },
    bottomSign: {
        position: 'absolute',
        bottom: 15,
        width: '100%'
    },
    bottomImg: {
        width: 20,
        height: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 7
    },
    // iosStyle: {
    //     height: height
    // },
    // androidStyle: {
    //     flex: 1
    // }
});
