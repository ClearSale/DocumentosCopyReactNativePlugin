import { NativeModules, Platform } from 'react-native';
import SimpleSchema from 'simpl-schema';

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

const CSDocumentosCopySchema = new SimpleSchema({
  clientId: String,
  clientSecretId: String,
  identifierId: String,
  cpf: String,
  primaryColor: {
    type: String,
    defaultValue: null,
    optional: true,
  },
  secondaryColor: {
    type: String,
    defaultValue: null,
    optional: true,
  },
  tertiaryColor: {
    type: String,
    defaultValue: null,
    optional: true,
  },
  titleColor: {
    type: String,
    defaultValue: null,
    optional: true,
  },
  paragraphColor: {
    type: String,
    defaultValue: null,
    optional: true,
  },
});

export type CSDocumentosCopyConfiguration = {
  clientId: string;
  clientSecretId: string;
  identifierId: string;
  cpf: string;
  primaryColor?: String;
  secondaryColor?: String;
  tertiaryColor?: String;
  titleColor?: String;
  paragraphColor?: String;
};

export type CSDocumentosCopyResult = {
  documentType: string | null;
  sessionId: string | null;
};

export const useCSDocumentosCopy = () => {
  return {
    open: async (
      csDocumentosCopyConfig: CSDocumentosCopyConfiguration
    ): Promise<CSDocumentosCopyResult> => {
      const cleanedDoc = CSDocumentosCopySchema.clean(csDocumentosCopyConfig, {
        getAutoValues: true,
        trimStrings: true,
      });

      CSDocumentosCopySchema.validate(cleanedDoc);

      return CsdocumentoscopyReactNative.openCSDocumentosCopy(cleanedDoc);
    },
  };
};
