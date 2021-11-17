// @flow

import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import Icon from 'react-native-vector-icons/Octicons';

import useStoredList from './hooks/useStoredList';
import { RepoContext } from './context';
import IssueViewer from './components/IssueViewer';
import Repository from './components/Repository';
import Browser from './components/common/Browser';
import Error from './components/Error';
import { LIMIT, SIZE } from './constants';
import type { RootStackParamList } from './types';

Icon.loadFont();
enableScreens(true);

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: () => Node = () => {
  const {
    list: repoList,
    updateList,
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
        onSelectRepo: updateList,
        onNoticeClick: confirmLimitNotice,
        notifyError,
      }}>
      {hasError ? (
        <Error />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Issue">
            <Stack.Screen
              name="Issue"
              component={IssueViewer}
              options={({ navigation }) => ({
                headerRight: () => (
                  <Text onPress={() => navigation.navigate('Repository')}>
                    <Icon name="repo" size={SIZE.ICON} />
                  </Text>
                ),
              })}
            />
            <Stack.Screen name="Repository" component={Repository} />
            <Stack.Screen
              name="Browser"
              component={Browser}
              options={({ route }) => ({ title: route.params.title })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </RepoContext.Provider>
  );
};

export default App;
