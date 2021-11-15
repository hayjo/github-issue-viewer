// @flow

import React, { useState } from 'react';
import type { Node } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import SnackBar from './SnackBar';
import type { RootStackParamList } from '../../types';
import { COLORS, MESSAGE } from '../../constants';

// $FlowFixMe: Cannot use `NativeStackScreenProps` as a type because it is an `any`-typed value.
type Props = NativeStackScreenProps<RootStackParamList, 'Browser'>;

const Browser: (props: Props) => Node = ({ route, navigation }) => {
  const { uri } = route.params;
  const [hasSpinner, setHasSpinner] = useState(true);
  const [error, setError] = useState('');

  return (
    <View style={styles.view}>
      {error ? (
        <SnackBar onPress={() => {}} text={MESSAGE.CANNOT_OPEN_PAGE} />
      ) : (
        <WebView
          onLoad={() => setHasSpinner(false)}
          onError={() => setError(MESSAGE.CANNOT_OPEN_PAGE)}
          source={{ uri }}
          style={styles.view}
        />
      )}
      {hasSpinner ? (
        <ActivityIndicator style={styles.activityIndicator} />
      ) : null}
    </View>
  );
};

const styles: { [string]: ViewStyleProp } = StyleSheet.create({
  view: {
    flex: 1,
  },
  activityIndicator: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: COLORS.DEFAULT,
  },
});

export default Browser;
