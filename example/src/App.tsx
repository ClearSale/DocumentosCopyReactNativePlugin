import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { CSDocumentosCopyResult } from 'csdocumentoscopy-react-native';
import { useCSDocumentosCopy } from 'csdocumentoscopy-react-native';
import { ColorButton } from './ColorButton';
import MaskInput from 'react-native-mask-input';

export default function App() {
  const [clientId, setClientId] = useState<string>('');
  const [clientSecretId, setClientSecretId] = useState<string>('');
  const [identifierId, setIdentifierId] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#FF4800');
  const [secondaryColor, setSecondaryColor] = useState<string>('#FF4800');
  const [tertiaryColor, setTertiaryColor] = useState<string>('#EFEFEFFF');
  const [titleColor, setTitleColor] = useState<string>('#283785');
  const [paragraphColor, setParagraphColor] = useState<string>('#353840');
  const [sdkResponse, setSdkResponse] =
    React.useState<CSDocumentosCopyResult | null>(null);
  const { open: openCsDocumentosCopy } = useCSDocumentosCopy();

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'ios' ? null : (
        <StatusBar
          animated={true}
          backgroundColor="#000000"
          hidden={false}
          barStyle="default"
        />
      )}
      <Animated.ScrollView
        style={styles.scrollViewStyle}
        contentContainerStyle={styles.scrollViewContentStyle}
      >
        <Text style={styles.title}>CSDocumentosCopy React Native</Text>
        <TextInput
          style={styles.input}
          value={clientId}
          placeholder="ClientID *"
          onChangeText={setClientId}
        />
        <TextInput
          style={styles.input}
          value={clientSecretId}
          placeholder="Client Secret *"
          onChangeText={setClientSecretId}
        />
        <TextInput
          style={styles.input}
          value={identifierId}
          placeholder="IdentifierID *"
          onChangeText={setIdentifierId}
        />
        <MaskInput
          style={styles.input}
          value={cpf}
          placeholder="CPF *"
          onChangeText={(_, unmaskedValue) => {
            setCpf(unmaskedValue);
          }}
          mask={[
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
          ]}
        />

        <View style={styles.buttonContainer}>
          <ColorButton
            color={primaryColor}
            setColor={setPrimaryColor}
            buttonTitleStyle={styles.buttonTitle}
            label="Primary"
          />
          <ColorButton
            color={secondaryColor}
            setColor={setSecondaryColor}
            buttonTitleStyle={styles.buttonTitle}
            label="Secondary"
          />
          <ColorButton
            color={tertiaryColor}
            setColor={setTertiaryColor}
            buttonTitleStyle={styles.buttonTitle}
            label="Tertiary"
          />
          <ColorButton
            color={titleColor}
            setColor={setTitleColor}
            buttonTitleStyle={styles.buttonTitle}
            label="Title"
          />
          <ColorButton
            color={paragraphColor}
            setColor={setParagraphColor}
            buttonTitleStyle={styles.buttonTitle}
            label="Paragraph"
          />
        </View>

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
                tertiaryColor,
                titleColor,
                paragraphColor,
              });

              setSdkResponse({ documentType, sessionId });
              console.log(`Received documentType: ${documentType}`);
              console.log(`Received sessionId: ${sessionId}`);
            } catch (e: any) {
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

        {sdkResponse ? (
          <View>
            <Text>Result: {JSON.stringify(sdkResponse, undefined, 2)}</Text>
          </View>
        ) : null}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: 'white',
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollViewStyle: { width: '100%' },
  scrollViewContentStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 20,
  },
  buttonTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
