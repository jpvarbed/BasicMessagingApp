import {immer} from 'zustand/middleware/immer';
import create from 'zustand';
import {subscribeWithSelector} from 'zustand/middleware';
import {
  LocalSendRequest,
  Message,
  ConversationsById,
  ConversationsByName,
} from '../types';
import {createSelector} from 'reselect';
import {useMemo} from 'react';
import {enableMapSet} from 'immer';

// Enable immer on maps
// https://immerjs.github.io/immer/installation/#pick-your-immer-version
enableMapSet();

export interface MessageStore {
  message: {
    // Create conversation. No-op if conversation with this name exists.
    // A proper create would take in participants/users
    addConversation: (conversationName: string) => void;
    // This would have failure & callbacks
    sendMessage: (messageContent: LocalSendRequest) => void;
    readonly conversations: ConversationsById;
    readonly nextConversationId: number;
    // Ideally youre view model keeps track of the name/id pair but we're going for speed of development.
    // This blocks changing the name for the case of having 2 with the same name so youd have to do a joint key
    readonly conversationNameToId: ConversationsByName;
  };
}

// Create a permanent message from a send request.
function createMessageFromRequest(
  newMessageId: number,
  messageRequest: LocalSendRequest,
): Message {
  return {
    messageId: newMessageId,
    content: messageRequest.content,
    messageType: messageRequest.messageType,
    senderId: messageRequest.senderId,
    timestampMS: messageRequest.timestampMS,
    conversationId: messageRequest.conversationId,
  };
}

// https://npm.io/package/zustand
export const useStore = create<MessageStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      message: {
        conversations: new Map(),
        nextConversationId: 0,
        conversationNameToId: new Map(),
        sendMessage: (messageRequest: LocalSendRequest) => {
          const conversationId = messageRequest.conversationId;

          console.log('send message ' + conversationId);

          set(state => {
            let writeableDraft =
              state.message.conversations.get(conversationId)!;
            const messageId = writeableDraft.nextMessageId++;
            console.log('increment id');
            const newMessage = createMessageFromRequest(
              messageId,
              messageRequest,
            );
            console.log('add to messages');
            writeableDraft.messages.set(messageId, newMessage);
            console.log('update list');
          });
        },
        addConversation: (conversationName: string) => {
          const conversation =
            get().message.conversationNameToId.get(conversationName);
          if (conversation) {
            console.log(conversationName + 'already created');
            // already created.
            return;
          }
          set(state => {
            const idForNewConversation = state.message.nextConversationId++;
            console.log(
              'Added conversation ' +
                conversationName +
                ' with id: ' +
                idForNewConversation,
            );
            state.message.conversations.set(idForNewConversation.toString(), {
              conversationId: idForNewConversation.toString(),
              conversationName: conversationName,
              messages: new Map(),
              nextMessageId: 0,
            });

            state.message.conversationNameToId.set(
              conversationName,
              idForNewConversation.toString(),
            );
          });
        },
      },
    })),
  ),
);

// Get specific conversation from store
export const conversationWithMessagesSelector = (
  state: MessageStore,
  conversationId: string,
) => state.message.conversations.get(conversationId)!;

// Get message from specific conversation.
// With subscribe & create selector, only have to recalculate when input changes
export const getMessagesSelector = (conversationId: string) =>
  createSelector(
    (state: MessageStore) =>
      conversationWithMessagesSelector(state, conversationId),
    conversationState =>
      conversationState ? Array.from(conversationState.messages.values()) : [],
  );

// Fetch all messages. Ignore pagination. Would pass back a fcn to keep going.
export function useMessages(conversationId: string): Message[] {
  const messagesSelector = useMemo(
    () => getMessagesSelector(conversationId),
    [conversationId],
  );
  const messages = useStore(messagesSelector);
  return messages;
}
