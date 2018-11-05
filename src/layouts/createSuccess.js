import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Clipboard,
    TouchableOpacity,
    WebView,
    Platform,
    BackHandler, 
    StatusBar
} from "react-native";
import Toast from '../components/toast';
import {isAndroid, resetNavigation, setStorage, width} from '../utils/common_utils'
import BackButton from '../components/backButton'
import {getTransactionList} from "../utils/savedata";
import {toastShort} from "../utils/ToastUtil";

let count = 1;

export default class createSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pressTextToast: '备份提示',
            pressText: "备份私钥匙",
            myToken: '我的私钥',
            btnContent: '私钥是钱包资产唯一的恢复方式，私钥一旦丢失，无法找回，无法恢复资产。请手抄私钥并安全保存，勿将此私钥复制到其他APP或截图。不要将该私钥告知任何人。',
            toastList: [
                {pressFn: this._hideToast, btnTitle: '我已知晓'}
            ],
            tokenList: [
                {pressFn: this._hideKey.bind(this), btnTitle: '复制文本'}
            ],
            showToast: false,
            showToken: false,

            showBackUp: true,

            password: ''
        };
    }

    componentWillMount() {
        getTransactionList();
        this.props.navigation.setParams({
            navigatePress: this.navigatePress,
        });
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this.navigatePress);
        }
    }

    componentWillUnmount() {
        if (isAndroid) {
            BackHandler.removeEventListener('hardwareBackPress', this.navigatePress);
        }
        count = 1;
    }

    navigatePress = () => {
        let {showBackUp} = this.state;
        setStorage('showBackUp', showBackUp)
        let {privkey, addressEKT} = this.props.navigation.state.params;
            this.props.navigation.dispatch(resetNavigation(0, 'App', {
                addressEKT: addressEKT,
                privkey: privkey,
                showToast:true
            }))
        return true;
    }
    _hideToast = () => {
        this.setState({
            showToast: false,
            showToken: true
        })
    };
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params ? navigation.state.params.headerTitle : null,
        headerLeft: (
            <BackButton _onPress={navigation.state.params ? navigation.state.params.navigatePress : null}></BackButton>
        ),
        headerTitleStyle: {
            color: '#231815',
            fontSize: 18,
            textAlign: 'center',
            letterSpacing: 2,
            fontWeight: '400',
            fontFamily: 'PingFangSC-Regular',
            width: width - 96 - width * 2 / 15
        },
        headerBackTitle: null,
        headerTitle: '备份钱包',
        headerStyle: {
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            elevation: 0,
            borderBottomColor: '#dddddd'
        },
    });

    contentFn = (key) => {
        return (
            <View style={{
                backgroundColor: '#ffffff',
                marginLeft: 5,
                marginRight: 5,
                paddingLeft: 5,
                paddingRight: 5,
                paddingTop: 10,
                paddingBottom: 10
            }}>
                <Text style={{lineHeight: 17, color: '#444444'}}>{key}</Text>
            </View>
        )
    }

    async _hideKey() {
        try {
            let {privkey} = this.props.navigation.state.params;
            Clipboard.setString(privkey);
            count++;
            this.setState({
                showToken: false,
            });
            toastShort('复制成功！')
        } catch (e) {
            this.setState({
                showToken: false
            });
            toastShort("备份失败，请重试！")
        }
    }

    noticeBackup() {
        this.setState({
            showToast: true,
            showBackUp: false,
        })
    }

    render() {
        let {showToast, showToken, toastList, tokenList, pressText, myToken, btnContent, pressTextToast, showBackUp} = this.state;
        let {privkey, addressEKT} = this.props.navigation.state.params;
        return (
            <View style={styles.successCreate}>
                <StatusBar barStyle="dark-content" translucent={false} backgroundColor={'#fff'}/>
                <Image style={styles.successCreateImage} source={require("../assets/img/success.png")}></Image>
                <Text style={styles.successText}>钱包创建成功</Text>
                <Text style={styles.noticeAgain}>请备份钱包私钥，方便找回资产</Text>
                {count !== 2 ? <TouchableHighlight
                        style={styles.backUp}
                        onPress={this.noticeBackup.bind(this)}
                        underlayColor={"#ffffff"}
                    >
                        <Text style={styles.backUpText}>{pressText}</Text>
                    </TouchableHighlight>
                    :
                    <TouchableHighlight
                        style={styles.backUp}
                        onPress={() => {
                            this.props.navigation.dispatch(resetNavigation(0, 'App', {
                                addressEKT: addressEKT,
                                privkey: privkey,
                                showToast: true
                            }))
                        }}
                        underlayColor={"#ffffff"}
                    >
                        <Text style={styles.backUpText}>{'我已完成备份'}</Text>
                    </TouchableHighlight>}
                <Toast showToast={showToast} btnList={toastList} toastTitle={pressTextToast}
                       btnContent={btnContent} textAlign={'left'}></Toast>
                <Toast showToast={showToken} btnList={tokenList} toastTitle={myToken}
                       contentMain={this.contentFn.bind(this, privkey)} showNotice={true} textAlign={'left'}></Toast>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    successCreate: {
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#ffffff"
    },
    successCreateImage: {
        width: 90,
        height: 90,
        marginTop: 50
    },
    successText: {
        marginTop: 15,
        fontSize: 16,
        color: "#ffcb00",
        fontFamily: "PingFangSC-Regular"
    },
    noticeAgain: {
        marginTop: 30,
        fontSize: 14,
        color: "#231815",
        fontFamily: "PingFangSC-Regular"
    },
    backUp: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        height: 45,
        maxWidth : 343,
        width : width -32,
        marginTop: 35,
        borderRadius: 40,
        backgroundColor: "#ffcc33"
    },
    backUpText: {
        color: "#231815",
        fontFamily: "PingFangSC-Regular",
        fontSize: 16
    }
});
