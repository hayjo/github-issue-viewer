import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Repository from '../src/components/Repository';
import { RepoContext } from '../src/context';

const initialData = {
  selectedRepoList: [],
  hasExceedLimit: false,
  onSelectRepo: jest.fn(),
  onNoticeClick: jest.fn(),
  notifyError: jest.fn(),
};

describe('Repository component test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <RepoContext.Provider value={initialData}>
          <Repository onCancel={jest.fn()} />
        </RepoContext.Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
