/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import type { Element } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import Icon from 'react-native-vector-icons/Octicons';

import { RepoContext } from './context';
import Home from './Components/Home';
import Error from './Components/Error';
import { LIMIT } from './constants';

Icon.loadFont();
enableScreens(true);

const Stack = createNativeStackNavigator();

const App: () => Element = () => {
  const [repoList, setRepoList] = useState([]);
  const [needNotice, setNeedNotice] = useState(false);
  const [hasError, setHasError] = useState(false);
  const notifyRepoLimit = () => setNeedNotice(true);
  const handleSelectRepo = repoId => {
    setRepoList(prevList => {
      if (prevList.includes(repoId)) {
        setNeedNotice(false);

        return prevList.filter(id => id !== repoId);
      }

      if (prevList.length >= LIMIT.REPO_COUNT) {
        setNeedNotice(true);
        notifyRepoLimit();

        return prevList;
      }

      return [...prevList, repoId];
    });
  };
  const handleNoticeClick = () => setNeedNotice(false);
  const notifyError = err => {
    console.log(err);
    setHasError(true);
  };

  return (
    <RepoContext.Provider
      value={{
        selectedRepoList: repoList,
        onSelectRepo: handleSelectRepo,
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
