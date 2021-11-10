// @flow

import React from 'react';
import type { Node } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

import { COLORS } from '../../constants';

type Props = {
  text: string,
  textColor?: string,
  icon?: Node,
  style?: ViewStyleProp,
};

const Chip: (props: Props) => Node = ({ style, icon, text, textColor }) => {
  const textStyle = { color: textColor || COLORS.TEXT };

  return (
    <View style={[viewStyles.containerDefault, style, viewStyles.container]}>
      {icon && icon}
      <Text style={[textStyles.text, textStyle]}>{text}</Text>
    </View>
  );
};

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create({
  container: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  containerDefault: {
    backgroundColor: '#ffffff',
    borderColor: COLORS.BORDER,
  },
});

const textStyles: { [string]: TextStyleProp } = StyleSheet.create({
  text: {
    fontSize: 12,
  },
});

export default Chip;
