import { collection, doc, getDoc, getDocs, addDoc, Timestamp, query, orderBy, where, runTransaction } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Thread, Comment } from '../../types';

export async function getThreads(): Promise<Thread[]> {
  try {
    const threadsQuery = query(
      collection(db, 'threads'),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(threadsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Thread[];
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw new Error('スレッドの取得に失敗しました');
  }
}

export async function getThread(threadId: string): Promise<Thread> {
  try {
    const threadRef = doc(db, 'threads', threadId);
    const threadDoc = await getDoc(threadRef);
    
    if (!threadDoc.exists()) {
      throw new Error('スレッドが見つかりません');
    }
    
    return { id: threadDoc.id, ...threadDoc.data() } as Thread;
  } catch (error) {
    console.error('Error fetching thread:', error);
    throw new Error('スレッドの取得に失敗しました');
  }
}

export async function createThread(data: Omit<Thread, 'id' | 'createdAt' | 'updatedAt' | 'commentCount'>): Promise<Thread> {
  try {
    const now = Timestamp.now();
    const threadData = {
      ...data,
      createdAt: now,
      updatedAt: now,
      commentCount: 0
    };

    const docRef = await addDoc(collection(db, 'threads'), threadData);
    return {
      id: docRef.id,
      ...threadData
    } as Thread;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw new Error('スレッドの作成に失敗しました');
  }
}

export async function getComments(threadId: string): Promise<Comment[]> {
  try {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('threadId', '==', threadId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(commentsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('コメントの取得に失敗しました');
  }
}

export async function createComment(data: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
  try {
    const { threadId } = data;
    const threadRef = doc(db, 'threads', threadId);
    const commentsRef = collection(db, 'comments');

    return await runTransaction(db, async (transaction) => {
      const threadDoc = await transaction.get(threadRef);
      if (!threadDoc.exists()) {
        throw new Error('スレッドが見つかりません');
      }

      const now = Timestamp.now();
      const commentData = {
        ...data,
        createdAt: now
      };

      const newCommentRef = doc(commentsRef);
      transaction.set(newCommentRef, commentData);

      transaction.update(threadRef, {
        commentCount: (threadDoc.data().commentCount || 0) + 1,
        updatedAt: now
      });

      return {
        id: newCommentRef.id,
        ...commentData
      } as Comment;
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    throw new Error('コメントの投稿に失敗しました');
  }
}