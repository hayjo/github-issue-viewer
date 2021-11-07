import { mockSearchRepoResult, mockIssues } from './mockData';
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

async function getIssuesByRepoFullName(fullName, page = 1) {
  if (useMock) {
    return new Promise(resolve =>
      resolve(
        mockIssues.map(issue => ({
          ...issue,
          url: issue.html_url,
          repoName: fullName,
          createdAt: issue.created_at,
          assignees: issue.assignees.map(({ avatar_url }) => avatar_url),
        })),
      ),
    );
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${fullName}/issues?per_page=10&page=2`,
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
        repoName: fullName,
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
