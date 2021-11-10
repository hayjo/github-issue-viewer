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
} from 'react-native';
import type { Node } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import debounce from 'lodash.debounce';

import Card from '../common/Card';
import SnackBar from '../common/SnackBar';

import { RepoContext } from '../../context';
import { searchRepoByQuery } from '../../api';
import { COLORS, MESSAGE, SIZE, LIMIT } from '../../constants';

import { viewStyles, textStyles } from './styles';

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

export default Search;
