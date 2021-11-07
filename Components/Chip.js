import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const Chip = ({ style, icon, text, textColor }) => {
  const backgroundColor = style?.backgroundColor || COLORS.DEFAULT;
  const borderColor =
    backgroundColor === COLORS.DEFAULT ? COLORS.BORDER : backgroundColor;
  const containerStyle = style
    ? {
        ...style,
        backgroundColor,
        borderColor: style?.borderColor || borderColor,
      }
    : styles.containerDefault;
  const textStyle = textColor ? { color: textColor } : styles.textDefault;

  return (
    <View style={[styles.container, containerStyle]}>
      {icon && icon}
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  containerDefault: {
    borderColor: COLORS.BORDER,
  },
  text: {
    fontSize: 12,
  },
  textDefault: {
    color: COLORS.TEXT,
  },
});

export default Chip;
