import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Search from '../components/Search';
import { RepoContext } from '../context';

const initialData = {
  selectedRepoList: [],
  hasExceedLimit: false,
  onSelectRepo: jest.fn(),
  onNoticeClick: jest.fn(),
  notifyError: jest.fn(),
};

describe('Search component test', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <RepoContext.Provider value={initialData}>
          <Search onCancel={jest.fn()} />
        </RepoContext.Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
