// @flow

import type { Issue } from '../../api';

type Id = number;

type RepoInfo = {
  id: number,
  name: string,
  ownerId: number,
  ownerName: string,
};

type Action =
  | { type: 'MOVE_PAGE', payload: number }
  | { type: 'MOVE_PREV_PAGE' }
  | { type: 'MOVE_NEXT_PAGE' }
  | {
      type: 'ADD_DATA',
      payload: { data: Issue[], targetId: Id },
    }
  | { type: 'UPDATE_REPO_LIST', payload: RepoInfo[] }
  | { type: 'SET_FETCHING', payload: Id }
  | { type: 'MARK_ALL_FETCHED', payload: Id }
  | { type: 'SET_ERROR', payload: string };

type FetchingInfo = {
  id: number,
  fullName: string,
  page: number,
  latestDate: Date,
  isFetching?: boolean,
  hasFetchedAll?: boolean,
};

type State = {
  buffer: Issue[],
  storage: Issue[],
  page: number,
  perPage: number,
  latestSafeDate: Date,
  fetchingInfos: FetchingInfo[],
  error: string,
};

type TUseAggregatedIssueList = {
  list: Array<{
    id: number,
    fullName: string,
    number: number,
    title: string,
    url: string,
    comments: number,
    labels: Array<{
      name: string,
      id: number,
      color: string,
    }>,
    createdAt: Date,
    assignees: Array<string>,
  }>,
  page: number,
  isFetching: boolean,
  fetchingError: string,
  movePrevPage: () => void,
  moveNextPage: () => void,
  movePage: (pageNumber: number) => void,
  fetchingError: string,
};

export type {
  Issue,
  Id,
  RepoInfo,
  Action,
  FetchingInfo,
  State,
  TUseAggregatedIssueList,
};
