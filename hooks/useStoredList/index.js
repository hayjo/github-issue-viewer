// @flow

import { useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TUseStoredList } from './types';
import reducer from './reducer';

const useStoredList: ({ key: string, limit: number }) => TUseStoredList = ({
  key,
  limit,
}) => {
  const [{ list, hasExceedLimit, error }, dispatch] = useReducer(reducer, {
    list: [],
    hasExceedLimit: false,
    limit,
    error: '',
  });

  const updateList: (item: { id: string }) => Promise<void> = async item =>
    dispatch({ type: 'UPDATE', payload: item });
  const confirmLimitNotice = () => dispatch({ type: 'CONFIRM_LIMIT_EXCEED' });

  useEffect(() => {
    const syncWithStorage = async () => {
      const fromStorage = await AsyncStorage.getItem(key);

      if (!fromStorage) {
        return;
      }

      try {
        dispatch({
          type: 'SYNC_STORAGE_DATA',
          payload: JSON.parse(fromStorage),
        });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    };

    syncWithStorage();
  }, [key]);

  useEffect(() => {
    const updateStorage = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(list));
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    };

    updateStorage();
  }, [key, list]);

  return { list, updateList, hasExceedLimit, error, confirmLimitNotice };
};

export default useStoredList;
