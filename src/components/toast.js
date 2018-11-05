import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    Dimensions,
    Modal,
    Alert,
    ScrollView, 
    StatusBar,
} from 'react-native';
import {width, height, isIos} from '../utils/common_utils'

export default class toast extends Component {
    constructor(props) {
        super(props)
        this.state = {
            animationType: 'slide',       //none slide fade
            modalVisible: false,        //模态场景是否可见
            transparent: true,         //是否透明显示
            color: '#ffcb00'
        };
    }

    static defaultProps = {
        showToast: false,
        toastTitle: '备份提示',
        btnList: [],
        contentMain: () => {
        },
        showNotice: false,
        showKSNotice:false,
        textAlign: 'center',
        onMomentumScrollEnd: () => {},
        // onScroll : () => {},
        disabled: false,
        color: '#ffcb00'
    }

    _update = () => {

    }

    render() {
        const {toastTitle, showToast, btnList, btnContent, contentMain, showNotice, onMomentumScrollEnd,onScroll, disabled, color,showKSNotice} = this.props;
        console.log('i am in',showToast);
        
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let length = btnList.length;
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={showToast}
                onRequestClose={() => {
                }}
            >
                <StatusBar barStyle={isIos ? "dark-content" : "light-content"} translucent={false}
                           backgroundColor={'#000'}/>
                <View style={[styles.containers, modalBackgroundStyle]}>
                    <View style={[styles.toast, modalBackgroundStyle]}>
                        <View style={styles.toastContainer}>
                            <Text style={styles.titleMain}>
                                {toastTitle}
                            </Text>
                            {
                                !!showNotice
                                    ?
                                    <View style={{
                                        marginLeft: 15,
                                        marginRight: 15,
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={styles.noticeMain}>请手抄私钥并安全保存</Text>
                                        <Text style={styles.noticeMain}>勿将此私钥复制到其他APP或截图</Text>
                                    </View>
                                    : null
                            }
                            {
                                !!showKSNotice
                                    ?
                                    <View style={{
                                        marginLeft: 15,
                                        marginRight: 15,
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={styles.noticeMain}>此 KeyStore 只能用于EKT钱包；</Text>
                                        <Text style={styles.noticeMain}>请将 KeyStore 复制到离线的笔记软件保存；</Text>
                                        <Text style={styles.noticeMain}>请勿截图KeyStore，不要告知任何人。</Text>
                                    </View>
                                    : null
                            }
                            {
                                btnContent !== '' && !!btnContent
                                    ?
                                    <View style={{maxHeight: 400}}>
                                        <ScrollView 
                                            showsVerticalScrollIndicator={false}
                                            ref={(scrollView) => this.scrollView = scrollView}
                                            // onMomentumScrollEnd={onMomentumScrollEnd}
                                            onScroll = { onScroll }
                                        >
                                            <Text style={[styles.titleContent, {textAlign: this.props.textAlign}]}>
                                                {btnContent}
                                            </Text>
                                        </ScrollView>
                                    </View>
                                    : contentMain()
                            }
                            <View style={styles.btnBottom}>
                                <View style={styles.btnList}>
                                    {
                                        btnList.map((ele, index) => {
                                            return (
                                                <TouchableHighlight
                                                    onPress={ele['pressFn']}
                                                    key={index}
                                                    activeOpacity={0.4}
                                                    underlayColor={"#ffffff"}
                                                    disabled={disabled}
                                                    style={{
                                                        height: 53,
                                                        borderLeftWidth: index === 1 ? 1 : 0,
                                                        borderLeftColor: '#dddddd'
                                                    }}>
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            color: color,
                                                            lineHeight: 53,
                                                            width: 0.8 * width / length ,
                                                            maxWidth : 300/length
                                                        }}
                                                    >{ele.btnTitle}</Text>
                                                </TouchableHighlight>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    containers: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    toast: {
        backgroundColor: '#ffffff',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    toastContainer: {
        width: width * 0.8,
        backgroundColor: '#ffffff',
        borderRadius: 8 ,
        maxWidth : 300
    },
    titleMain: {
        fontSize: 16,
        marginTop: 18,
        marginBottom: 10,
        textAlign: 'center',
        color: '#333333'
    },
    noticeMain: {
        lineHeight: 15,
        textAlign: 'center',
        color: 'red',
        fontSize: 12,
        fontWeight: 'bold'
    },
    titleContent: {
        marginLeft: 10,
        marginRight: 10,
        lineHeight: 19,
        marginTop: 10,
        color: '#444444',
        // backgroundColor : 'red'
    },
    btnBottom: {
        height: 53,
        marginTop: 22,
        borderTopWidth: 1,
        borderTopColor: '#dddddd',
    },
    btnList: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})