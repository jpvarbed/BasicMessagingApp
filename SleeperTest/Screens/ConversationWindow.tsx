import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
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

const RANDOM_MESSAGE_TIME_MS = 5000;
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
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  console.log(
    'Enter conversation: ' + conversationName + ' id ' + conversationId,
  );

  // ----- sending messages-------
  const realSend = (sendRequest: LocalSendRequest) => {
    sendMessage(sendRequest);
    scrollToBottom(true);
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
    realSend(sendRequest);
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
    getSectionFooterHeight: () => {
      return AVATAR_HEIGHT;
    },
  });

  //------- Handle auto scroll of list ------
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const scrollToBottom = (animated: boolean) => {
    if (!groups.length) {
      return;
    }
    messageListRef.current?.scrollToLocation({
      viewPosition: 0,
      itemIndex: 0,
      sectionIndex: 0,
      animated: animated,
    });
  };

  // When a new message arrives, this scrolls us down if the user hasn't scrolled.
  const contentSizeChange = () => {
    if (!shouldAutoScroll || showGiphy || keyboardStatus) {
      return;
    }
    scrollToBottom(true);
  };

  const clickedOnList = () => {
    Keyboard.dismiss;
    setShowGiphy(false);
  };

  const endReached = () => {
    setShouldAutoScroll(true);
  };

  // If the user scrolls up, disable auto scroll.
  // We cannot easily tell if its the user so we look to see if there's an up scroll.
  // This isn't technically correct as a user could scroll up then down to look at something.
  // A better solution would combine state to determine if the scroll was from the user or from our
  // 'scrolltobottom'
  const [verticalScrollOffset, setVerticalScrollOffset] = useState<number>(0);
  const scrolled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const eventOffset = event.nativeEvent.contentOffset.y;
    if (verticalScrollOffset === 0) {
      setVerticalScrollOffset(eventOffset);
      return;
    }

    const downScroll = eventOffset < verticalScrollOffset;
    setVerticalScrollOffset(eventOffset);
    // if down scroll, set auto, if up turn it off
    setShouldAutoScroll(downScroll);
    console.log('set autoscroll' + downScroll);
  };
  return (
    <SafeAreaView style={styles.safeview}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={60}>
        <ConversationHeader
          conversationName={conversationName}
          goBack={nav.goBack}
        />
        <View style={styles.container}>
          <View style={styles.sectionList}>
            <TouchableWithoutFeedback onPress={clickedOnList}>
              <SectionList
                sections={groups}
                ref={messageListRef}
                renderItem={renderMessage}
                renderSectionFooter={renderSection}
                keyExtractor={keyExtractor}
                automaticallyAdjustKeyboardInsets={true}
                automaticallyAdjustContentInsets={true}
                onContentSizeChange={contentSizeChange}
                getItemLayout={getItemLayout}
                stickySectionHeadersEnabled={false}
                onScroll={scrolled}
                onEndReached={endReached}
                inverted={true}
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
              sendMessage={realSend}
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
    backgroundColor: 'lightcyan',
    flex: 1,
  },
  keyboard: {
    flex: 1,
    backgroundColor: 'lightcyan',
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
    backgroundColor: 'white',
    flex: 1,
  },
  sendBox: {width: '100%', marginBottom: 15},
  header: {
    width: '100%',
  },
});
