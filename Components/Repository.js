import React, { useContext, useState } from 'react';
import type { Element } from 'react';
import { SafeAreaView, Button, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RepoContext } from '../context';
import Search from '../Components/Search';
import Card from './Card';
import { COLORS, SIZE } from '../constants';

Icon.loadFont();

const Repository: () => Element = ({ navigation }) => {
  const { selectedRepoList, onSelectRepo } = useContext(RepoContext);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <SafeAreaView style={styles.home}>
      {showSearch ? (
        <Search onCancel={() => setShowSearch(false)} />
      ) : (
        <View>
          <Button
            title="Search Repository"
            onPress={() => setShowSearch(true)}
          />
          {selectedRepoList.map(title => (
            <Card key={title} onPress={() => onSelectRepo(title)}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Icon
                style={styles.closeIcon}
                name="close-circle-outline"
                size={SIZE.ICON}
              />
            </Card>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  home: {
    backgroundColor: COLORS.DEFAULT,
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    flex: 1,
    marginHorizontal: 8,
  },
  closeIcon: {
    color: COLORS.ICON,
  },
});

export default Repository;
