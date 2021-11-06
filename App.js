/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import type { Element } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import Icon from 'react-native-vector-icons/Octicons';

import useStoredList from './hooks/useStoredList';
import { RepoContext } from './context';
import Home from './Components/Home';
import Error from './Components/Error';
import { LIMIT } from './constants';

Icon.loadFont();
enableScreens(true);

const Stack = createNativeStackNavigator();

const App: () => Element = () => {
  const [needNotice, setNeedNotice] = useState(false);
  const [hasError, setHasError] = useState(false);
  const notifyRepoLimit = () => setNeedNotice(true);
  const [repoList, updateRepoList, storageError] = useStoredList({
    key: 'repoList',
    limit: LIMIT.REPO_COUNT,
    notifyExceedLimit: notifyRepoLimit,
  });
  const notifyError = err => {
    console.log(err);
    setHasError(true);
  };
  const handleNoticeClick = () => setNeedNotice(false);

  useEffect(() => {
    if (storageError) {
      console.log(storageError);
      setHasError(true);
    }
  }, [storageError]);

  return (
    <RepoContext.Provider
      value={{
        selectedRepoList: repoList,
        onSelectRepo: updateRepoList,
        needNotice,
        onNoticeClick: handleNoticeClick,
        notifyError,
      }}>
      {hasError ? (
        <Error />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </RepoContext.Provider>
  );
};

export default App;
