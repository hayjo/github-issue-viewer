import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStoredList = ({ key, limit, notifyExceedLimit }) => {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const updateList = async newItem => {
    const updated = list.includes(newItem)
      ? list.filter(item => item !== newItem)
      : [...list, newItem];

    if (updated.length > limit) {
      notifyExceedLimit();
      return;
    }

    setList(updated);

    try {
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (err) {
      setError(`Could not update storage for key: ${key} ${err}`);
    }
  };

  useEffect(() => {
    const pullFromStorage = async () => {
      try {
        const fromStorage = await AsyncStorage.getItem(key);

        if (fromStorage) {
          return JSON.parse(fromStorage);
        }
      } catch (err) {
        setError(`Could not read from storage for key: ${key} ${err}`);
      }

      return null;
    };

    const initializeListFromStorage = async () => {
      const storageData = await pullFromStorage();

      setList(storageData || []);
    };

    initializeListFromStorage();
  }, [key]);

  return [list, updateList, error];
};

export default useStoredList;
