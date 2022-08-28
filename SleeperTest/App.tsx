/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ConversationWindow} from './Screens/ConversationWindow';
import {HomeScreen} from './Screens/HomeScreen';
import {RootStackParamList} from './types';

//
const Stack = createNativeStackNavigator<RootStackParamList>();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="ConversationWindow"
          component={ConversationWindow}
          initialParams={{userId: 0, conversationName: 'Buddies'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
