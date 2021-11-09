import React, { useContext, useState } from 'react';
import type { Element } from 'react';
import {
  SafeAreaView,
  Button,
  Image,
  Text,
  View,
  Alert,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RepoContext } from '../context';
import Search from '../Components/Search';

import { COLORS, SIZE } from '../constants';

Icon.loadFont();

function getProfileUrl(userId) {
  return `https://avatars.githubusercontent.com/u/${userId}?v=4`;
}

const Repository: () => Element = ({ navigation }) => {
  const { selectedRepoList, onSelectRepo } = useContext(RepoContext);
  const [showSearch, setShowSearch] = useState(false);

  const handleSelect = id => {
    const target = selectedRepoList.find(repo => repo.id === id);

    Alert.alert(
      'Delete',
      `${target.name} repository를 정말 삭제하시겠습니까?`,
      [
        {
          text: '삭제',
          onPress: () => onSelectRepo(target),
          style: 'cancel',
        },
        {
          text: '취소',
          onPress: () => {},
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {showSearch ? (
        <Search onCancel={() => setShowSearch(false)} />
      ) : (
        <View>
          <Button
            title="Search Repository"
            onPress={() => setShowSearch(true)}
          />
          <View style={styles.cardContainer}>
            {selectedRepoList.map(({ id, name, ownerId, ownerName }) => (
              <Pressable
                key={id}
                style={styles.card}
                onPress={() => handleSelect(id)}>
                <View style={styles.cardContent}>
                  <Image
                    key={id}
                    source={{ uri: getProfileUrl(ownerId) }}
                    style={styles.avatar}
                  />
                  <View style={styles.cardText}>
                    <Text style={styles.repoOwner}>{ownerName}</Text>
                    <Text style={styles.repoName}>{name}</Text>
                  </View>
                </View>
                <Icon color={COLORS.BORDER} name="close" size={SIZE.ICON} />
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.DEFAULT,
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    marginTop: 16,
  },
  card: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  cardText: {
    marginHorizontal: 12,
  },
  repoOwner: {
    color: COLORS.TEXT,
  },
  repoName: {
    marginTop: 4,
    fontSize: 16,
  },
});

export default Repository;
