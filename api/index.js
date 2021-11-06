import { mockSearchRepoResult } from './mockData';
import { MESSAGE } from '../constants';

const useMock = false;

async function searchRepoByQuery(query) {
  if (useMock) {
    return new Promise(resolve => resolve(mockSearchRepoResult));
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`,
    );

    if (!response.ok) {
      throw new Error(MESSAGE.NETWORK_ERROR);
    }

    const {
      total_count: totalCount,
      incomplete_results: hasRateExceeded,
      items,
    } = await response.json();

    // https://docs.github.com/en/rest/reference/search#timeouts-and-incomplete-results
    if (hasRateExceeded) {
      throw new Error(MESSAGE.TEMPORARILY_UNAVAILABLE);
    }

    return { totalCount, items };
  } catch (err) {
    throw err;
  }
}

export { searchRepoByQuery };
