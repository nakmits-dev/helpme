export const MAX_LENGTHS = {
  THREAD_TITLE: 100,
  THREAD_DESCRIPTION: 1000,
  COMMENT: 2000,
  DISPLAY_NAME: 30,
  BIO: 200
} as const;

export const COMMENTS_PER_PAGE = 10;

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'データの取得に失敗しました',
  CREATE_FAILED: '作成に失敗しました',
  UPDATE_FAILED: '更新に失敗しました',
  DELETE_FAILED: '削除に失敗しました',
  INVALID_INPUT: '入力内容を確認してください',
  UNAUTHORIZED: '権限がありません',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: '予期せぬエラーが発生しました'
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: '作成しました',
  UPDATED: '更新しました',
  DELETED: '削除しました'
} as const;