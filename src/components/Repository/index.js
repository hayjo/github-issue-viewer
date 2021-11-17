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
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Search from '../../components/Search';
import { RepoContext } from '../../context';
import { COLORS, SIZE } from '../../constants';
import { viewStyles, textStyles, imageStyles } from './styles';

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

export default Repository;
