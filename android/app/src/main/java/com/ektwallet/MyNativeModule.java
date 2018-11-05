package com.ektwallet;

import android.util.Log;

import com.facebook.common.util.Hex;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import mobile.Mobile;

public class MyNativeModule extends ReactContextBaseJavaModule {
    public MyNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @ReactMethod
    public void inPKaddress(String privkey, Callback callback) throws Exception {
        String address = Mobile.privKey2Address(privkey);
        callback.invoke(address);
    }

    @ReactMethod
    public void getKeyPair(Callback callback) {

        String pair = Mobile.getAccount();
        String[] pairs = pair.split("_");
        String address = pairs[0];
        String privKey = pairs[1];
        callback.invoke(address, privKey);
    }

    @ReactMethod
    public void getSign(String tx, String privkey, Callback callback) throws Exception {
        String sign = Mobile.signMsg(tx,privkey);
        callback.invoke(sign);
    }

    @ReactMethod
    public void createKeyStore(String privkey, String kspass, Callback callback) throws Exception {
        String keyStore = Mobile.createKeyStore(privkey,kspass);
        callback.invoke(keyStore);
    }

    @ReactMethod
    public void decryptKeystore(String keyStore, String kspass, Callback callback) throws Exception {
        String  privkey= Mobile.decryptKeystore(keyStore,kspass);
        callback.invoke(privkey);
    }

    @Override
    public String getName() {
        return "MyNativeModule";
    }
}
