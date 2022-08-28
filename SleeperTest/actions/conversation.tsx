import React from 'react';
import {LocalSendRequest, Message} from '../types';
import {initialMessages, randomTextMessage} from './randomMessages';

// storage maybe https://github.com/ammarahm-ed/react-native-mmkv-storage
const NUMBER_OF_MESSAGES = 5;
export function loadMessages(conversationId: string): Message[] {
  const firstMessages = initialMessages(conversationId, NUMBER_OF_MESSAGES);
  for (const message of firstMessages) {
    console.log(
      'message: ' +
        message.messageId +
        ' text ' +
        message.content.text +
        ' senderId ' +
        message.senderId,
    );
  }
  return firstMessages;
}
