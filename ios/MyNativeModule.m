#import "MyNativeModule.h"
@implementation MyNativeModule
RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;
static MyNativeModule *singLton = nil;
+ (instancetype)allocWithZone:(struct _NSZone *)zone{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken,^{
    singLton=[super allocWithZone:zone];
  });
  return singLton;
}

RCT_EXPORT_METHOD(inPKaddress:(NSString*)privkey callback:(RCTResponseSenderBlock)callback){
  NSString *address=MobilePrivKey2Address(privkey);
  callback(@[address]);
}
RCT_EXPORT_METHOD(getAcount:(RCTResponseSenderBlock)callback){
  NSString *add_prv=MobileGetAccount();
  NSArray *arr = [add_prv componentsSeparatedByString:@"_"];
  callback(@[arr[0],arr[1]]);
}
RCT_EXPORT_METHOD(getSignMsg:(NSString*)tx :(NSString*)privkey callback:(RCTResponseSenderBlock)callback){
  NSString *sign = MobileSignMsg(tx, privkey);
  callback(@[sign]);
}
RCT_EXPORT_METHOD(createKeyStore:(NSString*)privkey :(NSString*)kspass callback:(RCTResponseSenderBlock)callback){
  NSString *sign = MobileCreateKeyStore(privkey, kspass);
  callback(@[sign]);
}
RCT_EXPORT_METHOD(decryptKeystore:(NSString*)keyStore :(NSString*)kspass callback:(RCTResponseSenderBlock)callback){
  NSString *sign = MobileDecryptKeystore(keyStore, kspass);
  callback(@[sign]);
}
@end
