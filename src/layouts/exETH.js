import React, {Component} from "react";
import {
    StyleSheet,
    Clipboard,
    View,
    Text,
    TouchableHighlight,
    StatusBar,
    BackHandler
} from "react-native";
import QRCode from "react-native-qrcode";
import {getStorage, isAndroid, isIos, width, setStorage} from '../utils/common_utils'
import {toastShort} from "../utils/ToastUtil";
import Toast from '../components/toast'
import {getETHAddress} from "../reducers/actions/me/me";
import {connect} from 'react-redux';

class exETH extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count : 2,
            showNotice: true,
            showToast : false,
            noticeTitle: '重要告知',
            noticeText: '1.  通过此功能，可以将目前在以太坊上发行的 EKT ，兑换为 EKT 主网币， 兑换不收取任何手续费。\n\n2.  本次兑换我们会给你的 EKT钱包 生成一个以太坊地址。当您将以太坊上发行的 EKT 转入此地址后，EKT钱包会自动为您兑换 EKT 主网币。\n\n3.  此以太坊地址只可转入在以太坊上发行的 EKT ，请勿转入其他币种，否则会丢失。\n\n4.  EKT团队，暂时还未在交易所进行 EKT 主网映射，只有 EKT 钱包可以进行兑换，请勿相信别的渠道会为您转换 EKT 主网币，谨防被骗。\n\n5.  因交易所暂未做映射，因此 EKT 主网币暂时不可以提至交易所。只可在 EKT 钱包之间互转， 或参与锁仓计划。\n\n6.  点击我已知晓，可进行兑换 EKT 主网币操作。当您点击我已知晓按钮后，即代表您已阅读、并同意此告知的全部内容及风险。',
            toastList1: [{
                pressFn: this._hideToast,
                btnTitle: '我已知晓并同意'
            }],
            toastList2: [{
                pressFn: this._hideToast,
                btnTitle: '关闭'
            }],
            disabled: true,
            color: '#dddddd'
        }
    }

    _hideToast = () => {
        setStorage('count',2)
        this.setState({showNotice: false,showToast:false,count:2})
    }

    _setContent() {
        try {
            let addressETH = this.props.ETHdata.result;
            Clipboard.setString('0x' + addressETH)
            toastShort('复制成功！');
        } catch (e) {
            toastShort('复制失败！')
        }
    }

    _showNotice = () => {
        this.setState({
            showToast: true
        })
    }

    async componentDidMount() {
        let count = await getStorage('count');
        if(count){
            this.setState({count:count,showNotice:false});
        }else{
            setStorage('count',1);
            this.setState({count:1});
        }
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);
        }
        let address = await getStorage('address') || '';
        let params = {};
        params['address'] = address;
        if (address) {
            this.props.dispatch(getETHAddress(params));
        }

    }

    componentWillUnmount() {
        if (isAndroid) {
            BackHandler.removeEventListener('hardwareBackPress', this._onBackPressed)
        }
        this._hideToast();
    }

    _onBackPressed = () => {
        let {navigation} = this.props;
        navigation.goBack();
        return true
    }

    onMomentumScrollEnd = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y;
        let contentSizeHeight = e.nativeEvent.contentSize.height;
        let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height;
        if (offsetY + oriageScrollHeight >= contentSizeHeight) {
            this.setState({
                disabled: false,
                color: '#ffcb00'
            })
        }
    }

    _onScroll = (e) => {
        let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        if (offsetY > 15) {
            this.setState({
                disabled: false,
                color: '#ffcb00'
            })
        }
    }

    render() {
        let addressETH = this.props.ETHdata.result;
        let {showNotice, noticeText, noticeTitle, toastList1, toastList2, disabled, color,count,showToast} = this.state;
        console.log(count,showNotice,showToast,);
        
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" translucent={false} backgroundColor={'#fff'}/>
                <QRCode
                    value={'0x' + addressETH}
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
                        {'0x' + addressETH}
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
                <TouchableHighlight
                    style={styles.btn2}
                    onPress={() => this._showNotice()}
                    underlayColor={'#ffcb00'}>
                    <Text style={styles.btnText1}>
                        重要告知
                    </Text>
                </TouchableHighlight>
                <Toast showToast={count===1?showNotice:showToast} btnList={count === 1 ? toastList1 : toastList2} toastTitle={noticeTitle}
                       btnContent={noticeText} textAlign={'left'}
                       onMomentumScrollEnd={count === 1 ? this.onMomentumScrollEnd : () => {
                       }} disabled={count === 1 ? disabled : false} color={count === 1 ? color : '#ffcb00'}
                       onScroll={this._onScroll}></Toast>
            </View>
        );
    }

}

function mapStatetoProps(state) {
    let {ETHdata} = state.me;
    return {ETHdata}
}

export default connect(mapStatetoProps)(exETH)
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
        maxWidth: 325,
        width: width - 32,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#fed853',
        backgroundColor: '#fed853'
    },
    btn2: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: 45,
        width: 100,
        position: 'absolute',
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        borderWidth: 1,
        borderColor: '#fed853',
        backgroundColor: '#fed853',
        right: -10,
        top: 0
    },
    btnText1: {
        fontSize: 14,
        color: '#231815'
    },
});