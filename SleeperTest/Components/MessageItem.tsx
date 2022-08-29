import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Message, MessageType} from '../types';
import {AVATAR_HEIGHT} from './MessageGroup';
export const MEDIA_HEIGHT = 100;

// In the real world you would want to handle sending, failed, acked, and have a wrapper for cell and content
export function MessageItem(props: {message: Message}) {
  const messageType = props.message.messageType;
  const isText = messageType === MessageType.text;
  return (
    <View style={styles.container}>
      {isText ? (
        <Text>{props.message.content.text}</Text>
      ) : (
        <Image
          style={styles.gif}
          source={{uri: props.message.content.mediaUrl}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: AVATAR_HEIGHT + 5,
  },
  gif: {
    flex: 1,
    height: MEDIA_HEIGHT,
    width: 100,
  },
});
