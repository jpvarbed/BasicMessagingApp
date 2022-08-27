import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Button, Text, View} from 'react-native';

export function ConversationWindow() {
  const route = useRoute();
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{route.params.userId}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}
