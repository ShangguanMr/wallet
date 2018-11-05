import React, {Component} from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    BackHandler,
    ScrollView, FlatList
} from "react-native";
import {dateTrans, width, oldDateTrans, isAndroid} from "../utils/common_utils";

import Labelitem from '../components/labelItem'

const IMG_TRANSITIONSUCCESS = require("../assets/img/success.png");
const IMG_TRANSITIONFAIL = require('../assets/img/fail.png')

class ExDetails extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this._onBackPressed)
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
        let {transType, number, transitionTicket, time, transitionAddressIn, transitionAddressOut, result, notice} = this.props.navigation.state.params;
        return (
            <ScrollView style={{flex: 1, backgroundColor: '#fff'}}
                        showsVerticalScrollIndicator={false}
            >
                <View style={styles.TD}>
                    <View style={styles.TDH}>
                        <Image source={result ? IMG_TRANSITIONSUCCESS : IMG_TRANSITIONFAIL}
                               style={{width: 90, height: 90, marginLeft: (width - 90) / 2}}></Image>
                        <Text style={styles.TDHText}>{transType === '转入' ? '+' : '-'} {number}</Text>
                    </View>
                    <View style={styles.TDF}>
                        <View style={styles.TDFStyle}>
                            <View style={{paddingBottom: 20}}>
                                <Labelitem label='交易类型' value={transType+this.props.navigation.state.params.token}/>
                                <Labelitem label='交易单号' value={transitionTicket}/>
                                <Labelitem label='交易时间' value={oldDateTrans(time)}/>
                            </View>
                        </View>
                        <View style={styles.TDFStyle}>
                            <View style={{paddingBottom: 20}}>
                                <Labelitem label='转入地址' value={'0x' + transitionAddressIn}/>
                                <Labelitem label='转出地址' value={'0x' + transitionAddressOut}/>
                            </View>
                        </View>
                        <View style={styles.TDFAddress}>
                            <View style={{paddingBottom: 20}}>
                                <Labelitem label='备注' value={notice || '无'}/>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default ExDetails;
const styles = StyleSheet.create({
    TD: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    TDH: {
        marginTop: 50,
        width: width
    },
    TDHText: {
        marginTop: 15,
        fontFamily: "PingFangSC-Medium",
        fontSize: 24,
        letterSpacing: 1,
        textAlign: 'center',
        color : '#444444'
    },
    TDF: {
        marginTop: 40,
        borderTopWidth: 1,
        borderTopColor: "#dddddd",
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
        width: width,
        marginBottom: 10
    },
    TDFStyle: {
        marginLeft: 16,
        marginRight: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
        flexDirection: "column",
    },
    TDFAddress: {
        marginLeft: 16,
        marginRight: 16,
    }
});