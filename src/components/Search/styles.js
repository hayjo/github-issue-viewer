// @flow

import { StyleSheet } from 'react-native';
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

import { COLORS } from '../../constants';

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

export { viewStyles, textStyles };
