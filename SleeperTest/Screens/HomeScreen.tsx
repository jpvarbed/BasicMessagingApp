import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import {MessageStore, useStore} from '../store/messages';

import {HomeScreenProp} from '../types';

const addConversationSelector = (state: MessageStore) =>
  state.message.addConversation;

export function HomeScreen({navigation}: HomeScreenProp) {
  const [conversationName, setConversationName] = useState('Buddies');
  const addConversation = useStore(addConversationSelector);

  const createConversationAndGo = () => {
    addConversation(conversationName);
    navigation.navigate('ConversationWindow', {
      userId: 0,
      conversationName: conversationName,
    });
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <TextInput
            value={conversationName}
            onChangeText={text => setConversationName(text)}
          />
          <Button
            title="Go to Conversation"
            onPress={createConversationAndGo}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
