import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {randomMessageSend} from '../actions/randomMessages';
import {ConversationHeader} from '../Components/ConversationHeader';
import {AVATAR_HEIGHT, MessageGroup} from '../Components/MessageGroup';
import {MEDIA_HEIGHT, MessageItem} from '../Components/MessageItem';
import {SendBox} from '../Components/SendBox';
import {tsToDateString} from '../helpers';
import {MessageStore, useMessages, useStore} from '../store/messages';
import {
  ConversationWindowRouteProp,
  LocalSendRequest,
  Message,
  MessageType,
} from '../types';
import helper from './helper';

const RANDOM_MESSAGE_TIME_MS = 15000;
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
// hook up scrolling via onendreached and scroll position
export function ConversationWindow() {
  const nav = useNavigation();
  const route = useRoute<ConversationWindowRouteProp>();
  const userId = route.params.userId;
  const conversationName = route.params.conversationName;
  const sendMessage = useStore(sendMessageSelector);
  const conversationNameToId = useStore(conversationsByNameSelector);
  const conversationId = conversationNameToId.get(conversationName)!;
  const messageListRef =
    useRef<SectionList<Message, SectionListMessageGroup>>(null);
  // Scroll to most recent message unless the user scrolls
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  console.log(
    'Enter conversation: ' + conversationName + ' id ' + conversationId,
  );

  const doSend = (sendRequest: LocalSendRequest) => {
    sendMessage(sendRequest);
    scrollToBottom();
    setShouldAutoScroll(true);
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

  const scrollToBottom = () => {
    const groupLength = groups.length - 1;
    if (groupLength < 0) {
      return;
    }
    const lastMessageInLastGroup = groups[groupLength].data.length - 1;
    console.log('scroll to ' + lastMessageInLastGroup + ' group' + groupLength);
    messageListRef.current?.scrollToLocation({
      viewPosition: 1,
      itemIndex: lastMessageInLastGroup,
      sectionIndex: groupLength,
    });
  };

  //
  const contentSizeChange = () => {
    if (!shouldAutoScroll) {
      return;
    }
    scrollToBottom();
  };

  // Length is the height of the row
  // Offset: distance in pixels of this row from the top.
  // index: current row index
  // We use a helper that gives an estimate of height based on what's in each cell & section header.
  // This is what lets us scroll.
  const getItemLayout = helper({
    getItemHeight: (rowData: Message): number => {
      switch (rowData.messageType) {
        case MessageType.text: {
          return 40;
        }
        case MessageType.giphyGif: {
          return MEDIA_HEIGHT;
        }
      }
    },
    getSectionHeaderHeight: () => {
      return AVATAR_HEIGHT;
    },
  });

  return (
    <SafeAreaView style={styles.safeview}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}>
        <ConversationHeader
          conversationName={conversationName}
          goBack={nav.goBack}
        />
        <View style={styles.container}>
          <View style={styles.sectionList}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <SectionList
                sections={groups}
                ref={messageListRef}
                renderItem={renderMessage}
                renderSectionHeader={renderSection}
                keyExtractor={keyExtractor}
                automaticallyAdjustKeyboardInsets={true}
                automaticallyAdjustContentInsets={true}
                onContentSizeChange={contentSizeChange}
                getItemLayout={getItemLayout}
                stickySectionHeadersEnabled={false}
                onScroll={() => setShouldAutoScroll(false)}
                onEndReached={() => setShouldAutoScroll(true)}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.sendBox}>
            <SendBox
              conversationId={conversationId}
              conversationName={conversationName}
              userId={userId}
              sendMessage={doSend}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// change backgroun to lightcyan
// Co-locate styles. https://github.com/thoughtbot/react-native-typescript-styles/blob/main/STYLE_GUIDE.md
const styles = StyleSheet.create({
  safeview: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
    backgroundColor: 'lightgray',
    alignContent: 'flex-start',
    width: '100%',
    height: '100%',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  sectionList: {
    backgroundColor: 'lightcoral',
    flex: 1,
  },
  sendBox: {
    width: '100%',
    marginBottom: 15,
  },
  header: {
    width: '100%',
  },
});
