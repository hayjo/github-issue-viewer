// @flow

import React from 'react';
import type { Node } from 'react';

import SnackBar from './common/SnackBar';

const Error: () => Node = () => {
  return <SnackBar onPress={() => {}} text="에러가 발생했습니다." />;
};

export default Error;
