import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Modal,
	StatusBar,
	Image,
	ImageBackground
} from 'react-native';
import {width, height, isIos} from '../utils/common_utils'

export default class ToastBanner extends Component {
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
		go : () => {},
		know : () => {}
	}

	_update = () => {

	}

	render() {
		const {showToast,go,know} = this.props;
		let modalBackgroundStyle = {
			backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
		};
		return (
			<Modal
				animationType={this.state.animationType}
				transparent={this.state.transparent}
				visible={showToast}
				onRequestClose={() => {
				}}
			>
				<StatusBar barStyle={isIos ? "dark-content" : "light-content"} translucent={false} backgroundColor={'#000'}/>
				<View style={[styles.containers,modalBackgroundStyle]}>
					<View style={styles.contain}>
							<ImageBackground source={require('../assets/img/toastbanner.png')} style={styles.headerPng} />
							<Text style={styles.title}>EKT主网币兑换</Text>
							<View style={styles.text}>
								<Text style={styles.textone}>本钱包只可存储 EKT 主网币。</Text>
								<Text style={styles.texttwo}>通过“我”-“兑换EKT主网币”功能，可以将您存放在“交易所”或“以太坊钱包”内的 EKT Erc20 代币，转换为 EKT 主网币哦～</Text>
							</View>
							<View style={styles.button}>
								<TouchableOpacity style={styles.buttonGo} onPress={go}>
									<Text style={styles.buttonGoText}>去看看</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.buttonKnow} onPress={know}>
									<Text style={styles.buttonKnowText}>知道了</Text>
								</TouchableOpacity>
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
	contain:{
		borderRadius:5,
		width : 310 ,
		backgroundColor:'#fff',
		overflow:'hidden',
		alignItems:'center'
	},
	headerPng : {
		width : 310 ,
		height : 130 ,
	},
	title:{
		marginTop:20,
		fontSize:22,
		fontFamily:'PingFangSC-Medium',
		color:'rgb(51,51,51)'
	},
	texttwo:{
		fontSize:13,
		fontFamily:'PingFangSC-Regular',
		color:'rgb(255,77,52)',
		lineHeight:23,
		textAlign:'left',
		marginHorizontal: 20
	},
	textone : {
		marginTop: 10,
		fontSize:13,
		fontFamily:'PingFangSC-Regular',
		color:'rgb(255,77,52)',
		lineHeight:23,
		width : '100%',
		marginHorizontal: 20
	},
	button:{
		flexDirection:'row',
		justifyContent:'center',
		marginBottom:20,
		marginTop:30,
	},
	buttonGo:{
		backgroundColor:'rgb(255,203,0)',
		borderColor: 'rgb(255,203,0)',
		borderRadius:5,
		borderWidth:1
	},
	buttonGoText:{
		width:104,
		height:35,
		lineHeight:35,
		textAlign:'center',
		color:'#fff',
		fontSize:16,
		fontFamily:'PingFangSC-Medium'
	},
	buttonKnow:{
		borderColor: 'rgb(255,203,0)',
		borderRadius:5,
		borderWidth:1,
		marginLeft:30
	},
	buttonKnowText:{
		width:104,
		height:35,
		lineHeight:35,
		textAlign:'center',
		color:'rgb(255,203,0)',
		fontSize:16,
		fontFamily:'PingFangSC-Regular'
	}
})