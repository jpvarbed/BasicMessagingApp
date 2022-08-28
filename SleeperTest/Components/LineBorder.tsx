import React from 'react';
import {StyleSheet, View} from 'react-native';

export function LineBorder() {
  return <View style={styles.border} />;
}
const styles = StyleSheet.create({
  border: {
    borderWidth: 0.5,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
