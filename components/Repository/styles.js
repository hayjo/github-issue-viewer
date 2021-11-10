// @flow

import { StyleSheet } from 'react-native';
import type {
  ViewStyleProp,
  TextStyleProp,
  ImageStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

import { COLORS } from '../../constants';

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create({
  container: {
    backgroundColor: COLORS.DEFAULT,
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    marginTop: 16,
  },
  card: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    marginHorizontal: 12,
  },
});

const textStyles: { [string]: TextStyleProp } = StyleSheet.create({
  repoOwner: {
    color: COLORS.TEXT,
  },
  repoName: {
    marginTop: 4,
    fontSize: 16,
  },
});

const imageStyles: { [string]: ImageStyleProp } = StyleSheet.create({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginHorizontal: 4,
    marginVertical: 4,
  },
});

export { viewStyles, textStyles, imageStyles };
