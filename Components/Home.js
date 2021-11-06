import React, { useContext, useState } from 'react';
import type { Element } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
} from 'react-native';

import { RepoContext } from '../context';
import Search from '../Components/Search';

const Home: () => Element = ({ navigation }) => {
  const { selectedRepoList } = useContext(RepoContext);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <SafeAreaView>
      <Button title="Search" onPress={() => setShowSearch(true)} />
      <Modal
        animationType="slide"
        visible={showSearch}
        onDismiss={() => setShowSearch(false)}
        style={styles.modal}>
        <Search onCancel={() => setShowSearch(false)} />
      </Modal>
      <View>
        {selectedRepoList.map((id, title) => (
          <Text key={id}>
            repo #{id} {title}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
  },
});

export default Home;
