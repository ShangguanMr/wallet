'use strict';
import {Dimensions, NetInfo, Platform} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation'

export function navigationResetTo(navigation, routeName) {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName})]
    });
    navigation.dispatch(resetAction);
}

//设备宽高；
export let width = Dimensions.get("window").width;
export let height = Dimensions.get("window").height;

//判断设备；
export let isIos = Platform.OS === 'ios';
export let isAndroid = Platform.OS === 'android';

//判断iphoneX设备；
// iPhoneX屏幕大小；
const X_WIDTH = 375;
const X_HEIGHT = 812;

export function isIphoneX() {
    return (
        isIos && ((height === X_HEIGHT && width === X_WIDTH) || (height === X_WIDTH && width === X_HEIGHT))
    )
}

export var navStyle = {
    ...ifIphoneX({
        paddingTop: 20,
        height: 68
    }, {
        paddingTop: 0,
        height: 48,
    })
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
    if (isIphoneX()) {
        return iphoneXStyle;
    } else {
        return regularStyle
    }
}

//判断ios版本
export let iosVersion = (isIos && Platform.Version.split(".")[0]) ? Platform.Version.split(".")[0] : false;

//判断网络状态
let connect = false;
const netChange = (isConnect) => {
    connect = isConnect;
}

// RN获取网络状态(true/false)
export async function getNetWorkState() {
    if (isIos) {
        await NetInfo.isConnected.addEventListener('change', netChange);
        return connect;
    } else {
        // android平台也加上这段代码，是为了android网络变化时也能准确获取到网络状态
        await NetInfo.isConnected.addEventListener('change', netChange);
        return await NetInfo.isConnected.fetch();
    }
}

/**
 *
 * @param key: 保存的key值
 * @param object: 保存的value
 * @param expires: 有效时间，
 */
export function setStorage(key, object, expires = null) {
    console.log("key ,object, expires-=====", key, object, expires);
    storage.save({
        key: key,  // 注意:请不要在key中使用_下划线符号!
        data: object,
        expires: expires
    }).catch((e) => {
        console.log("e-=====", e);
    });

}

//	获取 storage 数据
// 参数1 : key : string
// getStorage("location").then(result => result).catch(err => err)
export function getStorage(key) {
    return new Promise((resolve, reject) => {
        storage.load({
            key: key,
            autoSync: true,
            syncInBackground: true,
            syncParams: {
                extraFetchOptions: {
                },
                someFlag: true,
            },
        }).then(ret => {
            return resolve(ret)
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    return resolve("")
                case 'ExpiredError':
            }
            return reject("")
        });
    })
}

export function removeStorage(key) {
    // 删除单个数据
    storage.remove({
        key: key,
    });
}

export function removeAll() {
    // 移除所有"key-id"数据（但会保留只有key的数据）
    storage.clearMap();
}

//  清除 storage里某个key下所有数据
export function clearDataByKey(key) {
// !! 清除某个key下的所有数据
    console.log("this is clearHistorySearch");
    storage.clearMapForKey(key);
}

//路由重定向reset封装
export function resetNavigation(index = 0, routeName, params = {}) {
    return StackActions.reset({
        index: index,
        actions: [
            NavigationActions.navigate({
                routeName: routeName,
                params: params
            })
        ],
    });
}

export function resetData(arr, address) {
    let datas = [];
    //处理数据；
    arr.map((item, index) => {
        let data = {};
        data['id'] = index;
        data['number'] = item['amount'];
        data['time'] = dateTrans(item['time']);
        data['transitionAddressIn'] = item['to'];
        data['transitionAddressOut'] = item['from'];
        data['transitionTicket'] = "";
        data['result'] = true;
        if (item['from'] === address) {
            data['transType'] = '转出';
        } else {
            data['transType'] = '转入';
        }
        datas.push(data);
    });
    return datas;
}

//时间戳转换1
export function oldDateTrans(dates = "") {
    let date = new Date(dates);
    let nowCuo = new Date().valueOf();
    let now = new Date(nowCuo);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

    let nowY = now.getFullYear() + '-';
    let nowM = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-';
    let nowD = (now.getDate() < 10 ? '0' + now.getDate() : now.getDate()) + ' ';

    if (Y === nowY) {
        if (M === nowM) {
            if (D === nowD) {
                return '今天' + ' ' + h + m + s
            } else if (parseInt(D) + 1 === parseInt(nowD)) {
                return '昨天' + ' ' + h + m + s
            } else {
                return M + D + h + m + s
            }
        } else {
            return M + D + h + m + s
        }
    } else {
        return Y + M + D + h + m + s
    }
}

//时间戳转换2
export function dateTrans(date) {
    let t = new Date(date).valueOf();

    return t;
}

//裁剪字符串
export function useStar(vl = "") {
    let start = vl.substr(0, 11);
    let hideVl = vl.substr(-11, 11);
    let showVl = start + "***" + hideVl;
    return showVl;
}

//id排序
//列表按id排序
export function compare(obj1, obj2) {
    let val1 = obj1.id;
    let val2 = obj2.id;
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}

//列表按time排序 大->小
export function compareTime(obj1, obj2) {
    let val1 = obj1.time;
    let val2 = obj2.time;
    if (val1 > val2) {
        return -1;
    } else if (val1 < val2) {
        return 1;
    } else {
        return 0;
    }
}

//截取url的query后参数
export function toQueryParams(url) {
    if (url) {
        const query = url.split('?')[1].split('&');
        let params = {};
        query.forEach((item) => {
            let key = item.split('=')[0];
            let value = item.split('=')[1];
            params[key] = value;
        });
        return params;
    }
    return null;
}

export const scpx = height/1334;