import React, {useState} from 'react';
import {useEffect} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {LocalSendRequest, MessageType} from '../types';
import {LineBorder} from './LineBorder';

/*
Handles input of new message data.
*/
export function SendBox(props: {
  userId: number;
  conversationId: string;
  conversationName: string;
  sendMessage: (sendRequest: LocalSendRequest) => void;
  setShowGiphy: (showGiphy: boolean) => void;
}) {
  //const textBoxPrompt = 'Send a message to... ' + props.conversationName;
  const [input, setInput] = useState('');

  const inputText = (text: string) => {
    setInput(text);
  };

  const hitSend = () => {
    if (!input.length) {
      return;
    }
    console.log('hit send' + input);
    const content = {text: input};
    setInput('');
    const conversationId = props.conversationId;
    const messageType = MessageType.text;
    const sendRequest = {
      content: content,
      conversationId: conversationId,
      messageType: messageType,
      senderId: props.userId,
      timestampMS: Date.now(),
    };
    props.sendMessage(sendRequest);
  };

  // The gif button has been hit on the sendbox.
  // Show the tray.
  const gifHit = () => {
    props.setShowGiphy(true);
  };

  return (
    <View>
      <View style={styles.container}>
        <LineBorder />
        <View style={styles.sendBox}>
          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={2}
            value={input}
            onChangeText={inputText}
          />
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.85}
            onPress={hitSend}>
            <Text>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.85}
            onPress={gifHit}>
            <Text>GIF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// todo handle keyboard rising
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    backgroundColor: 'lightcyan',
  },
  sendBox: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonStyle: {
    borderWidth: 0.5,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 3,
  },
  input: {flex: 5, fontSize: 20, color: 'black'},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});
