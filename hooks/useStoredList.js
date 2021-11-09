import { useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function reducer(state, action) {
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

const useStoredList = ({ key, limit }) => {
  const [{ list, hasExceedLimit, error }, dispatch] = useReducer(reducer, {
    list: [],
    hasExceedLimit: false,
    limit,
    error: '',
  });

  const updateList = async item => dispatch({ type: 'UPDATE', payload: item });
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
