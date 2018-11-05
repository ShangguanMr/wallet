import React, {Component} from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableHighlight,
	Platform,
	TouchableWithoutFeedback,
	Keyboard, 
	BackHandler, 
	StatusBar,
	NativeModules
} from "react-native";
import Toast from '../components/toast'
import {setStorage, resetNavigation, getStorage, isAndroid, isIos} from '../utils/common_utils'
import {toastShort} from '../utils/ToastUtil';

export default class inPk extends Component {
	constructor(props) {
		super(props);
		this.state = {
			unableClick: {
				backgroundColor: "#ffffff",
				borderColor: "#b7b7b7",
				color: "#b7b7b7",
				disabled: true,
			},
			enableClick: {
				backgroundColor: "#fed853",
				borderColor: "#fed853",
				color: "#231815",
				disabled: false,
			},

			walletPk: '',
			token: '',
			addressEKT: '',

			inPath: '',

			showDiffPriv: false,
			pressText: '提示',
			DiffPrivBtnList: [
				{
					pressFn: () => {
						this.setState({showDiffPriv: false})
					}, btnTitle: '请重新输入'
				}
			],
			DiffPrivBtnContent: '私钥错误'
		};
	}

	componentWillMount() {
		if (isAndroid) {
			BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);
		}
	}

	componentWillUnmount() {
		if (isAndroid) {
			BackHandler.removeEventListener('hardwareBackPress', this._onBackPressed)
		}
		this.setState({walletPk: ''})
	}

	_onBackPressed = () => {
		let {navigation} = this.props;
		navigation.goBack();
		return true
	}

	async inPathFrom() {
		let {walletPk} = this.state;
		let rg = /^[0-9a-fA-F]{64}$/
		if (rg.test(walletPk)) {
			let {inPath, privkey, addressEKT} = this.props.navigation.state.params;
			console.log('===', inPath, typeof (inPath), walletPk, privkey, privkey === walletPk)
			switch (inPath) {
				case 'changePas':
					if (privkey === walletPk) {
						this.props.navigation.navigate('SetPass', {
							headerTitle: '设置钱包',
							addressEKT: addressEKT,
							inPath: inPath,
							privkey:privkey||walletPk
						})
					} else {
						this.setState({
							showDiffPriv: true
						})
					}
					;
					break;
				case 'wakeUp':
					let privkeyStorage = await getStorage('privkey') || '';
					if (privkeyStorage === walletPk) {
						this.props.navigation.navigate('SetPass', {
							headerTitle: '设置钱包',
							addressEKT: addressEKT,
							inPath: inPath,
							privkey: walletPk
						})
					} else {
						this.setState({
							showDiffPriv: true
						})
					}
					;
					break;
				case 'createWallet': {
					if(isAndroid){
						NativeModules.MyNativeModule.inPKaddress(walletPk,(res)=>{
							let data = res.toLowerCase();
							let {inPath} = this.props.navigation.state.params;
							setStorage("address", data);
							setStorage("privkey", walletPk);
								setStorage('showBackUp', false)
								this.props.navigation.navigate('SetPass', {
									headerTitle: '设置钱包',
									showBackUp: false,
									addressEKT: data,
									privkey: this.state.walletPk,
									inPath: inPath
								})
							})
					}else if(isIos){
						NativeModules.MyNativeModule.inPKaddress((walletPk),(res)=>{
							let data = res.toLowerCase();
							let {inPath} = this.props.navigation.state.params;
							setStorage("address", data);
							setStorage("privkey", walletPk);
								setStorage('showBackUp', false)
								this.props.navigation.navigate('SetPass', {
									headerTitle: '设置钱包',
									showBackUp: false,
									addressEKT: data,
									privkey: this.state.walletPk,
									inPath: inPath
								})
							})
					}
					break;
				}
				default:
					break;
			}
		} else {
			toastShort('私钥错误，请重新输入！')
		}	
	}

	render() {
		let {showDiffPriv, pressText, DiffPrivBtnContent, DiffPrivBtnList, walletPk, enableClick, unableClick} = this.state;
		let {backgroundColor, borderColor, color, disabled} = walletPk ? enableClick : unableClick;
		const inPrivkey = () => {
			return (
				<TouchableWithoutFeedback onPress={() => {
					Keyboard.dismiss();
				}} underlayColor='#fff'>
					<View style={styles.inPk}>
						<View style={{
							position: "absolute",
							right: 16,
							left: 16,
							marginTop: 5
						}}>
							<Text style={styles.inPkTitle}>直接复制粘贴 EKT 钱包私钥 至输入框</Text>
							<TextInput
								style={styles.inPkInput}
								multiline={true}
								placeholder='输入 EKT 钱包私钥 内容'
								textAlignVertical="top"
								underlineColorAndroid="transparent"
								onChangeText={(walletPk) => this.setState({walletPk})}
								value={walletPk}
							></TextInput>
							<TouchableHighlight
								style={{
									marginTop: 40,
									borderWidth: 1,
									borderColor: borderColor,
									borderRadius: 40,
									height: 45,
									backgroundColor: backgroundColor,
									alignItems: "center",
									justifyContent: "center",
								}}
								disabled={disabled}
								onPress={() => {
									this.inPathFrom()
								}}
								underlayColor='#fed853'>
								<Text
									style={{
										fontSize: 16,
										fontFamily: "PingFangSC-Regular",
										color: color
									}}>
									导入
								</Text>
							</TouchableHighlight>
							<Toast showToast={showDiffPriv} btnList={DiffPrivBtnList} toastTitle={pressText}
								   btnContent={DiffPrivBtnContent}></Toast>
						</View>
					</View>
				</TouchableWithoutFeedback>
			)
		}
		return (
			<View style={{flex:1,backgroundColor:'#fff'}}>
				<StatusBar barStyle="dark-content" translucent={false} backgroundColor={"#fff"}/>
				{inPrivkey()}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	inPk: {
		height: '100%',
		backgroundColor: '#fff',
		position: "relative"
		// alignSelf: 'center',
	},
	inPkTitle: {
		marginTop: 20,
		fontSize: 14,
		color: "#444444"
	},
	inPkInput: {
		marginTop: 5,
		height: 125,
		borderWidth: 0.4,
		borderColor: "#b7b7b7",
		fontSize: 12,
		color: "#444444",
		fontFamily: "PingFangSC-Regular",
		padding: 0,
		paddingLeft: 5,
		paddingRight: 5
	}
});