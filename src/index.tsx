import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'csdocumentoscopy-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const CsdocumentoscopyReactNative = NativeModules.CsdocumentoscopyReactNative
  ? NativeModules.CsdocumentoscopyReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return CsdocumentoscopyReactNative.multiply(a, b);
}
