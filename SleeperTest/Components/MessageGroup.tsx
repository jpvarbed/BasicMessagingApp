import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// In the real world you would want to handle sending, failed, acked, and have a wrapper for cell and content
export function MessageGroup(props: {senderId: string; dateString: string}) {
  // todo add avatar, sender display name etc
  return (
    <View style={styles.groupBar}>
      <Text>{props.senderId}</Text>
      <Text> </Text>
      <Text>{props.dateString}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  groupBar: {
    flex: 1,
    flexDirection: 'row',
  },
});
