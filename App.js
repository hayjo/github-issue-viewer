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
  const {
    list: repoList,
    updateList: updateRepoList,
    hasExceedLimit,
    confirmLimitNotice,
    error,
  } = useStoredList({
    key: 'repoList',
    limit: LIMIT.REPO_COUNT,
  });
  const [hasError, setHasError] = useState(false);

  const notifyError = err => {
    console.log(err);
    setHasError(true);
  };

  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);

  return (
    <RepoContext.Provider
      value={{
        selectedRepoList: repoList,
        hasExceedLimit,
        onSelectRepo: updateRepoList,
        onNoticeClick: confirmLimitNotice,
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
