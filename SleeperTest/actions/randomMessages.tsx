import {Message, MessageType} from '../types';

// TODO use https://www.npmjs.com/package/random-seed https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript so i can recreate
const PEOPLE = ['Jason', 'Dan', 'Alek', 'Sofia'];
const TEXT_INPUT = [
  'Awesome',
  'Definitely second round',
  'Thats too early for a kicker',
];

const TIMES = [
  1601644541154, 1611644541154, 1621644541154, 1631644541154, 1641644541154,
];

// generate a random text message
export function randomTextMessage(
  conversationId: string,
  timeIndex: number,
): Message {
  const rand = Math.random();
  const peopleIndex = PEOPLE.length * rand;
  const textInputIndex = TEXT_INPUT.length * rand;
  return {
    messageId: timeIndex,
    conversationId: conversationId,
    senderId: PEOPLE[peopleIndex],
    content: {text: TEXT_INPUT[textInputIndex]},
    messageType: MessageType.text,
    timestampMS: TIMES[timeIndex],
  };
}

export function initialMessages(
  conversationId: string,
  numberOfMessages: number,
): Message[] {
  let messages = [];
  for (let i = 0; i < numberOfMessages; i++) {
    messages.push(randomTextMessage(conversationId, i));
  }
  return messages;
}
