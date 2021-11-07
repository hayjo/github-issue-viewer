import React, { useContext, useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import type { Element } from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import RepoCard from './RepoCard';
import SnackBar from './SnackBar';
import { RepoContext } from '../context';
import { searchRepoByQuery } from '../api';
import { COLORS, MESSAGE } from '../constants';

const Search: () => Element = ({ onCancel }) => {
  const {
    selectedRepoList,
    onSelectRepo,
    hasExceedLimit,
    onNoticeClick,
    notifyError,
  } = useContext(RepoContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);
  const [repoList, setRepoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeSearch = query => setSearchQuery(query);

  const searchRepositories = useMemo(
    () => async query => {
      if (!query) {
        return;
      }

      setIsLoading(true);

      try {
        const searchResult = await searchRepoByQuery(query);
        const { totalCount, items } = searchResult;

        setRepoList(items);
        setResultCount(totalCount);
      } catch (err) {
        notifyError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [notifyError],
  );

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <Icon name="search" style={styles.searchIcon} size={16} />
              <TextInput
                placeholder="Search Repository"
                onChangeText={onChangeSearch}
                value={searchQuery}
                onSubmitEditing={() => searchRepositories(searchQuery)}
              />
            </View>
            <Button title="Cancel" onPress={onCancel} />
          </View>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.cardSection}>
              <View style={styles.resultCountContainer}>
                <Text style={styles.resultCount}>
                  {resultCount.toLocaleString()} repository results
                </Text>
              </View>
              {repoList &&
                repoList.map(({ id, full_name: fullName, description }) => (
                  <RepoCard
                    key={id}
                    title={fullName}
                    description={description}
                    onPress={() => onSelectRepo(fullName)}
                    selected={selectedRepoList.includes(fullName)}
                  />
                ))}
            </View>
          )}
        </View>
      </ScrollView>
      {hasExceedLimit && (
        <SnackBar onPress={() => onNoticeClick()} style={styles.noticeSnackBar}>
          <Text style={styles.noticeText}>{MESSAGE.MAX_REPO_COUNT}</Text>
        </SnackBar>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
  },
  searchIcon: {
    alignSelf: 'center',
    marginHorizontal: 8,
    color: COLORS.ICON,
  },
  cardSection: {
    paddingHorizontal: 16,
  },
  resultCountContainer: {
    marginVertical: 16,
  },
  resultCount: {
    fontSize: 16,
    color: COLORS.SUBTITLE,
  },
  noticeSnackBar: {
    padding: 10,
    backgroundColor: COLORS.NOTICE,
    borderRadius: 4,
  },
  noticeText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default Search;
