// @flow

import type { Issue, State, Action, RepoInfo, FetchingInfo } from './types';

function getFullName({ ownerName, name }: RepoInfo): string {
  return `${ownerName}/${name}`;
}

function reducer(state: State, action: Action): State {
  // by index, 1 page get [0, 10), 2 page get [10, 20)
  // if buffer length 20, max page should be 1 [0, 10), [10, 20)
  const maxPage = Math.ceil(state.buffer.length / state.perPage) - 1;

  switch (action.type) {
    case 'MOVE_PAGE':
      const page = action.payload;

      if (page < 0 || page > maxPage) {
        return state;
      }

      return {
        ...state,
        page,
      };
    case 'MOVE_PREV_PAGE':
      if (state.page === 0) {
        return state;
      }

      return {
        ...state,
        page: state.page - 1,
      };
    case 'MOVE_NEXT_PAGE':
      if (state.page + 1 > maxPage) {
        return state;
      }
      return {
        ...state,
        page: state.page + 1,
      };
    case 'ADD_DATA':
      const { data, targetId } = action.payload;
      const targetIndex = state.fetchingInfos.findIndex(
        ({ id }) => id === targetId,
      );

      if (targetIndex === -1) {
        return state;
      }

      const previousData = state.fetchingInfos[targetIndex];
      const fetchingInfos = [
        ...state.fetchingInfos.slice(0, targetIndex),
        {
          ...previousData,
          latestDate: data[data.length - 1].createdAt,
          page: previousData.page + 1,
          isFetching: false,
        },
        ...state.fetchingInfos.slice(targetIndex + 1),
      ];

      const latestSafeDate = fetchingInfos.sort(
        (a: FetchingInfo, b: FetchingInfo) => a.latestDate - b.latestDate,
      )[fetchingInfos.length - 1].latestDate;

      const updatedStorage = [...state.buffer, ...state.storage, ...data].sort(
        (a, b) => b.createdAt - a.createdAt,
      );

      const safeIndex = updatedStorage.findIndex(({ createdAt }: Issue) => {
        return createdAt <= latestSafeDate;
      });

      if (safeIndex === -1) {
        return {
          ...state,
          buffer: updatedStorage,
          storage: [],
          latestSafeDate,
          fetchingInfos,
        };
      } else {
        return {
          ...state,
          buffer: updatedStorage.slice(0, safeIndex),
          storage: updatedStorage.slice(safeIndex),
          latestSafeDate,
          fetchingInfos,
        };
      }
    case 'UPDATE_REPO_LIST':
      const repoList = action.payload;
      const updatedFetchingInfos = [];
      const currentTime: Date = new Date();
      const isAdded = repoList.length > state.fetchingInfos.length;

      repoList.forEach((repoInfo: RepoInfo) => {
        const index = state.fetchingInfos.findIndex(
          ({ id }) => id === repoInfo.id,
        );
        if (index === -1) {
          updatedFetchingInfos.push({
            id: repoInfo.id,
            latestDate: currentTime,
            page: 1,
            isFetching: false,
            fullName: getFullName(repoInfo),
          });
        } else {
          updatedFetchingInfos.push(state.fetchingInfos[index]);
        }
      });

      if (isAdded) {
        return {
          ...state,
          buffer: [],
          storage: [...state.buffer, ...state.storage],
          latestSafeDate: currentTime,
          fetchingInfos: updatedFetchingInfos,
          page: 0,
        };
      }

      return {
        ...state,
        buffer: [...state.buffer].filter(({ fullName }) =>
          repoList.find(repoInfo => fullName === getFullName(repoInfo)),
        ),
        storage: [...state.storage].filter(({ fullName }) =>
          repoList.find(repoInfo => fullName === getFullName(repoInfo)),
        ),
        fetchingInfos: updatedFetchingInfos,
        page: 0,
      };
    case 'SET_FETCHING':
      const fetchingRepoId = action.payload;
      const fetchingRepoIndex = state.fetchingInfos.findIndex(
        ({ id }) => id === fetchingRepoId,
      );

      if (fetchingRepoIndex === -1) {
        return state;
      }

      const copiedFetchingInfos = [
        ...state.fetchingInfos.slice(0, fetchingRepoIndex),
        {
          ...state.fetchingInfos[fetchingRepoIndex],
          isFetching: true,
        },
        ...state.fetchingInfos.slice(fetchingRepoIndex + 1),
      ];

      return {
        ...state,
        fetchingInfos: copiedFetchingInfos,
      };
    case 'MARK_ALL_FETCHED':
      const allFetchedRepoId = action.payload;
      const allFetchedRepoIndex = state.fetchingInfos.findIndex(
        ({ id }) => id === allFetchedRepoId,
      );

      if (allFetchedRepoIndex === -1) {
        return state;
      }

      const markedFetchingInfos = [
        ...state.fetchingInfos.slice(0, allFetchedRepoIndex),
        {
          ...state.fetchingInfos[allFetchedRepoIndex],
          isFetching: false,
          hasFetchedAll: true,
        },
        ...state.fetchingInfos.slice(allFetchedRepoIndex + 1),
      ];

      return {
        ...state,
        fetchingInfos: markedFetchingInfos,
      };
    case 'SET_ERROR':
      const error = action.payload;

      return { ...state, error };
    default:
      return state;
  }
}

export default reducer;
