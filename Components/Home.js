import React, { useContext, useState } from 'react';
import type { Element } from 'react';
import { SafeAreaView, Modal, Button, StyleSheet } from 'react-native';

import { RepoContext } from '../context';
import Search from '../Components/Search';
import IssueViewer from '../Components/IssueViewer';
import { COLORS } from '../constants';

const Home: () => Element = ({ navigation }) => {
  const { selectedRepoList } = useContext(RepoContext);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <SafeAreaView style={styles.home}>
      <Button title="Search Repository" onPress={() => setShowSearch(true)} />
      <Modal
        animationType="slide"
        visible={showSearch}
        onDismiss={() => setShowSearch(false)}
        style={styles.modal}>
        <Search onCancel={() => setShowSearch(false)} />
      </Modal>
      <IssueViewer repoList={selectedRepoList} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  home: {
    backgroundColor: COLORS.DEFAULT,
  },
  modal: {
    backgroundColor: COLORS.DEFAULT,
    width: '100%',
    height: '100%',
  },
});

export default Home;
