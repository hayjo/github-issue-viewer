import React, { useContext } from 'react';
import type { Element } from 'react';
import { SafeAreaView, Button, StyleSheet } from 'react-native';

import { RepoContext } from '../context';
import IssueViewer from '../Components/IssueViewer';
import { COLORS } from '../constants';

const Home: () => Element = ({ navigation }) => {
  const { selectedRepoList } = useContext(RepoContext);

  return (
    <SafeAreaView style={styles.home}>
      <Button
        title="Manage Repository"
        onPress={() => navigation.navigate('Repository')}
      />
      <IssueViewer repoList={selectedRepoList} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  home: {
    backgroundColor: COLORS.DEFAULT,
  },
});

export default Home;
