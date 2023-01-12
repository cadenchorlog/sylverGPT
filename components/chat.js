import React, { useState, useRef, useEffect, Button } from 'react';
import { ActivityIndicator } from 'react-native';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Autolink from 'react-native-autolink';
const screenHeight = Math.round(Dimensions.get('window').height);
import AsyncStorage from '@react-native-async-storage/async-storage';
const SETTINGS_KEY = 'settings';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
const handleCopyText = (text) => {
    Clipboard.setString(text);
    // Optionally, you could show a toast or alert to indicate that the text has been copied.
}
const Chat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [previousMessages, setPreviousMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const flatListRef = useRef();
  const removeLeadingSpaces = (string) => {
    return string.replace(/^[^a-zA-Z]*/, '');
}
const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('text-davinci-003');
  const [temperature, setTemperature] = useState(0);


const handleSendMessage = async () => {
  console.log(apiKey)
    if (currentMessage === '') {
      
    }
    setIsLoading(true);
    flatListRef.current.scrollToEnd({animated: true});

    setMessages(prevMessages => [...prevMessages, currentMessage]);
    let allMessage = previousMessages.concat(messages);
    allMessage = allMessage.join('\n') + '\n' + "New request: "+ currentMessage + ":End request";

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey,
        },
        data: {
          prompt: allMessage,
          model: selectedModel,
          "max_tokens": 1000,
          temperature: temperature,
        },
      });
      let stringWithoutSpaces = removeLeadingSpaces(response.data.choices[0].text);
      setMessages(prevMessages => [...prevMessages, stringWithoutSpaces]);
    } catch (error) {
      console.log(error);
    }
    setPreviousMessages(prevMessages => [...prevMessages, currentMessage]);
    setCurrentMessage('');
    setIsLoading(false);
    console.log(allMessage);
    Keyboard.dismiss();
  };




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
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={85}>
        <FlatList
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current.scrollToOffset({ offset: 9000000000000000, animated: true })}
          style={[styles.messagesContainer, { height: screenHeight}]}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{height: 20}}/>}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.messageContainer,
                index % 2 !== 0 && { alignSelf: 'flex-end', backgroundColor: 'lightgreen', padding: 10, marginBottom: 20, marginTop: 20 },
              ]}>
                <Text>
                    {item}
                    </Text>
              {
                index % 2 !== 0 &&
                <TouchableOpacity onPress={() => handleCopyText(item)}>
                  <Icon name="content-copy" size={20} color="gray"/>
                </TouchableOpacity>
              }
            </View>
          )}
        />
        <View style={{marginTop: 20,position: 'absolute',zIndex: 1,alignSelf: 'flex-start',flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity
        onPress={() => navigation.navigate("Configuration")}
            style={styles.menuBtn}>
             <Icon name="menu" size={25} color="white"/>
             
          </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {
              setMessages([]);
              setPreviousMessages([]);
            }}
            style={styles.clearBtn}>
            <Icon name="clear" size={25} color="white"/>
          </TouchableOpacity>
           
</View>
        
        <View style={styles.inputContainer}>   
        {!isLoading && (
        <TextInput
        style={styles.input}
        value={currentMessage}
        onChangeText={text => setCurrentMessage(text)}
        placeholder="Type a message..."
        onSubmitEditing={handleSendMessage}
      />
        )}
        {isLoading && (
        <Text style={styles.Loading}>
        {"SylverGPT is Thinking :D"}
      </Text>
        )}
        
        
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 0,
  },
  menuBtn: {
    zIndex: 1,
    alignSelf: 'center',
    backgroundColor: 'purple',
    padding: 10,
    marginBottom: 20,
    marginTop: 3,
    marginLeft: 20,
    borderRadius: 20,
    shadowColor: '#171717',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    },
    clearBtn: {
        zIndex: 1,
        alignSelf: 'center',
        backgroundColor: 'red',
        padding: 10,
        marginBottom: 20,
        marginTop: 3,
        marginLeft: 20,
        borderRadius: 20,
        shadowColor: '#171717',
        shadowOffset: {width: 2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        },
clearBtnText: {
    color: 'white',
    fontWeight: 'bold',
},
  container: {
    flex: 1,
    marginBottom: -20,
    backgroundColor: '#fff',
    padding: 10,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
    shadowColor: '#171717',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  messageText: {
    fontWeight: 'normal',
    textAlign: 'left',
  },
  loadingIndicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    backgroundColor: '#ddd',
    padding: 10,
    flex: 1,
    marginVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
            marginLeft: 'auto',
            marginRight: 10,
            },
            inputContainer: {
                
            flexDirection: 'row',
            padding: 10,
            borderTopWidth: 1,
            borderColor: '#ddd',
            },
            input: {
            flex: 1,
            padding: 10,
            marginBottom: 15,
            backgroundColor: '#fff',
            borderRadius: 5,
            },
            Loading: {
                flex: 1,
                padding: 10,
                textAlign: 'center',
                backgroundColor: 'purple',
                color: 'white',
                borderRadius: 5,
                },
            

});

export default Chat;

