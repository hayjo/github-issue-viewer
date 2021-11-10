// @flow

import React, { useRef, useEffect } from 'react';
import type { Node } from 'react';
import { Animated, Pressable, View, Text, StyleSheet } from 'react-native';
import type {
  TextStyleProp,
  ViewStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

import { COLORS } from '../constants';

type Props = {
  onPress: () => void,
  style?: {},
  text: string,
  textStyle?: {},
};

const SnackBar: (props: Props) => Node = ({
  onPress,
  style,
  text,
  textStyle,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeId = setTimeout(onPress, 1000);

    () => clearTimeout(timeId);
  }, [onPress]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[viewStyles.container, { opacity: fadeAnim }]}>
      <Pressable onPress={onPress}>
        <View style={[viewStyles.defaultSnackBar, style]}>
          <Text style={[textStyles.defaultText, textStyle]}>{text}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '50%',
  },
  defaultSnackBar: {
    padding: 10,
    backgroundColor: COLORS.NOTICE,
    borderRadius: 4,
  },
});

const textStyles: { [string]: TextStyleProp } = StyleSheet.create({
  defaultText: {
    color: COLORS.DEFAULT,
    textAlign: 'center',
  },
});

export default SnackBar;
