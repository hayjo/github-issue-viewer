// @flow

import React, { useContext, useState } from 'react';
import type { Node } from 'react';
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
import type {
  ViewStyleProp,
  TextStyleProp,
  ImageStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Search from '../Components/Search';

// import type { RootStackParamList } from '../types/nativeStack';
import { RepoContext } from '../context';
import { COLORS, SIZE } from '../constants';

Icon.loadFont();

function getProfileUrl(userId: string): string {
  return `https://avatars.githubusercontent.com/u/${userId}?v=4`;
}

const Repository: () => Node = () => {
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
    <SafeAreaView style={viewStyles.container}>
      {showSearch ? (
        <Search onCancel={() => setShowSearch(false)} />
      ) : (
        <View>
          <Button
            title="Search Repository"
            onPress={() => setShowSearch(true)}
          />
          <View style={viewStyles.cardContainer}>
            {selectedRepoList.map(({ id, name, ownerId, ownerName }) => (
              <Pressable
                key={id}
                style={viewStyles.card}
                onPress={() => handleSelect(id)}>
                <View style={viewStyles.cardContent}>
                  <Image
                    key={id}
                    source={{ uri: getProfileUrl(ownerId) }}
                    style={imageStyles.avatar}
                  />
                  <View style={viewStyles.cardTextContainer}>
                    <Text style={textStyles.repoOwner}>{ownerName}</Text>
                    <Text style={textStyles.repoName}>{name}</Text>
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

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create({
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
  cardTextContainer: {
    marginHorizontal: 12,
  },
});

const textStyles: { [string]: TextStyleProp } = StyleSheet.create({
  repoOwner: {
    color: COLORS.TEXT,
  },
  repoName: {
    marginTop: 4,
    fontSize: 16,
  },
});

const imageStyles: { [string]: ImageStyleProp } = StyleSheet.create({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginHorizontal: 4,
    marginVertical: 4,
  },
});

export default Repository;
