// @flow

import type { State, Action } from './types';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SYNC_STORAGE_DATA':
      const storageData = action.payload;

      return { ...state, list: storageData };
    case 'UPDATE':
      const newItem = action.payload;
      const updated = state.list.find(({ id }) => newItem.id === id)
        ? state.list.filter(({ id }) => newItem.id !== id)
        : [...state.list, newItem];

      if (updated.length > state.limit) {
        return { ...state, hasExceedLimit: true };
      }

      return { ...state, list: updated, hasExceedLimit: false };
    case 'SET_ERROR':
      const error = action.payload;

      return { ...state, error };
    case 'CONFIRM_LIMIT_EXCEED':
      return { ...state, hasExceedLimit: false };
    default:
      return state;
  }
}

export default reducer;
