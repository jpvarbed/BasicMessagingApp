import React, {useState} from 'react';
import {Button, SafeAreaView, ScrollView, TextInput, View} from 'react-native';
import {MessageType, sendMessage} from '../actions/conversation';

/*
Handles input of new message data.
*/
export function SendBox({
  userId,
  conversationId,
}: {
  userId: string;
  conversationId: string;
}) {
  const [input, setInput] = useState('message...');

  const inputText = (text: string) => {
    setInput(text);
  };

  const hitSend = () => {
    sendMessage({
      conversationId: conversationId,
      content: {text: input},
      messageType: MessageType.text,
    });
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
