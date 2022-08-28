import React, {useState} from 'react';
import {Button, SafeAreaView, ScrollView, TextInput, View} from 'react-native';
import {LocalSendRequest, MessageType} from '../types';

/*
Handles input of new message data.
*/
//(sendRequest: LocalSendRequest)
export function SendBox(props: {
  userId: number;
  conversationId: string;
  sendMessage: (sendRequest: LocalSendRequest) => void;
}) {
  const [input, setInput] = useState('message...');

  const inputText = (text: string) => {
    setInput(text);
  };

  const hitSend = () => {
    console.log('hit send' + input);
    const content = {text: input};
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

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <TextInput value={input} onChangeText={inputText} />
          <Button title="send" onPress={hitSend} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
