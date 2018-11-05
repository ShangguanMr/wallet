import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    FlatList,
    SectionList,
    TouchableHighlight,
    StatusBar, BackHandler
} from "react-native";
import {width, height, setStorage, getStorage, compare, isIos, isAndroid} from "../utils/common_utils";
import {connect} from 'react-redux';
import LoadingView from '../components/loading'

class currencyList extends Component {

    constructor() {
        super()
        this.state = {
            list: [
                {name: 'EKT', status: true, delete: false, id: 0},
            ],
            listFocus: [],
            listNoFocus: [],
            showLoading: true
        }
    }

    async componentDidMount() {
        if (isAndroid) {
            BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);
        }
        let that = this;
        let listFocuss = await getStorage('listFocus') || [];
        let listNoFocuss = await getStorage('listNoFocus') || [];
        let indexData = await getStorage('indexData') || [];
        let list = this.state.list;
        if (listFocuss.length > 0 || listNoFocuss.length > 0) {
            that.setState({
                listFocus: listFocuss,
                listNoFocus: listNoFocuss,
                showLoading: false
            });
        } else {
            let listFocus = [];
            let listNoFocus = [];
            indexData.map((item) => {
                for (let i = 0; i < list.length; i++) {
                    if (item.name === list[i].name) {
                        list[i].status = item.status;
                    }
                }
            })
            for (let i = 0; i < list.length; i++) {
                if (list[i].status === true) {
                    listFocus.push(list[i])
                } else {
                    listNoFocus.push(list[i])
                }
            }
            that.setState({
                listFocus: listFocus,
                listNoFocus: listNoFocus,
                showLoading: false
            })
        }
    }

    _onBackPressed = () => {
        let {navigation} = this.props;
        navigation.goBack();
        return true
    }
    _header = (title) => {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
            </View>
        )
    }
    _listItem = ({item, index}) => {
        let Status = item.status || false;
        let border = {}
        if(item.status && index+1===this.state.listFocus.length){
            border['borderBottomWidth']=0;
            border['borderBottomColor']='#fff'
        }
        return (
            <TouchableHighlight onPress={() => this.test(item, index)} underlayColor='#fff'>
                <View style={styles.itemContainer}>
                    <View style={[styles.item,border]}>
                        <View style={styles.leftCon}>
                            <ImageBackground
                                style={styles.leftBorder}
                                source={require('../assets/img/logoEKT.png')}>
                            </ImageBackground>
                            <View style={styles.leftWord}>
                                <Text style={{fontSize:16,color:'#231815',fontFamily:'PingFangSC-Medium',fontWeight:'bold'}}>{item.name}</Text>
                                <Text style={{fontSize:16,color:'#d7d7d7'}}>{item.name}</Text>
                            </View>
                        </View>
                        <ImageBackground
                            style={styles.icon}
                            source={Status ? require('../assets/img/reduce.png') : require('../assets/img/add.png')}
                        ></ImageBackground>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    async test(item, index) {
        let that = this;
        let listFocus = this.state.listFocus;
        let listNoFocus = this.state.listNoFocus;
        let changeItem = {};
        if (item.status === true) {
            if (item.delete !== false) {
                changeItem['name'] = item.name;
                changeItem['status'] = false;
                changeItem['delete'] = item.delete;
                changeItem['id'] = item.id;

                listFocus.splice(index, 1);
                listNoFocus.push(changeItem);
                listFocus.sort(compare);
                listNoFocus.sort(compare);

                setStorage("listFocus", listFocus);
                setStorage("listNoFocus", listNoFocus);

                that.setState({
                    listFocus: listFocus,
                    listNoFocus: listNoFocus
                })
            }
        } else {
            changeItem['name'] = item.name;
            changeItem['status'] = true;
            changeItem['delete'] = item.delete;
            changeItem['id'] = item.id;

            listNoFocus.splice(index, 1);
            listFocus.push(changeItem);
            listFocus.sort(compare);
            listNoFocus.sort(compare);

            setStorage("listFocus", listFocus);
            setStorage("listNoFocus", listNoFocus);

            that.setState({
                listFocus: listFocus,
                listNoFocus: listNoFocus
            })
        }
    }

    _keyExtractor = (item, index) => index + '';

    _ListEmptyComponent() {
        return (
            <View style={{height: 35, width: '100%', backgroundColor: 'green'}}/>
        )
    }

    componentWillUnmount() {
        let {listFocus, listNoFocus} = this.state;
        this.props.dispatch({type: 'deleteCurrency', listFocus: listFocus, listNoFocus: listNoFocus});
        if (isAndroid) {
            BackHandler.removeEventListener('hardwareBackPress', this._onBackPressed)
        }
    }

    render() {
        let {listFocus, listNoFocus, showLoading} = this.state;
        return (
            <View
                style={{flex: 1, flexDirection: 'column', backgroundColor: '#fff'}}>
                <StatusBar barStyle="dark-content" translucent={false} backgroundColor={'#fff'}/>
                {!showLoading ? <SectionList
                    renderItem={this._listItem}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={this._ListEmptyComponent}
                    renderSectionHeader={({section}) => this._header(section.title)}
                    sections={[ // 不同section渲染相同类型的子组件
                        {
                            data: listFocus,
                            title: '已在首页显示'
                        },
                        {
                            data: listNoFocus,
                            title: '未在首页显示'
                        },
                    ]}
                /> : null}
                <LoadingView showLoading={showLoading}/>
            </View>
        )
    }

}

function mapStateToProps(state) {
    return state.currency
}

export default connect(mapStateToProps)(currencyList);

const styles = StyleSheet.create({
    header: {
        width: width,
        height: 35,
        backgroundColor: '#f8f8f8'
    },
    title: {
        fontSize: 18,
        marginLeft: 14,
        lineHeight: 35
    },
    itemContainer: {
        height: 76,
        paddingLeft: 13,
        paddingRight: 13,
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1 ,
        borderBottomColor: '#ddd'
    },
    leftCon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    leftBorder: {
        width: 40,
        height: 40,
        overflow: 'hidden',
        borderWidth: 1 ,
        borderColor: '#ddd',
        borderRadius: 20
    },
    leftWord: {
        marginLeft: 10
    },
    icon: {
        width: 29,
        height: 29
    }
});
