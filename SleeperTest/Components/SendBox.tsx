import React, {useState} from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {LocalSendRequest, MessageType} from '../types';
import {LineBorder} from './LineBorder';
import {
  GiphySDK,
  GiphyGridView,
  GiphyContent,
  GiphyMedia,
} from '@giphy/react-native-sdk';

// const gifURL = 'https://api.giphy.com/v1/gifs/trending';
// const GIF_LIMIT = 50;
// const fetchURL =
//   gifURL + '?api_key=' + APIKEY.toLowerCase() + '&limit=' + GIF_LIMIT;

// async function fetchTrending() {
//   try {
//     console.log(fetchURL);
//     let response = await fetch(fetchURL, {});
//     let json = await response.json();
//     return json;
//   } catch (error) {
//     console.error(error);
//   }
// }

const APIKEY = '76792192255c42c3a11c58ea1acfbe27';
GiphySDK.configure({apiKey: APIKEY});

/*
Handles input of new message data.
*/
//(sendRequest: LocalSendRequest)
export function SendBox(props: {
  userId: number;
  conversationId: string;
  conversationName: string;
  sendMessage: (sendRequest: LocalSendRequest) => void;
}) {
  //const textBoxPrompt = 'Send a message to... ' + props.conversationName;
  const [input, setInput] = useState('');
  const [showGiphy, setShowGiphy] = useState(false);

  const inputText = (text: string) => {
    setInput(text);
  };

  const hitSend = () => {
    console.log('hit send' + input);
    const content = {text: input};
    setInput('');
    const conversationId = props.conversationId;
    const messageType = MessageType.text;
    const sendRequest = {
      content: content,
      conversationId: conversationId,
      messageType: messageType,
      senderId: props.userId,
      timestampMS: Date.now(),
    };
    props.sendMessage(sendRequest);
  };

  const gifHit = () => {
    setShowGiphy(!showGiphy);
  };

  const gifChosen = (
    e: NativeSyntheticEvent<{
      media: GiphyMedia;
    }>,
  ) => {
    setShowGiphy(false);
    const mediaUrl = e.nativeEvent.media.url;
    const content = {mediaUrl: mediaUrl};
    const conversationId = props.conversationId;
    const messageType = MessageType.giphyGif;
    const sendRequest = {
      content: content,
      conversationId: conversationId,
      messageType: messageType,
      senderId: props.userId,
      timestampMS: Date.now(),
    };
    props.sendMessage(sendRequest);
  };

  return (
    <SafeAreaView>
      {showGiphy && (
        <GiphyGridView
          content={GiphyContent.trendingGifs()}
          cellPadding={3}
          style={{height: 400}}
          onMediaSelect={gifChosen}
        />
      )}
      <View style={styles.container}>
        <LineBorder />
        <View style={styles.sendBox}>
          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={2}
            value={input}
            onChangeText={inputText}
          />
          <TouchableOpacity activeOpacity={0.85} onPress={hitSend}>
            <Text>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={gifHit}>
            <Text>GIF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// todo handle keyboard rising
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: 'lightcyan',
  },
  sendBox: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
  },
  input: {flex: 1, fontSize: 20, color: 'black'},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});
