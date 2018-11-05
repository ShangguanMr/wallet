import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
    StatusBar
} from 'react-native';
import {width , height,isIos} from '../utils/common_utils'
const loadingImage1 = require('../assets/img/loading/loading1.png')
const loadingImage2 = require('../assets/img/loading/loading2.png')
const loadingImage3 = require('../assets/img/loading/loading3.png')
const loadingImage4 = require('../assets/img/loading/loading4.png')
const loadingImage5 = require('../assets/img/loading/loading5.png')
const loadingImage6 = require('../assets/img/loading/loading6.png')
const loadingImage7 = require('../assets/img/loading/loading7.png')
const loadingImage8 = require('../assets/img/loading/loading8.png')
const imageSource=[loadingImage1, loadingImage2, loadingImage3, loadingImage4, loadingImage5, loadingImage6, loadingImage7, loadingImage8];
let num = 0;

class LoadingView extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loadingImage : loadingImage1
        };
        this.loading = this.loading.bind(this);
    }
    componentWillMount () {
        this.loading();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.showLoading){
            setTimeout(() => this.loading(), 250);
        }
    }
    _close(){
        // console.log("onRequestClose ---- ")
    }
    loading = () => {
        // console.log(num);
        this.setState({loadingImage:imageSource[num]});
        num ++ ;
        if(num >= 8) num = 0;
        if (this.props.showLoading) {
            setTimeout( () => this.loading() , 250); 
        }else{
            return ;
        }
    }
    render() {
        const { showLoading, opacity, backgroundColor } = this.props
        // console.log('hhxhxhxhxh====>',this.props);
        let {loadingImage} = this.state;
        return (
            showLoading ?
            <View style={{backgroundColor: '#fff',flex:1}}>
                <StatusBar barStyle = {showLoading ? "dark-content" : "light-content"} translucent={false}/>
                <View style={ [styles.loadingView, {opacity: opacity||1, backgroundColor: '#fff',flex:1}]}>
                    <View style={ styles.loadingImageView }>
                        <View style={ styles.loadingImage }>
                            {
                                this.props.loadingViewClick?
                                <TouchableOpacity onPress={ this.props.loadingViewClick }>
                                    <Image style={ styles.loadingImage } source={ loadingImage }/>
                                </TouchableOpacity>
                                :
                                <Image style={ styles.loadingImage } source={loadingImage}/>
                            }
                        </View>
                    </View>
                </View>
            </View>
            : null 
        )
    }
}
const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        // position: 'absolute'
    },
    loadingImage: {
        width: 70,
        height: 70,
    },
    loadingImageView: {
        // position: 'absolute',
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
// LoadingView.propTypes = {
//     loadingViewClick: React.PropTypes.func, //.isRequired,
//     showLoading: React.PropTypes.bool.isRequired,
//     opacity: React.PropTypes.number,
//     backgroundColor: React.PropTypes.string
// }


export default LoadingView