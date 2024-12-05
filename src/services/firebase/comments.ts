import { collection, doc, getDocs, Timestamp, query, orderBy, where, runTransaction } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Comment } from '../../types';

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
    throw error;
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
    throw error;
  }
}