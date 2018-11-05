import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    BackHandler
} from 'react-native';
import {height, isAndroid, width , isIphoneX} from '../utils/common_utils'


export default class useServe extends Component {

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
        return (
            <View style={{backgroundColor: '#fff', flex: 1, width: width}}>
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    <View style={{marginLeft: 16, marginRight: 16, flex: 1}}>
                        <Text style={styles.title}>《EKT钱包使用协议》</Text>
                        <Text
                            style={[styles.text, {marginTop: 16}]}>{'EduCare基金会（以下简称“基金会”或“我们”）在此特别提醒您（用户）在使用EKT钱包（以下简称“EKT钱包” 或“本软件”）之前，请认真阅读《EKT钱包使用协议》（以下简称“本协议”），确保您充分理解本协议中的各条款，包括免除基金会在线责任的条款制用户权利的条款。请您审慎阅读并选择接受或不接受本协议。除非您接受本协议所有条款，否则您使用本协议所涉服务，其使用行为将视为对本协议的接受，并同意接受本协议各项条款的约束。'}</Text>
                        <Text
                            style={[styles.text, {marginTop: 16}]}>{'本协议约定基金会与用户之间关于“基金会”软件服务（以下简称“服务”）的权利义务。“用户”是指使用本服务的个人。本协议可由基金会在线随时更新， 更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知。在基金会修改协议条款后，如果用户不接受修改后的条款，请立即停止使用基金会提供的服务，用户继续使用基金会的服务将被视为接受修改后的协议。'}</Text>
                        <Text style={[styles.h1]}>一、使用规则</Text>
                        <Text
                            style={[styles.text, {marginTop: 15}]}>{'1、用户需从官方渠道下载安装基金会提供的“EKT钱包”软件（App）；\n2、用户可以使用EKT钱包的转账、收款功能进行数字货币交易；\n3、用户可以使用EKT钱包创建基于EKT公链系统开发的Token;\n4、用户可以使用EKT钱包添加或移除基金会所提供的数字资产（EKT除外）；\n5、用户应谨慎使用删除钱包、导出私钥等功能，一旦删除，无法还原。'}</Text>
                        <Text style={[styles.h1]}>二、用户账户安全</Text>
                        <Text
                            style={[styles.text, {marginTop: 15}]}>{'1、用户的钱包密码由用户自己来负责，用户不应将自己的密码告诉其他第三者；\n2、用户应妥善保管好自己的钱包密基金会及私钥，一旦泄露或遗失，导致钱包不能使用或资产遗失，基金会概不负责；\n3、用户如果遇到任何账户安全问题，可联系基金会客服，寻求帮助和在线咨\n4、如果因基金会临时中断业务而导致用户钱包丢失，基金会会给予丢失数据的用户相应的补偿，具体补偿方式由基金会决定。但因不可抗力导致的业务中断发生时，基金会不给予用户补偿；基金会临时中断业务时，将会以消息推送方式告知用户；\n5、当EKT钱包用户发生如下情况时，基金会可单方面终止本协议，取消用户继续使用EKT钱包产品的资格：'}</Text>
                        <Text
                            style={[styles.text, {marginLeft: 20}]}>{'(1)用户死亡；\n' + '(2)盗用他人的钱包信息或手机；\n' + '(3)以非法手段(包括且不限于黑客攻击等)来谋取不正当利益；\n' + '(4)妨碍其他用户正常使用；\n' + '(5)伪称基金会的工作人员或管理人员；\n' + '(6)擅自强行更改基金会的计算机系统, 或威胁侵入系统；\n' + '(7)利用基金会的产品及服务宣传垃圾广告；\n' + '(8)其他违反本协议的行为以及违法行为；'}</Text>
                        <Text style={[styles.text, {fontSize: 10}]}>*{'用户如因上述问题而被取消使用资格, 可向基金会提出书面申请。'}</Text>
                        <Text style={[styles.h1]}>三、用户个人隐私信息保护</Text>
                        <Text
                            style={[styles.text, {marginTop: 15}]}>{'基金会在未经用户同意, 不向任何第三方公开、透露用户的个人隐私信息。但以下特定情形除外：'}</Text>
                        <Text
                            style={[styles.text, {marginLeft: 10}]}>{'1、基金会根据法律法规规定或有权机关的指示提供用户的个人账户信息；\n2、由于用户将其钱包密码或私钥等信息告知他人，由此导致的任何个人账户信息的泄漏，或其他非因基金会原因导致的个人账户信息的泄露；\n3、用户自行向第三方公开其个人隐私信息；\n4、任何由于黑客攻击、电脑病毒侵入及其他非因基金会原因导致用户个人隐私信息的泄露。\n5、用户同意基金会可在以下事项中使用用户的个人隐私信息：'}</Text>
                        <Text
                            style={[styles.text, {marginLeft: 20}]}>{'（1）向用户及时发送重要通知，如软件更新、本协议条款的变更；\n（2）基金会内部进行审计、数据分析和研究等，以改进基金会的产品、服务和与用户之间的沟通；依本协议约定，基金会管理、审查用户信息及进行处理措施；\n（3）适用法律法规规定的其他事项。'}</Text>
                        <Text style={[styles.h1]}>四、用户使用规范</Text>
                        <Text style={[styles.text, {marginTop: 15}]}>{'EKT钱包用户不得利用基金会产品提供的服务进行如下行为：'}</Text>
                        <Text
                            style={[styles.text, {marginLeft: 20}]}>{'1、侵害基金会以及第三者的知识产权；\n2、提交、发布虚假信息，或盗用他人资料，冒充、利用他人名义；\n3、其他不遵守本协议的行为；\n4、其他违法以及不正当的行为。'}</Text>
                        <Text style={[styles.h1]}>五、免责条款</Text>
                        <Text
                            style={[styles.text, {marginTop: 15}]}>{'1、基金会提供的服务中包括数字货币的当前价格信息, 用户若通过基金会提供的显示货币信息服务进行交易等操作行为造成的资产亏损, 基金会不承担任何责任。\n2、用户若因个人原因遗忘私钥, 删除遗失钱包, 导致资产丢失, 基金会不承担任何责任。'}</Text>
                        <Text style={[styles.h1]}>六、其他</Text>
                        <Text
                            style={[styles.text, {marginTop: 15}]}>{'1、基金会郑重提示用户注意本协议中免除基金会责任和限制用户权利的条款，请用户仔细阅读，自主考虑风险。\n2、未成年人应在法定监护人的陪同下阅读本协议。\n3、本协议的效力、解释及纠纷的解决,适用于中华人民共和国法律。若用户和基金会之间发生任何纠纷或争议， 首先应友好协商解决，协商不成的，用户同意将纠纷或争议提交基金会住所地有管辖权的人民法院管辖。\n4、本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。\n5、本协议的版权由基金会所有，基金会保留一切解释和修改的权力。\n6、本协议从2018年9月1日起适用。'}</Text>
                        <Text style={[styles.text, {
                            fontWeight: 'bold',
                            fontSize: 13,
                            marginTop: 15
                        }]}>本协议未尽事宜，您需遵守基金会不时更新的公告及相关规则。</Text>
                        <Text style={{fontSize: 14, textAlign: 'right', marginTop: 10}}>EduCare基金会</Text>
                        <Text style={{
                            fontSize: 14,
                            textAlign: 'right',
                            marginTop: 10,
                            paddingBottom: isIphoneX() ? 40 : 20
                        }}>2018年8月24日</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 24,
        marginTop: 16,
        fontWeight: 'bold',
        flex: 1
    },
    h1: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 15,
    },
    text: {
        fontSize: 12,
        lineHeight: 16,
        flex: 1
    }
});


