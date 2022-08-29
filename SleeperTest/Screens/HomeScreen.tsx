import React, {useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
      <View style={styles.createConversation}>
        <TextInput
          style={styles.createInput}
          value={conversationName}
          onChangeText={text => setConversationName(text)}
        />
        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.85}
          onPress={createConversationAndGo}>
          <Text>Create or Enter Conversation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  createConversation: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    width: '100%',
  },
  createButton: {borderWidth: 0.5, borderColor: 'blue'},
  createInput: {backgroundColor: 'white', width: '50%', borderWidth: 0.5},
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
