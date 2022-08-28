import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import {randomMessageSend} from '../actions/randomMessages';
import {ConversationHeader} from '../Components/ConversationHeader';
import {MessageGroup} from '../Components/MessageGroup';
import {MessageItem} from '../Components/MessageItem';
import {SendBox} from '../Components/SendBox';
import {tsToDateString} from '../helpers';
import {MessageStore, useMessages, useStore} from '../store/messages';
import {ConversationWindowRouteProp, LocalSendRequest, Message} from '../types';

import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

const RANDOM_MESSAGE_TIME_MS = 15000;
const sendMessageSelector = (state: MessageStore) => state.message.sendMessage;
const conversationsByNameSelector = (state: MessageStore) =>
  state.message.conversationNameToId;

type SectionListMessageGroup = {
  senderId: number; // Should this be user?
  dateString: string;
  readonly data: Message[];
};

// Returns true if this message belongs in the group.
// Could expand this to more requirements.
function messageBelongsInGroup(
  group: SectionListMessageGroup,
  message: Message,
): boolean {
  return group.senderId === message.senderId;
}

function makeGroupFromMessage(message: Message): SectionListMessageGroup {
  return {
    senderId: message.senderId,
    data: [message],
    dateString: tsToDateString(message.timestampMS),
  };
}

// Create the message groups for the conversation
// group by send and then order
function buildMessageGroups(messages: Message[]): SectionListMessageGroup[] {
  if (messages.length === 0) {
    return [];
  }

  const groups = [];
  const firstMessage = messages[0];
  let currentGroup: SectionListMessageGroup =
    makeGroupFromMessage(firstMessage);

  for (let i = 1; i < messages.length; i++) {
    const message = messages[i];
    if (messageBelongsInGroup(currentGroup, message)) {
      currentGroup.data.push(message);
    } else {
      // Group break everybody.
      groups.push(currentGroup);
      currentGroup = makeGroupFromMessage(message);
    }
  }
  groups.push(currentGroup);
  return groups;
}

// should i use https://yarnpkg.com/package/react-native-section-list-get-item-layout
// or super grid https://yarnpkg.com/package/react-native-super-grid
export function ConversationWindow() {
  const nav = useNavigation();
  const route = useRoute<ConversationWindowRouteProp>();
  const userId = route.params.userId;
  const conversationName = route.params.conversationName;
  const sendMessage = useStore(sendMessageSelector);
  const conversationNameToId = useStore(conversationsByNameSelector);
  const conversationId = conversationNameToId.get(conversationName)!;

  console.log(
    'Enter conversation: ' + conversationName + ' id ' + conversationId,
  );

  const doSend = (sendRequest: LocalSendRequest) => {
    sendMessage(sendRequest);
  };

  useEffect(() => {
    const sendRandomMessages = setInterval(() => {
      sendMessage(randomMessageSend(conversationId));
    }, RANDOM_MESSAGE_TIME_MS);
    return () => clearInterval(sendRandomMessages);
  }, [conversationId, sendMessage]);

  const messages = useMessages(conversationId);
  console.log(messages.length);

  const groups = buildMessageGroups(messages);
  console.log('groups' + groups.length);

  const renderMessage = (
    item: SectionListRenderItemInfo<Message, SectionListMessageGroup>,
  ) => {
    return <MessageItem message={item.item} />;
  };

  const renderSection = (info: {
    section: SectionListData<Message, SectionListMessageGroup>;
  }) => {
    return (
      <MessageGroup
        senderId={info.section.senderId}
        dateString={info.section.dateString}
      />
    );
  };

  const keyExtractor = (item: Message, index: number): string => {
    return item.messageId.toString() + index.toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ConversationHeader
          conversationName={conversationName}
          goBack={nav.goBack}
        />
        <View style={styles.sectionList}>
          <SectionList
            sections={groups}
            renderItem={renderMessage}
            renderSectionHeader={renderSection}
            keyExtractor={keyExtractor}
            automaticallyAdjustKeyboardInsets={true}
            automaticallyAdjustContentInsets={true}
          />
        </View>
        <View style={styles.sendBox}>
          <SendBox
            conversationId={conversationId}
            conversationName={conversationName}
            userId={userId}
            sendMessage={doSend}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Co-locate styles. https://github.com/thoughtbot/react-native-typescript-styles/blob/main/STYLE_GUIDE.md
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    alignContent: 'flex-start',
  },
  sectionList: {
    backgroundColor: 'lightcoral',
    flex: 1,
    marginTop: 0,
  },
  sendBox: {
    justifyContent: 'flex-end',
  },
});
