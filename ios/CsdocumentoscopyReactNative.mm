#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CsdocumentoscopyReactNative, NSObject)

RCT_EXTERN_METHOD(openCSDocumentosCopy:(NSDictionary *)sdkParams withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
