import {RouteProp} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// We have just two pages, Home & Conversation Window.
export type RootStackParamList = {
  Home: undefined;
  ConversationWindow: {userId: string; conversationName: string};
};

// Type used to navigate for Home
export type HomeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type HomeScreenProp = NativeStackScreenProps<RootStackParamList, 'Home'>;

export type ConversationWindowRouteProp = RouteProp<
  RootStackParamList,
  'ConversationWindow'
>;

// Store by id so that you may update a message if it changes.
export type MessagesById = Map<number, Message>;

export type ConversationsById = Map<string, ConversationWithMessages>;

export interface ConversationWithMessages {
  // in practice you might want a server & local id
  conversationId: string;
  // putting all the metadata in
  conversationName: string;

  // all of the messages in the conversation
  messages: MessagesById;

  nextMessageId: number;
}

export interface Message {
  messageId: number;
  content: MessageContent;
  messageType: MessageType;
  senderId: string;
  conversationId: string;
  timestampMS: number;
}
/*
All pieces of information necessary to send a message.
Could separately track metrics.
*/
export interface LocalSendRequest {
  content: MessageContent;
  messageType: MessageType;
  conversationId: string;
  senderId: string;
}

export enum MessageType {
  text,
  giphyGif,
}

/*
The content of a message. Text, giphy link etc.
An ideal schema would have a more clear state space so you know when to expect each field.
*/
export interface MessageContent {
  text?: string;
  mediaUrl?: string;
}

export interface User {
  userId: string;
  displayName: string;
  avatarURL: string;
}
