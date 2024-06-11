import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import * as React from 'react';

export const ColorButton = ({
  color,
  setColor,
  label,
  buttonTitleStyle,
}: {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  buttonTitleStyle: any;
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State for modal visibility

  return (
    <View>
      <Text style={styles.textTitle}>{label}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={buttonTitleStyle}>{color}</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{label}</Text>
          <ColorPicker
            color={color}
            onColorChangeComplete={console.log}
            onColorChange={setColor}
            thumbSize={20}
            sliderSize={20}
            noSnap={false}
            row={true}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={buttonTitleStyle}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  modalButton: {
    padding: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    color: 'black',
  },
  modalButtonText: {
    fontSize: 16,
    color: 'black',
  },
  buttonTitle: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.25,
    color: 'black',
  },
  textTitle: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 4,
    elevation: 3,
    color: '#FFFFFF',
    backgroundColor: 'grey',
    width: 130,
  },
});
