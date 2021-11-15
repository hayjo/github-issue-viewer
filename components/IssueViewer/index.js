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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../common/Card';
import Chip from '../common/Chip';
import SnackBar from '../common/SnackBar';

import useAggregatedIssueList from '../../hooks/useAggregatedIssueList';
import { parseDate, getContrastYIQ } from '../../utils';
import { COLORS, LIMIT, MESSAGE } from '../../constants';

import { viewStyles, textStyles, imageStyles } from './styles';

Icon.loadFont();

type RootStackParamList = {
  Issue: 'undefined',
  Repository: 'undefined',
  Browser: { uri: string, title: string | 'undefined' },
};

// $FlowFixMe: Cannot use `NativeStackScreenProps` as a type because it is an `any`-typed value.
type Props = NativeStackScreenProps<RootStackParamList, 'IssueViewer'>;

const IssueViewer: (props: Props) => Node = ({ navigation }) => {
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
  const handlePress = async (uri, title) => {
    const supported = await Linking.canOpenURL(uri);

    if (!supported) {
      setError(`${uri} ${MESSAGE.CANNOT_OPEN_PAGE}`);
      return;
    }

    navigation.navigate('Browser', { uri, title });
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
                onPress={() => handlePress(url, `#${number}`)}>
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

export default IssueViewer;
