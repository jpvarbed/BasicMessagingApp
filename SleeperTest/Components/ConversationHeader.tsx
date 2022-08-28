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
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.titleAndBack}>
          <Button title="Back" onPress={props.goBack} />
          <Text style={styles.title}>{props.conversationName}</Text>
        </View>
        <LineBorder />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    top: 0,
    position: 'absolute',
    backgroundColor: 'lightcyan',
  },
  titleAndBack: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 6,
  },
});
