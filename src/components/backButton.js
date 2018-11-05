import React, { Component } from 'react' ;
import {
	StyleSheet ,
	View ,
	Text ,
	Image ,
	TouchableOpacity
}from 'react-native' ;
const leftRow = require('../assets/img/leftrow.png');

export default class backButton extends Component {
	constructor (props) {
		super (props)
		this.state = {
		};
	}

	render () {
		return (
			<TouchableOpacity style={{width: 48,height:'100%', paddingLeft: 16,justifyContent:'center'}} onPress={this.props._onPress}>
				<Image source={leftRow} style={{width:8,height:16}}></Image>
			</TouchableOpacity>
		)
	}
}
const styles = StyleSheet.create({
})