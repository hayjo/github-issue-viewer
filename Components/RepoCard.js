import React from 'react';
import type { Element } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { COLORS, SIZE } from '../constants';

const RepoCard: () => Element = ({ title, description, onPress, selected }) => {
  return (
    <View style={styles.card}>
      <Icon style={styles.repoIcon} name="repo" size={SIZE.ICON} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} onPress={onPress}>
          {title}
        </Text>
        <Text numberOfLines={2}>{description}</Text>
      </View>
      <View style={styles.checkIcon}>
        {selected && (
          <Icon name="check" size={SIZE.ICON} color={COLORS.SELECTED} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderTopColor: COLORS.BORDER,
    borderTopWidth: 1,
    paddingRight: 5,
    paddingVertical: 10,
    height: 85,
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

export default RepoCard;
