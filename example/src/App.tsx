import * as React from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCSDocumentosCopy } from 'csdocumentoscopy-react-native';

export default function App() {
  const [clientId, setClientId] = React.useState<string>('');
  const [clientSecretId, setClientSecretId] = React.useState<string>('');
  const [sdkResponse, setSdkResponse] = React.useState<{
    sessionId?: string | null;
    documentType?: string | null;
  } | null>(null);
  const { open: openCsDocumentosCopy } = useCSDocumentosCopy();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={clientId}
        placeholder="ClientID"
        onChangeText={setClientId}
      />
      <TextInput
        style={styles.input}
        value={clientSecretId}
        placeholder="Client Secret"
        onChangeText={setClientSecretId}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          try {
            const { sessionId, documentType, error } =
              await openCsDocumentosCopy({
                clientId,
                clientSecretId,
              });

            setSdkResponse({ documentType, sessionId });
            console.log(`Received documentType: ${documentType}`);
            console.log(`Received sessionId: ${sessionId}`);
            console.log(`Received error: ${error}`);

            if (error) {
              throw new Error(error);
            }
          } catch (e) {
            console.error(e);
            Alert.alert(
              'SDKError',
              'Something went wrong, check you dev console',
              [{ text: 'OK' }]
            );
          }
        }}
      >
        <Text style={styles.buttonTitle}>Open CSDocumentosCopy</Text>
      </TouchableOpacity>

      {sdkResponse ? (
        <View>
          <Text>Result: {JSON.stringify(sdkResponse)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: 'white',
  },
  input: {
    width: '90%',
    borderWidth: 5,
    padding: 10,
    backgroundColor: 'grey',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    width: '90%',
  },
  buttonTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
