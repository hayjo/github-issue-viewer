// @flow

type State = {
  list: Array<{ id: string }>,
  limit: number,
  hasExceedLimit: boolean,
  error: string,
};

type Action =
  | { type: 'SYNC_STORAGE_DATA', payload: Array<{ id: string }> }
  | { type: 'UPDATE', payload: { id: string } }
  | { type: 'SET_ERROR', payload: string }
  | { type: 'CONFIRM_LIMIT_EXCEED' };

type TUseStoredList = {
  list: Array<{ id: string }>,
  updateList: (item: { id: string }) => Promise<void>,
  hasExceedLimit: boolean,
  error: string,
  confirmLimitNotice: () => void,
};

export type { State, Action, TUseStoredList };
