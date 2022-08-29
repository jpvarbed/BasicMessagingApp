import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LineBorder} from './LineBorder';

// In the real world you would want to handle sending, failed, acked, and have a wrapper for cell and content
export function ConversationHeader(props: {
  conversationName: string;
  goBack: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.titleAndBack}>
        <Button title="Back" onPress={props.goBack} />
        <Text style={styles.title}>{props.conversationName}</Text>
      </View>
      <LineBorder />
    </View>
  );
}
//     top: 0,
// position: 'absolute',
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: 'lightcyan',
  },
  titleAndBack: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 100,
  },
});
