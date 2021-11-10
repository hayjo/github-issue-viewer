// @flow

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

import type {
  ViewStyleProp,
  TextStyleProp,
  ImageStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

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

export { viewStyles, textStyles, imageStyles };
