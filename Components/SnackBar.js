import React, { useRef, useEffect } from 'react';
import { Animated, Pressable, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const SnackBar = ({ onPress, style, text, textStyle }) => {
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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Pressable onPress={onPress}>
        <View style={[styles.defaultSnackBar, style]}>
          <Text style={[styles.defaultText, textStyle]}>{text}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  defaultText: {
    color: COLORS.DEFAULT,
    textAlign: 'center',
  },
});

export default SnackBar;
