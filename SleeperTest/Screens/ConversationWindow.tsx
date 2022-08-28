import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {
  Button,
  SafeAreaView,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {loadMessages} from '../actions/conversation';
import {MessageGroup} from '../Components/MessageGroup';
import {MessageItem} from '../Components/MessageItem';
import {SendBox} from '../Components/SendBox';
import {tsToDateString} from '../helpers';
import {ConversationWindowRouteProp, Message} from '../types';

export type SectionListMessageGroup = {
  senderId: string; // Should this be user?
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
  const navigation = useNavigation();
  const userId = route.params.userId;
  const conversationId = route.params.conversationName;
  // todo real time update of messages
  const messages = loadMessages(conversationId);

  const groups = buildMessageGroups(messages);

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

  const keyExtractor = (item: Message): string => {
    return item.messageId.toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>{route.params.userId}</Text>
        <SectionList
          sections={groups}
          renderItem={renderMessage}
          renderSectionHeader={renderSection}
          keyExtractor={keyExtractor}
        />
        <SendBox conversationId={conversationId} userId={userId} />
        <Button title="Go back" onPress={() => navigation.goBack()} />
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
});