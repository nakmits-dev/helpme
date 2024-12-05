import type { ThreadFormData, CommentFormData } from '../types';

export const validateThreadForm = (values: ThreadFormData) => {
  const errors: Partial<Record<keyof ThreadFormData, string>> = {};

  if (!values.title.trim()) {
    errors.title = 'タイトルを入力してください';
  } else if (values.title.length > 100) {
    errors.title = 'タイトルは100文字以内で入力してください';
  }

  if (!values.description.trim()) {
    errors.description = '説明を入力してください';
  } else if (values.description.length > 1000) {
    errors.description = '説明は1000文字以内で入力してください';
  }

  return errors;
};

export const validateCommentForm = (values: CommentFormData) => {
  const errors: Partial<Record<keyof CommentFormData, string>> = {};

  if (!values.content.trim()) {
    errors.content = 'コメントを入力してください';
  } else if (values.content.length > 2000) {
    errors.content = 'コメントは2000文字以内で入力してください';
  }

  return errors;
};