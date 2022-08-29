import React, {useState} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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
    <SafeAreaView style={styles.safeview}>
      <Text style={styles.title}>Jason Chat</Text>
      <Image
        style={styles.icon}
        source={require('../resources/images/HomeScreen.png')}
      />
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

const styles = StyleSheet.create({
  safeview: {
    backgroundColor: 'lightcyan',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 50,
  },
  icon: {
    height: 200,
    width: 200,
  },
});
