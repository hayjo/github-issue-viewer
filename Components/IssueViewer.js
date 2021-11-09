import React, { useState, useEffect } from 'react';
import type { Element } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Linking,
  ActivityIndicator,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import Chip from './Chip';
import SnackBar from './SnackBar';
import useAggregatedIssueList from '../hooks/useAggregatedIssueList';
import { parseDate, getContrastYIQ } from '../utils';
import { COLORS, LIMIT } from '../constants';

Icon.loadFont();

const IssueViewer: () => Element = ({ navigation }) => {
  const {
    list,
    page,
    isFetching,
    fetchingError,
    movePrevPage,
    moveNextPage,
    movePage,
  } = useAggregatedIssueList({ perPage: LIMIT.ISSUE_PER_PAGE });
  const [error, setError] = useState('');
  const handlePress = async url => {
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      setError(`${url} 페이지를 열 수 없습니다.`);
      return;
    }

    try {
      await Linking.openURL(url);
    } catch {
      setError(`${url} 페이지를 열 수 없습니다.`);
    }
  };

  useEffect(() => {
    if (fetchingError) {
      setError(fetchingError);
    }
  }, [fetchingError]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.issueListContainer}>
        <View style={styles.issueSection}>
          {list.map(
            ({
              repoName,
              number,
              title,
              url,
              comments,
              labels,
              createdAt,
              assignees,
            }) => (
              <Card
                key={`${repoName}#${number}`}
                onPress={() => handlePress(url)}>
                <Icon
                  style={styles.issueIcon}
                  name="record-circle-outline"
                  size={20}
                />
                <View style={styles.issueCardContent}>
                  <View style={styles.issueCardHeader}>
                    <Text style={styles.repoName}>
                      {repoName} #{number}
                    </Text>
                  </View>
                  <Text style={styles.issueTitle}>{title}</Text>
                  <View style={styles.chipContainer}>
                    {labels.map(({ name, id, color }) => (
                      <Chip
                        key={id}
                        style={{
                          backgroundColor: `#${color}`,
                          ...styles.labelChip,
                        }}
                        text={name}
                        textColor={getContrastYIQ(color)}
                      />
                    ))}
                  </View>
                  <View style={styles.chipContainer}>
                    {assignees.length ? (
                      <View style={styles.assigneeContainer}>
                        {assignees.slice(0, 2).map(uri => (
                          <Image
                            key={uri}
                            source={{ uri }}
                            style={styles.assigneeAvatar}
                          />
                        ))}
                        {assignees.length > 2 ? (
                          <Chip
                            style={styles.assigneeCountChip}
                            text={`+${assignees.length - 2}`}
                          />
                        ) : null}
                      </View>
                    ) : null}
                    {comments ? (
                      <Chip
                        style={styles.comment}
                        icon={
                          <Icon
                            name="comment-multiple-outline"
                            size={14}
                            color={COLORS.TEXT}
                            style={styles.commentIcon}
                          />
                        }
                        text={comments}
                      />
                    ) : null}
                  </View>
                </View>
                <Text style={styles.time}>{parseDate(createdAt)}</Text>
              </Card>
            ),
          )}
        </View>
      </ScrollView>
      <View style={styles.pageNavigator}>
        {isFetching ? (
          <ActivityIndicator />
        ) : (
          <>
            <Text onPress={() => movePage(0)}>
              <Icon name="chevron-double-left" size={24} color={COLORS.TEXT} />
            </Text>
            <Text style={styles.chevron} onPress={movePrevPage}>
              <Icon name="chevron-left" size={24} color={COLORS.TEXT} />
            </Text>
            <Text>page {page + 1}</Text>
            <Text style={styles.chevron} onPress={moveNextPage}>
              <Icon name="chevron-right" size={24} color={COLORS.TEXT} />
            </Text>
          </>
        )}
      </View>
      {error ? (
        <SnackBar
          onPress={() => {}}
          style={styles.noticeSnackBar}
          text={error}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.DEFAULT,
    height: '100%',
    width: '100%',
  },
  pageNavigator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueListContainer: {
    flex: 1,
  },
  issueSection: {
    paddingHorizontal: 16,
  },
  issueCard: {
    borderTopColor: COLORS.BORDER,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingRight: 5,
    paddingVertical: 10,
  },
  issueIcon: {
    marginLeft: 2,
    marginRight: 8,
    color: '#1a7f37',
  },
  issueCardContent: {
    flex: 1,
  },
  issueCardHeader: {
    marginTop: 2,
    flexDirection: 'row',
  },
  repoName: {
    marginRight: 4,
    marginBottom: 4,
    color: COLORS.TEXT,
  },
  time: {
    marginLeft: 8,
    color: COLORS.TEXT,
  },
  issueNumber: {
    color: COLORS.TEXT,
  },
  issueTitle: {
    flex: 1,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  labelChip: {
    marginRight: 4,
    marginTop: 4,
  },
  comment: {
    marginVertical: 4,
  },
  commentIcon: {
    marginRight: 4,
    marginTop: 1,
  },
  assigneeContainer: {
    flexDirection: 'row',
    margin: 4,
  },
  assigneeAvatar: {
    width: 20,
    height: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginLeft: -6,
    borderWidth: 2,
    borderColor: COLORS.DEFAULT,
    backgroundColor: COLORS.DEFAULT,
  },
  assigneeCountChip: {
    paddingHorizontal: 5,
    paddingVertical: 0,
    borderRadius: 16,
    marginLeft: -6,
    borderWidth: 2,
    borderColor: COLORS.DEFAULT,
    backgroundColor: COLORS.SEARCH_BACKGROUND,
  },
  chevron: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
});

export default IssueViewer;
