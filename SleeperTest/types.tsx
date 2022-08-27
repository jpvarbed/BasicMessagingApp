import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// We have just two pages, Home & Conversation Window.
export type RootStackParamList = {
  Home: undefined;
  ConversationWindow: {userId: string; conversationName: string};
};

// Type used to navigate for Home
export type HomeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type HomeScreenProp = NativeStackScreenProps<RootStackParamList, 'Home'>;
