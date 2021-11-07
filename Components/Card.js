import React from 'react';
import type { Element } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const Card: () => Element = ({ children, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderTopColor: COLORS.BORDER,
    borderTopWidth: 1,
    paddingRight: 5,
    paddingVertical: 10,
  },
});

export default Card;
