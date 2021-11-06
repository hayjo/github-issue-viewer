import React, { useRef, useEffect } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';

const SnackBar = ({ onPress, children, style }) => {
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
        <View style={style}>{children}</View>
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
});

export default SnackBar;
