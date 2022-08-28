import React from 'react';
import {LocalSendRequest, Message} from '../types';
import {initialMessages} from './randomMessages';

export function sendMessage(sendRequest: LocalSendRequest) {}

// storage maybe https://github.com/ammarahm-ed/react-native-mmkv-storage
const NUMBER_OF_MESSAGES = 5;
export function loadMessages(conversationId: string): Message[] {
  const firstMessages = initialMessages(conversationId, NUMBER_OF_MESSAGES);
  for (const message of firstMessages) {
    console.log('text' + message.content.text);
    console.log('senderId' + message.senderId);
    console.log('ts' + message.timestampMS);
  }
  return firstMessages;
}
