import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useAggregatedIssueList from '../src/hooks/useAggregatedIssueList';
import * as api from '../src/api';

const PER_PAGE = 2;
const initialData = {
  selectedRepoList: [],
  hasExceedLimit: false,
  onSelectRepo: jest.fn(),
  onNoticeClick: jest.fn(),
  notifyError: jest.fn(),
};
const mockData = {
  ...initialData,
  selectedRepoList: [{ id: 1, name: 'repo', ownerName: 'owner', page: 1 }],
};

describe('Test for `useAggregatedIssueList`', () => {
  beforeEach(() => {
    jest.spyOn(React, 'useContext').mockImplementation(() => initialData);
    jest.spyOn(api, 'getIssuesByRepoFullName');
  });

  afterEach(() => {
    api.getIssuesByRepoFullName.mockClear();
    React.useContext.mockClear();
  });

  it('should initialize correctly', async () => {
    let result;

    act(() => {
      const rendered = renderHook(() =>
        useAggregatedIssueList({ perPage: PER_PAGE }),
      );

      result = rendered.result;
    });

    const {
      list,
      page,
      isFetching,
      fetchingError,
      movePrevPage,
      moveNextPage,
      movePage,
    } = result.current;

    expect(list).toEqual([]);
    expect(page).toEqual(0);
    expect(isFetching).toEqual(false);
    expect(fetchingError).toEqual('');
    expect(typeof movePrevPage).toEqual('function');
    expect(typeof moveNextPage).toEqual('function');
    expect(typeof movePage).toEqual('function');
  });

  it('should fetch issue when repository has data', async () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => mockData);

    let result;
    let waitForNextUpdate;

    act(() => {
      const rendered = renderHook(() =>
        useAggregatedIssueList({ perPage: PER_PAGE }),
      );

      result = rendered.result;
      waitForNextUpdate = rendered.waitForNextUpdate;
    });

    expect(api.getIssuesByRepoFullName).toHaveBeenCalled();
    expect(api.getIssuesByRepoFullName).toBeCalledWith('owner/repo', 1);
    expect(result.current.isFetching).toEqual(true);

    await waitForNextUpdate();

    expect(result.current.isFetching).toEqual(false);
    expect(result.current.list.length).toEqual(PER_PAGE);
  });

  it('should move page when move method is called', async () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => mockData);

    let result;
    let waitForNextUpdate;

    act(() => {
      const rendered = renderHook(() =>
        useAggregatedIssueList({ perPage: PER_PAGE }),
      );

      result = rendered.result;
      waitForNextUpdate = rendered.waitForNextUpdate;
    });

    await waitForNextUpdate();

    expect(result.current.page).toEqual(0);

    act(() => result.current.moveNextPage());
    expect(result.current.page).toEqual(1);

    act(() => result.current.movePrevPage());
    expect(result.current.page).toEqual(0);

    act(() => result.current.movePage(2));
    expect(result.current.page).toEqual(2);
  });
});
