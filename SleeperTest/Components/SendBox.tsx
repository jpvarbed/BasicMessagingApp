import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
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
//(sendRequest: LocalSendRequest)
export function SendBox(props: {
  userId: number;
  conversationId: string;
  conversationName: string;
  sendMessage: (sendRequest: LocalSendRequest) => void;
}) {
  const textBoxPrompt = 'Send a message to... ' + props.conversationName;
  const [input, setInput] = useState('');

  const inputText = (text: string) => {
    setInput(text);
  };

  const hitSend = () => {
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

  const gifHit = () => {};

  return (
    <SafeAreaView>
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
          <TouchableOpacity activeOpacity={0.85} onPress={hitSend}>
            <Text>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={gifHit}>
            <Text>GIF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// todo handle keyboard rising
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: 'lightcyan',
  },
  sendBox: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
  },
  input: {flex: 1, fontSize: 20, color: 'black'},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});
