import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
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
import {MessageStore, useMessages, useStore} from '../store/messages';
import {
  ConversationWindowRouteProp,
  LocalSendRequest,
  Message,
  MessageType,
  SectionListMessageGroup,
} from '../types';

import {
  GiphySDK,
  GiphyGridView,
  GiphyContent,
  GiphyMedia,
} from '@giphy/react-native-sdk';
import {buildMessageGroups} from './utils';
import GetItemLayoutCalculation from './GetItemLayoutCalculation';

const APIKEY = '76792192255c42c3a11c58ea1acfbe27';
GiphySDK.configure({apiKey: APIKEY});

const RANDOM_MESSAGE_TIME_MS = 15000;
const sendMessageSelector = (state: MessageStore) => state.message.sendMessage;
const conversationsByNameSelector = (state: MessageStore) =>
  state.message.conversationNameToId;

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
  // We show giphy here since it will take up space in the top container.
  // We also want clicks outside of it to close the drawer.
  const [showGiphy, setShowGiphy] = useState(false);

  console.log(
    'Enter conversation: ' + conversationName + ' id ' + conversationId,
  );

  // ----- sending messages-------
  const doSend = (sendRequest: LocalSendRequest) => {
    sendMessage(sendRequest);
    scrollToBottom();
    setShouldAutoScroll(true);
  };

  // A gif has been selected from the tray.
  // Close tray, send media message.
  const gifChosen = (
    e: NativeSyntheticEvent<{
      media: GiphyMedia;
    }>,
  ) => {
    setShowGiphy(false);
    const mediaUrl = e.nativeEvent.media.url;
    const content = {mediaUrl: mediaUrl};
    const messageType = MessageType.giphyGif;
    const sendRequest = {
      content: content,
      conversationId: conversationId,
      messageType: messageType,
      senderId: userId,
      timestampMS: Date.now(),
    };
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

  // ------ rendering of list -------
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

  // Length is the height of the row
  // Offset: distance in pixels of this row from the top.
  // index: current row index
  // We use a helper that gives an estimate of height based on what's in each cell & section header.
  // This is what lets us scroll.
  const getItemLayout = GetItemLayoutCalculation({
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

  //------- Handle auto scroll of list ------
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
          {showGiphy && (
            <GiphyGridView
              content={GiphyContent.trendingGifs()}
              cellPadding={3}
              style={styles.giphyDrawer}
              onMediaSelect={gifChosen}
            />
          )}
          <View style={styles.sendBox}>
            <SendBox
              conversationId={conversationId}
              conversationName={conversationName}
              userId={userId}
              sendMessage={doSend}
              setShowGiphy={setShowGiphy}
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
  giphyDrawer: {
    height: '40%',
  },
  sectionList: {
    backgroundColor: 'lightcoral',
    flex: 1,
  },
  sendBox: {width: '100%', marginBottom: 15},
  header: {
    width: '100%',
  },
});
