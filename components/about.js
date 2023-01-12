import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Slider, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'settings';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('text-davinci-003');
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settings) {
        const { apiKey, selectedModel, temperature } = JSON.parse(settings);
        setApiKey(apiKey);
        setSelectedModel(selectedModel);
        setTemperature(temperature);
      }
    };
    loadSettings();
  }, []);

  const handleApiKeyChange = (text) => {
    setApiKey(text);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  const handleTemperatureChange = (temp) => {
    setTemperature(temp);
  };

  const handleSaveSettings = async () => {
    const settings = { apiKey, selectedModel, temperature };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    Alert.alert("Settings Saved", "Your settings have been saved successfully!");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>API Key:</Text>
          <TextInput 
            value={apiKey} 
            onChangeText={handleApiKeyChange} 
            style={styles.textInput} 
          />
        </View>
        <View style={styles.inputContainer}>
        <Text style={styles.label}>Model:</Text>
          <Picker
            selectedValue={selectedModel}
            style={styles.picker}
            onValueChange={handleModelChange}
          >
            <Picker.Item label="text-davinci-003" value="text-davinci-003" />
            <Picker.Item label="text-curie-001" value="text-curie-001" />
            <Picker.Item label="text-babbage-001" value="text-babbage-001" />
            <Picker.Item label="text-ada-001" value="text-ada-001" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Temperature: {temperature}</Text>
          <Slider
            value={temperature}
            onValueChange={handleTemperatureChange}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            style={styles.slider}
          />
        </View>
        <Button
          title="Save Settings"
          onPress={handleSaveSettings}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    shadowColor: '#171717',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  picker: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    padding: 10,
    fontSize: 16,
    shadowColor: '#171717',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
 
  slider: {
    width: '100%',
    height: 40,
    },
    button: {
    marginTop: 20,
    alignSelf: 'center',
    },
    });
    
    export default Settings;