// @flow

import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import type { Node } from 'react';
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';
import Icon from 'react-native-vector-icons/Octicons';
import debounce from 'lodash.debounce';

import Card from './Card';
import SnackBar from './SnackBar';

import { RepoContext } from '../context';
import { searchRepoByQuery } from '../api';
import { COLORS, MESSAGE, SIZE, LIMIT } from '../constants';

Icon.loadFont();

type Props = {
  onCancel: () => void,
};

const Search: (props: Props) => Node = ({ onCancel }) => {
  const {
    selectedRepoList,
    onSelectRepo,
    hasExceedLimit,
    onNoticeClick,
    notifyError,
  } = useContext(RepoContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [nextPage, setNextPage] = useState(1);
  const [resultCount, setResultCount] = useState(0);
  const [repoList, setRepoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);
  const debouncingTime = nextPage === 1 ? 0 : LIMIT.SEARCH_DEBOUNCING_TIME;

  const onChangeSearch = query => setSearchQuery(query);

  const searchRepositories = debounce(async (query, pageNumber) => {
    if (!query) {
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const searchResult = await searchRepoByQuery(query, pageNumber);
      const { totalCount, items } = searchResult;

      setRepoList(prevList => [...prevList, ...items]);
      setResultCount(totalCount);

      if (items.length) {
        setNextPage(pageNumber + 1);
      }
    } catch (err) {
      notifyError(err);
    } finally {
      setIsLoading(false);
    }
  }, debouncingTime);

  const renderItem = ({ item }) => {
    const { id, name, owner, description } = item;
    const { id: ownerId, login: ownerName } = owner;
    const fullName = `${ownerName}/${name}`;

    return (
      <Card
        key={id}
        onPress={() => onSelectRepo({ id, name, ownerId, ownerName })}>
        <Icon style={textStyles.repoIcon} name="repo" size={SIZE.ICON} />
        <View style={viewStyles.cardContent}>
          <Text style={textStyles.cardTitle}>{fullName}</Text>
          <Text numberOfLines={2}>{description}</Text>
        </View>
        {selectedRepoList.find(repo => repo.id === id) ? (
          <View style={viewStyles.checkIconContainer}>
            <Icon name="check" size={SIZE.ICON} color={COLORS.SELECTED} />
          </View>
        ) : null}
      </Card>
    );
  };

  const listHeader = (
    <Text style={textStyles.resultCount}>
      {resultCount.toLocaleString()} repository results
    </Text>
  );

  const listFooter = isLoading ? <ActivityIndicator /> : null;

  useEffect(() => {
    if (ref?.current) {
      ref.current.focus();
    }
  }, []);

  useEffect(() => {
    setRepoList([]);
    setNextPage(1);
  }, [searchQuery]);

  return (
    <SafeAreaView style={viewStyles.container}>
      <View style={viewStyles.searchBarContainer}>
        <View style={viewStyles.searchBar}>
          <Icon name="search" style={textStyles.searchIcon} size={16} />
          <TextInput
            ref={ref}
            placeholder="Search Repository"
            onChangeText={onChangeSearch}
            value={searchQuery}
            onSubmitEditing={() => searchRepositories(searchQuery, nextPage)}
          />
        </View>
        <Button title="Cancel" onPress={onCancel} />
      </View>
      <View style={viewStyles.mainContainer}>
        <FlatList
          data={repoList}
          style={viewStyles.cardContainer}
          renderItem={renderItem}
          keyExtractor={({ id }) => String(id)}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          onEndReached={() => searchRepositories(searchQuery, nextPage)}
        />
      </View>
      {hasExceedLimit ? (
        <SnackBar
          onPress={() => onNoticeClick()}
          text={MESSAGE.MAX_REPO_COUNT}
        />
      ) : null}
    </SafeAreaView>
  );
};

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    marginHorizontal: 12,
  },
  searchBar: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 2,
    backgroundColor: COLORS.SEARCH_BACKGROUND,
    borderRadius: 8,
    overflow: 'hidden',
    paddingRight: 4,
  },
  mainContainer: {
    flex: 1,
  },
  cardContainer: {
    paddingHorizontal: 16,
  },
  cardContent: {
    padding: 2,
    flex: 1,
    overflow: 'hidden',
  },
  checkIconContainer: {
    marginVertical: 5,
    marginLeft: 4,
    alignSelf: 'flex-start',
  },
});

const textStyles: { [string]: TextStyleProp } = StyleSheet.create({
  cardTitle: {
    color: COLORS.TITLE,
    fontSize: 16,
  },
  resultCount: {
    marginBottom: 12,
    fontSize: 16,
    color: COLORS.SUBTITLE,
  },
  searchIcon: {
    alignSelf: 'center',
    marginHorizontal: 8,
    color: COLORS.ICON,
  },
  repoIcon: {
    marginLeft: 2,
    marginRight: 8,
    marginVertical: 5,
    color: COLORS.ICON,
  },
});

export default Search;
