// @flow

import React from 'react';
import type { Node } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { COLORS } from '../../constants';

type Props = {
  children: Node,
  onPress: () => void | Promise<void>,
};

const Card: (props: Props) => Node = ({ children, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {children}
    </Pressable>
  );
};

const styles: { [string]: ViewStyleProp } = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderTopColor: COLORS.BORDER,
    borderTopWidth: 1,
    paddingRight: 5,
    paddingVertical: 10,
  },
});

export default Card;
