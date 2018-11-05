import React, { Component } from 'react' ;
import {
	StyleSheet ,
	View ,
	Text ,
	Image ,
    TouchableOpacity,
    Modal
}from 'react-native' ;
const gameLoading = require('../assets/img/loading.gif');

export default class GameLoading extends Component {
	constructor (props) {
		super (props)
		this.state = {
		};
	}

	render () {
		return (
			<Modal
                // animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                }}
            >
                <View style={{flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
                    <Image source={gameLoading} style={{width:100,height:100}} />
                </View>
            </Modal>
		)
	}
}
const styles = StyleSheet.create({
})