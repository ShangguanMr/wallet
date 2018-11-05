import React, {Component} from 'react';
import {
    I18nManager,
    AsyncStorage,
    BackHandler,
    ToastAndroid,
    AppState,
    StyleSheet
} from 'react-native';

import {Provider} from "react-redux";
import configureStore from './store/configer'
global.store = configureStore();
import Storage from 'react-native-storage'
var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})
global.storage = storage;
console.disableYellowBox = true;
if (!__DEV__) {
    global.console = {
        info: () => {
        },
        log: () => {
        },
        warn: () => {
        },
        debug: () => {
        },
        error: () => {
        }
    };
}
import {
    StackNavigator,
    NavigationActions
} from "react-navigation";

import getSceneIndicesForInterpolationInputRange
    from 'react-navigation/src/utils/getSceneIndicesForInterpolationInputRange'

import App from "./App";
import AboutUs from "./layouts/aboutUs";
import AssetDetails from "./layouts/assetDetails";
import CreateSuccess from "./layouts/createSuccess";
import MyWallet from "./layouts/wallet/index";
import Me from "./layouts/me/index";
import CurrencyList from "./layouts/currencyList";
import ExDetails from "./layouts/exDetails";
import ExEkt from "./layouts/exEkt";
import ExETH from './layouts/exETH'
import InPk from "./layouts/inPk";
import Splash from "./layouts/splash";
import Qr from "./layouts/qr";
import CreateWallet from "./layouts/createWallet";
import WakeUp from "./layouts/wakeUp";
import Setting from "./layouts/me/setting";
import ChangePas from './layouts/changePas' ;
import SetPass from './layouts/setPass'
import SendoutCoin from './layouts/sendoutCoin';
import SendTransation from './layouts/sendTransation';
import BackButton from './components/backButton';
import UseServe from './layouts/useServe';
import {getStorage, resetNavigation, width, getNetWorkState} from "./utils/common_utils";

const StackOptions = ({navigation, backgroundColor = '#ffffff', color = '#231815', backRouter = null, borderBottomWidth = StyleSheet.hairlineWidth*2}) => {
    let {state, goBack} = navigation;
    const headerStyle = {
        backgroundColor: backgroundColor,
        borderBottomWidth: borderBottomWidth,
        elevation: 0,
        borderBottomColor: '#ddd'
    };
    const headerTitle = state.params ? state.params.headerTitle : null;
    const headerTitleStyle = {
        color: color,
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 2,
        fontWeight: '400',
        fontFamily: 'PingFangSC-Regular',
        width: width - 96 - width * 2 / 15
    };
    const headerBackTitle = null;
    const headerLeft = (
        <BackButton _onPress={() => {
            goBack(backRouter);
        }}></BackButton>
    );
    const gesturesEnabled = true;
    const headerMode = 'float';
    return {
        headerStyle,
        headerTitle,
        headerTitleStyle,
        headerLeft,
        headerBackTitle,
        gesturesEnabled,
        headerMode
    }
}

//以后好扩展（写成类的格式）
class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onExitApp);
        await getNetWorkState();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onExitApp)
    }

    onExitApp = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            BackHandler.exitApp();
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    };

    render() {
        return (<Provider store={global.store}>
            <RootStack/>
        </Provider>)
    }
}

const RootStack = StackNavigator(
    {
        Splash: {
            screen: Splash,
            navigationOptions: {
                header: null
            }
        },
        App: {
            screen: App,
            navigationOptions: {
                header: null
            },
        },
        MyWallet: {
            screen: MyWallet,
            navigationOptions: {
                header: null
            },
        },
        Me: {
            screen: Me,
            navigationOptions: {
                header: null
            },
        },
        AboutUs: {
            screen: AboutUs,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
            })
        },
        AssetDetails: {
            screen: AssetDetails,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        CreateSuccess: {
            screen: CreateSuccess,
        },
        CreateWallet: {
            screen: CreateWallet,
            navigationOptions: {
                header: null
            }
        },
        CurrencyList: {
            screen: CurrencyList,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        ExDetails: {
            screen: ExDetails,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        ItemDeExEkttail: {
            screen: ExEkt,
            navigationOptions: ({navigation}) => StackOptions({navigation})

        },
        ExETH: {
            screen: ExETH,
            navigationOptions: ({navigation}) => StackOptions({navigation})

        },
        Qr: {
            screen: Qr,
            navigationOptions: {
                header: null
            }
        },
        WakeUp: {
            screen: WakeUp,
            navigationOptions: {
                header: null
            }
        },
        Setting: {
            screen: Setting,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        InPk: {
            screen: InPk,
            navigationOptions: ({navigation}) => StackOptions({navigation, borderBottomWidth: 1})
        },
        ChangePas: {
            screen: ChangePas,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        SetPass: {
            screen: SetPass,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        SendoutCoin: {
            screen: SendoutCoin,
        },
        SendTransation: {
            screen: SendTransation,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        UseServe: {
            screen: UseServe,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
    },
    {
        initialRouteName: 'Splash',
        transitionConfig: () => ({
            screenInterpolator: sceneProps => {
                const {layout, position, scene} = sceneProps;

                const interpolate = getSceneIndicesForInterpolationInputRange(sceneProps);

                if (!interpolate) return {
                    opacity: 0
                };

                const {first, last} = interpolate;
                const index = scene.index;
                const opacity = position.interpolate({
                    inputRange: [first, first + 0.01, index, last - 0.01, last],
                    outputRange: [0, 1, 1, 0.85, 0],
                });

                const width = layout.initWidth;
                const translateX = position.interpolate({
                    inputRange: [first, index, last],
                    outputRange: I18nManager.isRTL
                        ? [-width, 0, width * 0.3]
                        : [width, 0, width * -0.3],
                });
                const translateY = 0;

                return {
                    opacity,
                    transform: [{translateX}, {translateY}],
                };
            },
        })
    }
);

export default Navigation;
