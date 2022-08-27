import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';

import {HomeScreenProp} from './types';

export function HomeScreen({navigation}: HomeScreenProp) {
  const [userId, setUserId] = useState('UserId');
  const [conversationName, setConversationName] = useState('ConversationName');
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Home Screen</Text>
          <TextInput value={userId} onChangeText={text => setUserId(text)} />
          <TextInput
            value={conversationName}
            onChangeText={text => setConversationName(text)}
          />
          <Button
            title="Go to Conversation"
            onPress={() =>
              navigation.navigate('ConversationWindow', {
                userId: userId,
                conversationName: conversationName,
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
