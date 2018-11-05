import React, {
	Component,
	PropTypes,
} from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	TouchableHighlight,
} from 'react-native';

export default class PasswordInput extends Component {
	constructor(props){
		super(props);
		this.state = {
			text: ''
		};
	}
	static defaultProps = {
		autoFocus: true,
		onChange: () => { },
		onEnd: () => { },
		onBlur : () => {}
		
	};

	componentDidMount() {
		// if (this.props.autoFocus) {
		// 		this._onPress.bind(this);
		// }
	}

	_getInputItem() {
		let inputItem = [];
		let { text } = this.state;
		for (let i = 0; i < parseInt(this.props.maxLength); i++) {
			if (i == 0) {
				inputItem.push(
					<View key={i} style={[styles.inputItem, this.props.inputItemStyle]}>
						{i < text.length ? <View style={[styles.iconStyle, this.props.iconStyle]} /> : null}
					</View>
				)
			}
			else {
				inputItem.push(
					<View key={i} style={[styles.inputItem, styles.inputItemBorderLeftWidth, this.props.inputItemStyle]}>
						{
							i < text.length ?
								<View style={[styles.iconStyle, this.props.iconStyle]}>
								</View> : null
						}
					</View>
				)
			}
		}
		return inputItem;
	}
	
	_onPress() {
		this.refs.textInput.focus();
	}
	
	render() {
		return (
			<TouchableHighlight
				onPress={this._onPress.bind(this)}
				activeOpacity={1}
				underlayColor='transparent'>
				<View style={[styles.container, this.props.style]} >
					<TextInput
						style={{ height: 48, zIndex: 99, position: 'absolute', width: 300, opacity: 0 ,padding : 0}}
						ref='textInput'
						underlineColorAndroid = "transparent"
						maxLength={this.props.maxLength}
						autoFocus={true}
						onBlur={this.props.onBlur}
						keyboardType={"numeric"}
						onChangeText={
							(text) => {
								this.setState({ text });
								// this.props.onChange(text);
								if (text.length === this.props.maxLength) {
									this.props.onEnd(text);
								}
							}
						}
					/>
                    <View
						style={{
							borderColor: '#ccc',
							flex : 1 ,
							flexDirection: 'row'}}>
							{
								this._getInputItem()
							}
					</View>
				</View>
			</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: '#ccc',
		backgroundColor: '#fff' ,
		height: 45 ,
		width : 300 ,
		marginLeft : 'auto' ,
		marginRight : 'auto',
		borderRadius : 4
	},
	inputItem: {
		height: 45,
		width: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	inputItemBorderLeftWidth: {
		borderLeftWidth: 1,
		borderColor: '#ccc',
		height : 43
	},
	iconStyle: {
		width: 15,
		height: 15,
		backgroundColor: '#222',
		borderRadius: 8,
	},
});