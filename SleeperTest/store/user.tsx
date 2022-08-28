import {User} from '../types';

// This is a little side project so we just make a fake map of users.
// In practice we'd pull down info, store them in a map, sync them, have a user store, combine state with messages
export const USERS = new Map<number, User>([
  [
    0,
    {
      userId: 0,
      displayName: 'Jason',
      avatarURL: require('../resources/images/bills.png'),
    },
  ],
  [
    1,
    {
      userId: 1,
      displayName: 'Dan',
      avatarURL: require('../resources/images/cardinals.png'),
    },
  ],
  [
    2,
    {
      userId: 2,
      displayName: 'Alek',
      avatarURL: require('../resources/images/panther.png'),
    },
  ],
  [
    3,
    {
      userId: 3,
      displayName: 'Sofia',
      avatarURL: require('../resources/images/ravens.png'),
    },
  ],
  [
    4,
    {
      userId: 4,
      displayName: 'Nicole',
      avatarURL: require('../resources/images/falcons.png'),
    },
  ],
]);
