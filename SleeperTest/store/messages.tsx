import {immer} from 'zustand/middleware/immer';
import create, {StateCreator} from 'zustand';
import {Mutate, StoreApi} from 'zustand/vanilla';
import {subscribeWithSelector} from 'zustand/middleware';
import {LocalSendRequest, Message, ConversationsById} from '../types';
import {createSelector} from 'reselect';
import {useMemo} from 'react';
import {enableMapSet} from 'immer';

// Enable immer on maps
// https://immerjs.github.io/immer/installation/#pick-your-immer-version
enableMapSet();

export interface MessageStore {
  message: {
    // This would have parameters like which users
    //addConversation: (conversationName: string) => void;
    // This would have failure & callbacks
    sendMessage: (messageContent: LocalSendRequest) => void;
    readonly conversations: ConversationsById;
  };
}

// Create a permanent message from a send request.
function createMessageFromRequest(
  newMessageId: number,
  creationTS: number,
  messageRequest: LocalSendRequest,
): Message {
  return {
    messageId: newMessageId,
    content: messageRequest.content,
    messageType: messageRequest.messageType,
    senderId: messageRequest.senderId,
    timestampMS: creationTS,
    conversationId: messageRequest.conversationId,
  };
}

// https://github.com/pmndrs/zustand/issues/930
type Store = Mutate<
  StoreApi<MessageStore>,
  [['zustand/subscribeWithSelector', never], ['zustand/immer', never]]
>;

export const useStore: Store = create<MessageStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      message: {
        conversations: new Map(),
        sendMessage: (messageRequest: LocalSendRequest) => {
          const conversationId = messageRequest.conversationId;
          const conversation = conversationWithMessagesSelector(
            get(),
            conversationId,
          );
          // We assume we always have the conversation.
          if (!conversation) {
            return;
          }
          set(state => {
            conversation.nextMessageId++;
            const newMessage = createMessageFromRequest(
              conversation.nextMessageId,
              Date.now(),
              messageRequest,
            );
            conversation.messages.set(newMessage.messageId, newMessage);

            state.message.conversations.set(conversationId, conversation);
            return state;
          });
        },
      },
    })),
  ),
);

export const conversationWithMessagesSelector = (
  state: MessageStore,
  conversationId: string,
) => state.message.conversations.get(conversationId);

export const getMessagesSelector = (conversationId: string) =>
  createSelector(
    (state: MessageStore) =>
      conversationWithMessagesSelector(state, conversationId),
    conversationState =>
      conversationState ? conversationState.messages.values : [],
  );

// Fetch all messages. Ignore pagination. Would pass back a fcn to keep going.
export function useMessages(conversationId: string): Message[] {
  // const messagesSelector = useMemo(
  //   () => getMessagesSelector(conversationId),
  //   [conversationId],
  // );
  return [] as Message[];
}
