import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {USERS} from '../store/user';

// In the real world you would want to handle sending, failed, acked, and have a wrapper for cell and content
export function MessageGroup(props: {senderId: number; dateString: string}) {
  // todo add avatar, sender display name etc
  const senderId = props.senderId;
  const user = USERS.get(senderId)!;
  return (
    <View style={styles.groupBar}>
      <Image style={styles.avatar} source={user.avatarURL} />
      <View style={styles.nameAndTime}>
        <Text style={styles.name}>{user.displayName}</Text>
        <Text> </Text>
        <Text style={styles.time}>{props.dateString}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupBar: {
    flex: 1,
    flexDirection: 'row',
  },
  nameAndTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  time: {
    color: 'lightgray',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 * 0.125,
  },
});
