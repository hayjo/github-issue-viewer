// @flow

import { useEffect, useContext, useReducer } from 'react';
import { RepoContext } from '../../context';
import { getIssuesByRepoFullName } from '../../api';
import reducer from './reducer';
import type { TUseAggregatedIssueList } from './types';

const useAggregatedIssueList: ({
  perPage: number,
}) => TUseAggregatedIssueList = ({ perPage }) => {
  const { selectedRepoList } = useContext(RepoContext);
  const [{ buffer, page, latestSafeDate, fetchingInfos, error }, dispatch] =
    useReducer(reducer, {
      buffer: [],
      page: 0,
      perPage,
      latestSafeDate: new Date(),
      fetchingInfos: [],
      storage: [],
      error: '',
    });

  const isFetching = fetchingInfos.some(info => Boolean(info.isFetching));

  const movePrevPage = () => dispatch({ type: 'MOVE_PREV_PAGE' });
  const moveNextPage = () => dispatch({ type: 'MOVE_NEXT_PAGE' });
  const movePage = pageNumber =>
    dispatch({ type: 'MOVE_PAGE', payload: pageNumber });

  useEffect(() => {
    dispatch({ type: 'UPDATE_REPO_LIST', payload: selectedRepoList });
  }, [selectedRepoList]);

  useEffect(() => {
    const isBufferEnough = buffer.length > (page + 1) * perPage;

    if (isBufferEnough) {
      return;
    }

    const searchIssues = async () => {
      const targets = [];

      for (const info of fetchingInfos) {
        if (info.latestDate >= latestSafeDate && !info.hasFetchedAll) {
          const fetchIssues = async () => {
            if (info.isFetching) {
              return;
            }

            dispatch({ type: 'SET_FETCHING', payload: info.id });

            try {
              const data = await getIssuesByRepoFullName(
                info.fullName,
                info.page,
              );

              if (!data.length) {
                dispatch({ type: 'MARK_ALL_FETCHED', payload: info.id });
                return;
              }

              dispatch({
                type: 'ADD_DATA',
                payload: { data, targetId: info.id },
              });
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
  }, [buffer.length, latestSafeDate, fetchingInfos, page, perPage]);

  return {
    list: buffer.slice(page * perPage, (page + 1) * perPage),
    page,
    isFetching,
    fetchingError: error,
    movePrevPage,
    moveNextPage,
    movePage,
  };
};

export default useAggregatedIssueList;
