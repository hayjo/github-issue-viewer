import { useEffect, useContext, useReducer } from 'react';
import { RepoContext } from '../context';
import { getIssuesByRepoFullName } from '../api';

function reducer(state, action) {
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
      const { data, target } = action.payload;

      if (!state.fetchingInfos[target]) {
        return state;
      }

      const fetchingInfos = {
        ...state.fetchingInfos,
        [target]: {
          latestDate: data[data.length - 1].createdAt,
          page: state.fetchingInfos[target].page + 1,
          isFetching: false,
        },
      };

      const latestSafeDate = Object.values(fetchingInfos)
        .sort((a, b) => a.latestDate > b.latestDate)
        .pop().latestDate;

      const updatedStorage = [...state.buffer, ...state.storage, ...data].sort(
        (a, b) => a.createdAt < b.createdAt,
      );

      const safeIndex = updatedStorage.findIndex(({ createdAt }) => {
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
      const updatedFetchingInfos = {};
      const currentTimeString = new Date().toISOString();
      const isAdded =
        repoList.length > Object.values(state.fetchingInfos).length;

      repoList.forEach(repoName => {
        updatedFetchingInfos[repoName] = state.fetchingInfos[repoName] || {
          latestDate: currentTimeString,
          page: 1,
          isFetching: false,
        };
      });

      if (isAdded) {
        return {
          ...state,
          buffer: [],
          storage: [...state.buffer, ...state.storage].filter(({ repoName }) =>
            repoList.includes(repoName),
          ),
          latestSafeDate: currentTimeString,
          fetchingInfos: updatedFetchingInfos,
          page: 0,
        };
      }

      return {
        ...state,
        buffer: [...state.buffer].filter(({ repoName }) =>
          repoList.includes(repoName),
        ),
        storage: [...state.storage].filter(({ repoName }) =>
          repoList.includes(repoName),
        ),
        fetchingInfos: updatedFetchingInfos,
        page: 0,
      };
    case 'SET_FETCHING':
      const fetchingRepoName = action.payload;

      if (!state.fetchingInfos[fetchingRepoName]) {
        return state;
      }

      return {
        ...state,
        fetchingInfos: {
          ...state.fetchingInfos,
          [fetchingRepoName]: {
            ...state.fetchingInfos[fetchingRepoName],
            isFetching: true,
          },
        },
      };
    case 'MARK_ALL_FETCHED':
      const targetRepoName = action.payload;

      if (!state.fetchingInfos[targetRepoName]) {
        return state;
      }

      return {
        ...state,
        fetchingInfos: {
          ...state.fetchingInfos,
          [targetRepoName]: {
            ...state.fetchingInfos[targetRepoName],
            isFetching: false,
            hasFetchedAll: true,
          },
        },
      };
    case 'SET_ERROR':
      const error = action.payload;

      return { ...state, error };
    default:
      return state;
  }
}

const useAggregatedIssueList = ({ perPage }) => {
  const { selectedRepoList } = useContext(RepoContext);
  const [{ buffer, page, latestSafeDate, fetchingInfos, error }, dispatch] =
    useReducer(reducer, {
      buffer: [],
      page: 0,
      perPage,
      latestSafeDate: new Date().toISOString(),
      fetchingInfos: {},
      storage: [],
    });
  const startPage = Math.floor(page / perPage) * perPage;
  const endPage = Math.min(
    startPage + perPage,
    Math.ceil(buffer.length / perPage),
  );
  const pageList =
    startPage < endPage
      ? Array.from({ length: endPage - startPage }).map(
          (_, index) => index + startPage,
        )
      : [startPage];
  const isFetching = Object.values(fetchingInfos).some(info =>
    Boolean(info.isFetching),
  );

  const movePrevPage = () => dispatch({ type: 'MOVE_PREV_PAGE' });
  const moveNextPage = () => dispatch({ type: 'MOVE_NEXT_PAGE' });
  const movePage = pageNumber =>
    dispatch({ type: 'MOVE_PAGE', payload: pageNumber });

  useEffect(() => {
    dispatch({ type: 'UPDATE_REPO_LIST', payload: selectedRepoList });
  }, [selectedRepoList]);

  useEffect(() => {
    const isBufferEnough = buffer.length > endPage * perPage;

    if (isBufferEnough) {
      return;
    }

    const searchIssues = async () => {
      const targets = [];

      for (const [target, info] of Object.entries(fetchingInfos)) {
        if (info.latestDate >= latestSafeDate && !info.hasFetchedAll) {
          const fetchIssues = async () => {
            if (info.isFetching) {
              return;
            }

            dispatch({ type: 'SET_FETCHING', payload: target });

            try {
              const data = await getIssuesByRepoFullName(target, info.page);

              if (!data.length) {
                dispatch({ type: 'MARK_ALL_FETCHED', payload: target });
                return;
              }

              dispatch({ type: 'ADD_DATA', payload: { data, target } });
            } catch (err) {
              dispatch({ type: 'SET_ERROR', payload: err.message });
            }
          };

          targets.push(fetchIssues);
        }
      }

      await Promise.all(targets.map(func => func()));
    };

    searchIssues();
  }, [buffer.length, latestSafeDate, fetchingInfos, page, endPage, perPage]);

  return {
    list: buffer.slice(page * perPage, (page + 1) * perPage),
    page,
    pageList,
    isFetching,
    fetchingError: error,
    movePrevPage,
    moveNextPage,
    movePage,
  };
};

export default useAggregatedIssueList;
