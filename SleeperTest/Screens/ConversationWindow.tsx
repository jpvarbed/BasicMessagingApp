import {useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {loadMessages} from '../actions/conversation';
import {randomMessageSend} from '../actions/randomMessages';
import {MessageGroup} from '../Components/MessageGroup';
import {MessageItem} from '../Components/MessageItem';
import {SendBox} from '../Components/SendBox';
import {tsToDateString} from '../helpers';
import {MessageStore, useMessages, useStore} from '../store/messages';
import {ConversationWindowRouteProp, LocalSendRequest, Message} from '../types';

const sendMessageSelector = (state: MessageStore) => state.message.sendMessage;
const conversationsByNameSelector = (state: MessageStore) =>
  state.message.conversationNameToId;

export type SectionListMessageGroup = {
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
export function buildMessageGroups(
  messages: Message[],
): SectionListMessageGroup[] {
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

export function ConversationWindow() {
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
    }, 5000);
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
      <View>
        <SectionList
          sections={groups}
          renderItem={renderMessage}
          renderSectionHeader={renderSection}
          keyExtractor={keyExtractor}
        />
      </View>
      <View style={styles.sendBox}>
        <SendBox
          conversationId={conversationId}
          userId={userId}
          sendMessage={doSend}
        />
      </View>
    </SafeAreaView>
  );
}

// Co-locate styles. https://github.com/thoughtbot/react-native-typescript-styles/blob/main/STYLE_GUIDE.md
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
  sendBox: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
});
