import React from 'react';
import {Text, View} from 'react-native';
import {Message} from '../types';

// In the real world you would want to handle sending, failed, acked, and have a wrapper for cell and content
export function MessageItem(props: {message: Message}) {
  return (
    <View>
      <Text>{props.message.content.text}</Text>
    </View>
  );
}
