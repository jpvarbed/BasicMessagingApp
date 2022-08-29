import {USERS} from '../store/user';
import {LocalSendRequest, MessageType} from '../types';

// TODO use https://www.npmjs.com/package/random-seed https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript so i can recreate

const TEXT_INPUT = [
  'Awesome',
  'Definitely second round',
  'Thats too early for a kicker',
  "I'm going 0 rb",
  "I'll trade you",
  'The Lions rb situation is tempting',
];

export function randomMessageSend(conversationId: string): LocalSendRequest {
  const rand = Math.random();
  const peopleIndex = Math.round((USERS.size - 1) * rand);
  const textInputIndex = Math.round((TEXT_INPUT.length - 1) * rand);
  return {
    conversationId: conversationId,
    senderId: USERS.get(peopleIndex)!.userId,
    content: {text: TEXT_INPUT[textInputIndex]},
    messageType: MessageType.text,
    timestampMS: Date.now(),
  };
}
// const TIMES = [
//   1601644541154, 1611644541154, 1621644541154, 1631644541154, 1641644541154,
// ];

// // generate a random text message
// export function randomTextMessage(
//   conversationId: string,
//   timeIndex: number,
// ): Message {
//   const rand = Math.random();
//   const peopleIndex = Math.round((USERS.size - 1) * rand);
//   const textInputIndex = Math.round(TEXT_INPUT.length * rand);
//   return {
//     messageId: timeIndex,
//     conversationId: conversationId,
//     senderId: USERS.get(peopleIndex)!.userId,
//     content: {text: TEXT_INPUT[textInputIndex]},
//     messageType: MessageType.text,
//     timestampMS: TIMES[timeIndex],
//   };
// }

// export function initialMessages(
//   conversationId: string,
//   numberOfMessages: number,
// ): Message[] {
//   let messages = [];
//   for (let i = 0; i < numberOfMessages; i++) {
//     messages.push(randomTextMessage(conversationId, i));
//   }
//   return messages;
// }
