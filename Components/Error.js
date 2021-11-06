import React from 'react';
import { Text } from 'react-native';
import SnackBar from './SnackBar';

const Error = () => {
  return (
    <SnackBar onPress={() => {}}>
      <Text>에러가 발생했습니다.</Text>
    </SnackBar>
  );
};

export default Error;
