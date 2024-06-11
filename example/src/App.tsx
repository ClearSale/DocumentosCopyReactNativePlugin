import * as React from 'react';

import {
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { CSDocumentosCopyResult } from 'csdocumentoscopy-react-native';
import { useCSDocumentosCopy } from 'csdocumentoscopy-react-native';
import { ColorButton } from './ColorButton';

export default function App() {
  const [clientId, setClientId] = React.useState<string>('');
  const [clientSecretId, setClientSecretId] = React.useState<string>('');
  const [identifierId, setIdentifierId] = React.useState<string>('');
  const [cpf, setCpf] = React.useState<string>('');
  const [primaryColor, setPrimaryColor] = React.useState('#FF4800');
  const [secondaryColor, setSecondaryColor] = React.useState('#FF4800');
  const [titleColor, setTitleColor] = React.useState('#283785');
  const [paragraphColor, setParagraphColor] = React.useState('#353840');

  const [sdkResponse, setSdkResponse] =
    React.useState<CSDocumentosCopyResult | null>(null);
  const { open: openCsDocumentosCopy } = useCSDocumentosCopy();

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollViewStyle}
        contentContainerStyle={styles.scrollViewContentStyle}
      >
        <Text style={styles.title}>CSDocumentosCopy React Native</Text>
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
        <TextInput
          style={styles.input}
          value={identifierId}
          placeholder="IdentifierID"
          onChangeText={setIdentifierId}
        />
        <TextInput
          style={styles.input}
          value={cpf}
          placeholder="CPF"
          onChangeText={setCpf}
        />

        <View style={styles.buttonList}>
          <ColorButton
            color={primaryColor}
            setColor={setPrimaryColor}
            label="Primary Color"
            buttonTitleStyle={styles.buttonTitle}
          />
          <ColorButton
            color={secondaryColor}
            setColor={setSecondaryColor}
            label="Secondary Color"
            buttonTitleStyle={styles.buttonTitle}
          />
          <ColorButton
            color={titleColor}
            setColor={setTitleColor}
            label="Title Color"
            buttonTitleStyle={styles.buttonTitle}
          />
          <ColorButton
            color={paragraphColor}
            setColor={setParagraphColor}
            label="Paragraph Color"
            buttonTitleStyle={styles.buttonTitle}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              try {
                const { sessionId, documentType } = await openCsDocumentosCopy({
                  clientId,
                  clientSecretId,
                  identifierId,
                  cpf,
                  primaryColor,
                  secondaryColor,
                  titleColor,
                  paragraphColor,
                });

                setSdkResponse({ documentType, sessionId });
                console.log(`Received documentType: ${documentType}`);
                console.log(`Received sessionId: ${sessionId}`);
              } catch (e) {
                // Possible errors are CSDocumentoscopySDKError and UserCancel.
                console.error(e);
                Alert.alert(
                  'SDKError',
                  'Something went wrong, check you dev console',
                  [{ text: 'OK' }]
                );

                setSdkResponse(e.toString());
              }
            }}
          >
            <Text style={styles.buttonTitle}>Open CSDocumentosCopy</Text>
          </TouchableOpacity>
        </View>

        {sdkResponse ? (
          <View>
            <Text style={styles.title}>
              Result: {JSON.stringify(sdkResponse)}
            </Text>
          </View>
        ) : null}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    minHeight: '100%',
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
    color: '#FFFFFF',
    backgroundColor: 'grey',
    width: '90%',
  },
  buttonTitle: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  colorContainer: {
    margin: 5,
  },
  buttonList: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '50%',
    gap: 30,
  },
  scrollViewStyle: { width: '100%' },
  scrollViewContentStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    marginTop: 20,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
