import { Timestamp } from 'firebase/firestore';

export interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  authorId?: string;
  authorName: string;
}

export interface Thread extends BaseEntity {
  title: string;
  description: string;
  commentCount: number;
  parentId?: string | null;
}

export interface Comment extends BaseEntity {
  threadId: string;
  content: string;
  isAnonymous: boolean;
}

// ユーザープロフィール情報
export interface UserProfile {
  id: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ThreadFormData {
  title: string;
  description: string;
}

export interface CommentFormData {
  content: string;
}

export interface ProfileFormData {
  displayName: string;
  bio?: string;
}