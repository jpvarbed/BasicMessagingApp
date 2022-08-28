import {State, StateCreator} from 'zustand';
import {User} from '../types';

const PEOPLE = ['Jason', 'Dan', 'Alek', 'Sofia'];
export const store = createVanilla(subscribeWithSelector(immer(stateCreators)));

export const useStore = create(store);

export interface UserStore {
  user: {
    readonly users: Map<string, User>;
  };
}

export const createUserStore: StateCreator<
  State,
  // We need to list out the mutators (middlewares) we use here to get the right types
  [['zustand/subscribeWithSelector', never], ['zustand/immer', never]],
  [],
  UserStore
> = (set, get) => {
  return {users: []};
};
