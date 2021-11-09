import { mockSearchRepoResult, mockIssues } from './mockData';
import { MESSAGE, LIMIT } from '../constants';

const useMock = false;
const MOCK_DELAY = 500;

async function searchRepoByQuery(query, page) {
  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

    return new Promise(resolve => resolve(mockSearchRepoResult));
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${LIMIT.SEARCH_REPO_PER_PAGE}&page=${page}`,
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

async function getIssuesByRepoFullName(fullName, page = 1) {
  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

    return new Promise(resolve =>
      resolve(
        mockIssues.map(issue => ({
          ...issue,
          url: issue.html_url,
          number: issue.number * page,
          fullName,
          createdAt: issue.created_at,
          assignees: issue.assignees.map(({ avatar_url }) => avatar_url),
        })),
      ),
    );
  }

  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

  try {
    const response = await fetch(
      `https://api.github.com/repos/${fullName}/issues?per_page=100&page=${page}`,
    );

    if (!response.ok) {
      throw new Error(MESSAGE.NETWORK_ERROR);
    }

    const issueList = await response.json();
    const filteredIssueList = issueList.map(
      ({
        id,
        number,
        title,
        html_url,
        labels,
        comments,
        created_at,
        assignees,
      }) => ({
        id,
        fullName,
        number,
        title,
        url: html_url,
        labels,
        comments,
        createdAt: created_at,
        assignees: assignees.map(({ avatar_url }) => avatar_url),
      }),
    );

    return filteredIssueList;
  } catch (err) {
    throw err;
  }
}

export { searchRepoByQuery, getIssuesByRepoFullName };
