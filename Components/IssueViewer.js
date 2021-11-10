// @flow

import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Linking,
  ActivityIndicator,
  Pressable,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import type {
  ViewStyleProp,
  TextStyleProp,
  ImageStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from './Card';
import Chip from './Chip';
import SnackBar from './SnackBar';

import useAggregatedIssueList from '../hooks/useAggregatedIssueList';
import { parseDate, getContrastYIQ } from '../utils';
import { COLORS, LIMIT } from '../constants';

Icon.loadFont();

const IssueViewer: () => Node = () => {
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
    <SafeAreaView style={viewStyles.container}>
      <ScrollView style={viewStyles.issueListContainer}>
        <View style={viewStyles.issueSection}>
          {list.map(
            ({
              fullName,
              number,
              title,
              url,
              comments,
              labels,
              createdAt,
              assignees,
            }) => (
              <Card
                key={`${fullName}#${number}`}
                onPress={() => handlePress(url)}>
                <Icon
                  style={textStyles.issueIcon}
                  name="record-circle-outline"
                  size={20}
                  color={COLORS.ISSUE}
                />
                <View style={viewStyles.issueCardContent}>
                  <View style={viewStyles.issueCardHeader}>
                    <Text style={textStyles.repoName}>
                      {fullName} #{number}
                    </Text>
                  </View>
                  <Text style={textStyles.issueTitle}>{title}</Text>
                  <View style={viewStyles.chipContainer}>
                    {labels.map(({ name, id, color }) => (
                      <Chip
                        key={id}
                        style={[
                          { backgroundColor: `#${color}` },
                          viewStyles.labelChip,
                        ]}
                        text={name}
                        textColor={getContrastYIQ(color)}
                      />
                    ))}
                  </View>
                  <View style={viewStyles.chipContainer}>
                    {assignees.length ? (
                      <View style={viewStyles.assigneeContainer}>
                        {assignees.slice(0, 2).map(uri => (
                          <Image
                            key={uri}
                            source={{ uri }}
                            style={imageStyles.assigneeAvatar}
                          />
                        ))}
                        {assignees.length > 2 ? (
                          <Chip
                            style={viewStyles.assigneeCountChip}
                            text={`+${assignees.length - 2}`}
                          />
                        ) : null}
                      </View>
                    ) : null}
                    {comments ? (
                      <Chip
                        style={viewStyles.comment}
                        icon={
                          <Icon
                            name="comment-multiple-outline"
                            size={14}
                            color={COLORS.TEXT}
                            style={textStyles.commentIcon}
                          />
                        }
                        text={String(comments)}
                      />
                    ) : null}
                  </View>
                </View>
                <Text style={textStyles.time}>{parseDate(createdAt)}</Text>
              </Card>
            ),
          )}
        </View>
      </ScrollView>
      <View style={viewStyles.pageNavigator}>
        {isFetching ? (
          <ActivityIndicator />
        ) : (
          <>
            <Pressable onPress={() => movePage(0)}>
              <Icon name="chevron-double-left" size={24} color={COLORS.TEXT} />
            </Pressable>
            <Pressable style={viewStyles.chevron} onPress={movePrevPage}>
              <Icon name="chevron-left" size={24} color={COLORS.TEXT} />
            </Pressable>
            <Text>page {page + 1}</Text>
            <Pressable style={viewStyles.chevron} onPress={moveNextPage}>
              <Icon name="chevron-right" size={24} color={COLORS.TEXT} />
            </Pressable>
          </>
        )}
      </View>
      {error ? <SnackBar onPress={() => {}} text={error} /> : null}
    </SafeAreaView>
  );
};

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create({
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
  issueCardContent: {
    flex: 1,
  },
  issueCardHeader: {
    marginTop: 2,
    flexDirection: 'row',
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
  assigneeContainer: {
    flexDirection: 'row',
    margin: 4,
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

const textStyles: { [string]: TextStyleProp } = StyleSheet.create({
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
  issueIcon: {
    marginLeft: 2,
    marginRight: 8,
  },
  commentIcon: {
    marginRight: 4,
    marginTop: 1,
  },
});

const imageStyles: { [string]: ImageStyleProp } = StyleSheet.create({
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
});

export default IssueViewer;
