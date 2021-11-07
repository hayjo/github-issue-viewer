import React, { useEffect, useState } from 'react';
import type { Element } from 'react';
import {
  ScrollView,
  Linking,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import Chip from './Chip';
import SnackBar from './SnackBar';
import { parseDate, getContrastYIQ } from '../utils';
import { getIssuesByRepoFullName } from '../api';
import { COLORS } from '../constants';

Icon.loadFont();

const IssueViewer: () => Element = ({ repoList }) => {
  const [issueList, setIssueList] = useState([]);
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
    const searchIssues = async () => {
      const searched = await Promise.all(
        repoList.map(name => getIssuesByRepoFullName(name)),
      );

      setIssueList(searched.flat());
    };

    searchIssues();
  }, [repoList]);

  return (
    <View>
      <ScrollView style={styles.card}>
        <View style={styles.issueSection}>
          {issueList.map(
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
                            color="#57606a"
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
      {error ? (
        <SnackBar
          onPress={() => setError(false)}
          style={styles.noticeSnackBar}
          text={error}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: '#57606a',
  },
  time: {
    marginLeft: 8,
    color: '#57606a',
  },
  issueNumber: {
    color: '#57606a',
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
});

export default IssueViewer;
