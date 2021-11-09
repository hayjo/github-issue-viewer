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
import type { Element } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import debounce from 'lodash.debounce';
import Card from './Card';
import SnackBar from './SnackBar';
import { RepoContext } from '../context';
import { searchRepoByQuery } from '../api';
import { COLORS, MESSAGE, SIZE, LIMIT } from '../constants';

Icon.loadFont();

const Search: () => Element = ({ onCancel }) => {
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
        <Icon style={styles.repoIcon} name="repo" size={SIZE.ICON} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{fullName}</Text>
          <Text numberOfLines={2}>{description}</Text>
        </View>
        {selectedRepoList.find(repo => repo.id === id) ? (
          <View style={styles.checkIcon}>
            <Icon name="check" size={SIZE.ICON} color={COLORS.SELECTED} />
          </View>
        ) : null}
      </Card>
    );
  };

  const listHeader = (
    <Text style={styles.resultCount}>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" style={styles.searchIcon} size={16} />
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
      <View style={styles.mainContainer}>
        <FlatList
          data={repoList}
          style={styles.cardContainer}
          renderItem={renderItem}
          keyExtractor={({ id }) => id}
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

const styles = StyleSheet.create({
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
  searchIcon: {
    alignSelf: 'center',
    marginHorizontal: 8,
    color: COLORS.ICON,
  },
  mainContainer: {
    flex: 1,
  },
  cardContainer: {
    paddingHorizontal: 16,
  },
  resultCount: {
    marginBottom: 12,
    fontSize: 16,
    color: COLORS.SUBTITLE,
  },
  repoIcon: {
    marginLeft: 2,
    marginRight: 8,
    marginVertical: 5,
    color: COLORS.ICON,
  },
  cardContent: {
    padding: 2,
    flex: 1,
    overflow: 'hidden',
  },
  cardTitle: {
    color: COLORS.TITLE,
    fontSize: 16,
  },
  checkIcon: {
    marginVertical: 5,
    marginLeft: 4,
    alignSelf: 'flex-start',
  },
});

export default Search;
