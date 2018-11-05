import React, {Component} from 'react' ;
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    BackHandler, StatusBar
} from 'react-native' ;
import PasswordInput from './passwordInput';

const leftRow = require('../assets/img/leftrow.png');
import {width, isIos, isAndroid, isIphoneX} from "../utils/common_utils";
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            animationType: 'slide',       //none slide fade
            modalVisible: false,        //模态场景是否可见
            transparent: true,         //是否透明显示
        };
    }

    static defaultProps = {
        wallettitle: '',
        LeftFunc: () => {
        },
        showPass: true,
        onEnd: () => {
        },
        transNumberInput: '',
        inAddress: '',
        transToken: '',
        showMiddle: false,
        fee: 0,
        onBlur: () => {
        }
    }

    _update = () => {

    }

    _closeModal = (visible) => {
        console.log("xxxsxsxsxsx", visible);
        // this.setState({
        // 	modalVisible: visible
        // });
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.setState({
            modalVisible: nextProps.showPass
        });
    }

    componentDidUpdate() {

    }

    render() {
        const {
            wallettitle,
            onEnd,
            showMiddle,
            transNumberInput,
            inAddress,
            transToken,
            fee, onBlur
        } = this.props;

        const {modalVisible} = this.state;
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        console.log("xxx", this.state);
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={modalVisible}
                onRequestClose={this.props.onRequestClose}
            >
                <StatusBar barStyle={isAndroid ? 'light-content' : "dark-content"} translucent={false}
                           backgroundColor={isAndroid ? '#000' : '#fff'}/>
                <View style={[styles.containers, modalBackgroundStyle]}>
                    <View style={[styles.password, modalBackgroundStyle]}>
                        <View
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: '#ddd',
                                paddingLeft: 16,
                                paddingRight: 16,
                                height: 50,
                                backgroundColor: '#fff'
                            }}>
                            <View style={{
                                height: 48,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}>
                                <TouchableOpacity style={{paddingRight: 30, height: 48, justifyContent: 'center'}}
                                                  onPress={this.props.LeftFunc}>
                                    <Image source={leftRow} style={{height: 16, width: 8}}></Image>
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        flex: 1,
                                        fontSize: 18,
                                        color: '#030202'
                                    }}>{wallettitle}</Text>
                                <View style={{paddingRight: 30, height: 48, justifyContent: 'center'}}>
                                    <View style={{height: 16, width: 8}}></View>
                                </View>
                            </View>
                        </View>
                        {
                            showMiddle
                                ? <View style={{backgroundColor: '#fff'}}>
                                    <View style={{height: 70, marginTop: 15}}>
                                        <Text style={{
                                            textAlign: 'center',
                                            fontFamily: 'PingFangSC-Medium',
                                            fontSize: 35,
                                            color: '#231815'
                                        }}>
                                            {transNumberInput}
                                        </Text>
                                    </View>
                                    <View style={{flexDirection: 'column', paddingLeft: 16, paddingRight: 16}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={styles.Header}>交易信息</Text>
                                            <Text style={styles.Footer}>转出{transToken}</Text>
                                        </View>
                                        <View
                                            style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                                            <Text style={styles.Header}>手续费用</Text>
                                            <Text style={styles.Footer}>{fee} EKT</Text>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingTop: 10,
                                            paddingBottom: 14
                                        }}>
                                            <Text style={styles.Header}>转入地址</Text>
                                            <Text style={styles.Footer}>{inAddress}</Text>
                                        </View>
                                    </View>
                                </View>
                                : null
                        }
                        <View style={{width: '100%', height: 90, backgroundColor: '#fff', paddingTop: 15}}>
                            <PasswordInput maxLength={6} onEnd={onEnd} onBlur={onBlur}/>
                        </View>
                    </View>
                </View>
                {isIos ? isIphoneX() ? <KeyboardSpacer style={{height: 270}}/> :
                    <KeyboardSpacer style={{height: 210}}/> : null}
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    containers: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    password: {
        backgroundColor: '#fafafa',
        width: '100%',
        flex: 1,
        justifyContent: 'flex-end'
    },
    Header: {
        fontFamily: 'PingFangSC-Light',
        fontSize: 12,
        color: '#7d7d7d'
    },
    Footer: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12,
        color: '#231815',
        width: width - 100
    }
})