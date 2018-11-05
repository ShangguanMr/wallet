import React, { Component } from 'react' ;
import {
	StyleSheet ,
	View ,
	Text ,
	Image ,
	TouchableWithoutFeedback
}from 'react-native' ;

const rightRow = require('../assets/img/rightRow.png');
export default class meitem extends Component {
	constructor (props) {
		super (props)
	}

	static defaultProps = {
		_pressCb : () => {} ,
	}

	componentDidMount = () => {

	}

	render () {
		return (
			<View style={{ marginTop : 10 }}>
				<TouchableWithoutFeedback onPress={this.props._pressCb}>
					<View style={{ height: 56 }}>
						<View style={styles.meitem}>
							<Text style={{ fontWeight: 'bold' }}>{this.props.title}</Text>
							<Image source={rightRow} style={{ width: 9, height: 16 }}></Image>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	meitem : {
		width : '100%' ,
		borderTopWidth: 1 ,
		borderBottomWidth : 1 ,
		borderColor : '#dddddd',
		flex : 1 ,
		flexDirection : 'row' ,
		paddingLeft : 15 ,
		paddingRight : 15 ,
		alignItems : 'center',
		justifyContent : 'space-between' 
	}
})