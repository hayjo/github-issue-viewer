import React from 'react';
import type { Element } from 'react';
import { SafeAreaView, Button, StyleSheet } from 'react-native';

import IssueViewer from '../Components/IssueViewer';
import { COLORS } from '../constants';

const Home: () => Element = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.home}>
      <Button
        title="Manage Repository"
        onPress={() => navigation.navigate('Repository')}
      />
      <IssueViewer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  home: {
    backgroundColor: COLORS.DEFAULT,
  },
});

export default Home;
