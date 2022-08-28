import React from 'react';
import {Text, View} from 'react-native';

// In the real world you would want to handle sending, failed, acked, and have a wrapper for cell and content
export function MessageGroup(props: {senderId: string; dateString: string}) {
  // todo add avatar, sender display name etc
  return (
    <View>
      <Text>{props.senderId}</Text>
      <Text>{props.dateString}</Text>
    </View>
  );
}
