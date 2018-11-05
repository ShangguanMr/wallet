import React, { Component } from 'react' ;
import {
	StyleSheet ,
	View ,
	Text ,
}from 'react-native' ;
import {width} from '../utils/common_utils'

export default class labelitem extends Component {
	constructor(props) {
		super(props)
	}

	static defaultProps = {
		label : '',
		value : ''
	}


	render () {
		let {label,value}=this.props;
		return (
			<View style={styles.TDFStyleText}>
				<Text style={styles.TDFStyleTextTitle}>{label}</Text>
				<Text style={styles.TDFStyleTextData}>{value}</Text>
			</View>
		)
	}
    
}
const styles = StyleSheet.create({
	TDFStyleText: {
		marginTop: 20,
		flexDirection: "row"
	},
	TDFStyleTextTitle: {
		fontFamily: "PingFangSC-Light",
		fontSize: 12,
		color: "#7d7d7d",
        textAlign: "left",
        width : 50
	},
	TDFStyleTextData: {
		marginLeft: 15,
		fontFamily: "PingFangSC-Regular",
		fontSize: 12,
		color: "#231815",
		width: width - 97
	},
})