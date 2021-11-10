// @flow

const MESSAGE: { [string]: string } = {
  NETWORK_ERROR: '현재 서버 이용이 불가능합니다.',
  TEMPORARILY_UNAVAILABLE: '잠시 후 다시 시도해주세요.',
  MAX_REPO_COUNT:
    '더 이상 Repository를 등록할 수 없습니다.\n기존 Repository를 삭제하고 다시 시도해주세요.',
};

const LIMIT: { [string]: number } = {
  REPO_COUNT: 4,
  ISSUE_PER_PAGE: 5,
  SEARCH_DEBOUNCING_TIME: 300,
  SEARCH_REPO_PER_PAGE: 30,
};

const COLORS: { [string]: string } = {
  SELECTED: '#6cc644',
  ICON: '#6a737d',
  TITLE: '#0969da',
  SUBTITLE: '#24292f',
  TEXT: '#57606a',
  BORDER: '#1b1f2426',
  SEARCH_BACKGROUND: '#1b1f241a',
  NOTICE: '#c92e35d9',
  DEFAULT: '#ffffff',
  ISSUE: '#1a7f37',
};

const SIZE: { [string]: number } = {
  ICON: 16,
};

export { MESSAGE, COLORS, LIMIT, SIZE };
