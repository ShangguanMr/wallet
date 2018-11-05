import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    StatusBar,
    Linking
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

import MyWallet from './layouts/wallet/index';
import Me from './layouts/me/index';
import ToastBanner from './components/toastBanner';

const myWallet = require('./assets/img/mywallet.png');
const myWalletAc = require('./assets/img/mywalletac.png');
const meLogo = require('./assets/img/me.png');
const meLogoAc = require('./assets/img/meactive.png');
import {getStorage, resetNavigation, isIphoneX,toQueryParams, isIos} from "./utils/common_utils";

let address;
let privkey;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'MyWallet',
            showToast : false,
        }
    }

    async componentDidMount() {
        address = await getStorage('address') || '';
        privkey = await getStorage('privkey') || '';
        let {showToast} = this.props.navigation.state.params||false;
        this.setState({showToast:showToast});
    }

    componentWillUnmount() {
        address = "";
        privkey = "";
    }

    icons = {
        Home: {
            default: (
                <Image
                    style={styles.image}
                    source={myWallet}
                />
            ),
            selected: <Image
                style={styles.image}
                source={myWalletAc}
            />
        },
        Me: {
            default: (
                <Image
                    style={styles.image}
                    source={meLogo}
                />
            ),
            selected: (
                <Image
                    style={styles.image}
                    source={meLogoAc}
                />
            )
        }
    }

    _home = () => {
        return (
            <TabNavigator>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'MyWallet'}
                    renderIcon={() => this.icons.Home.default}
                    renderSelectedIcon={() => this.icons.Home.selected}
                    onPress={() => {
                        this.setState({selectedTab: 'MyWallet'})
                    }}
                >
                    <MyWallet nav={this.props.navigation}/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'Me'}
                    renderIcon={() => this.icons.Me.default}
                    renderSelectedIcon={() => this.icons.Me.selected}
                    onPress={() => this.setState({selectedTab: 'Me'})}
                >
                    <Me nav={this.props.navigation}/>
                </TabNavigator.Item>
            </TabNavigator>
        )
    }

    _know =() => {
        this.setState({showToast:false})
    }

    _go = () => {
        this.setState({showToast:false,selectedTab:'Me'})
    }
    render() {
        let {showToast} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#ffffff'}}>
                <StatusBar barStyle={isIos?"dark-content":'light-content'}/>
                {this._home()}
                {isIphoneX() ? <View style={{height: 20}}></View> : null}
                <ToastBanner showToast={showToast} go={this._go} know={this._know}/>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    onLaunch: {
        backgroundColor: '#000',
        height: '100%',
        position: 'relative'
    },
    bottomSign: {
        position: 'absolute',
        bottom: 10,
        width: '100%'
    },
    bottomImg: {
        width: 20,
        height: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 7
    },
    image: {
        width: 30,
        height: 30
    }
});


export default App;
