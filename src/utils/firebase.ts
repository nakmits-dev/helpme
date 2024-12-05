import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getSubThreadsQuery = (threadId: string) => {
  try {
    const subThreadsRef = collection(db, 'subThreads');
    return query(
      subThreadsRef,
      where('threadId', '==', threadId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('Error creating subThreads query:', error);
    throw error;
  }
};

export const getThreadCommentsQuery = (threadId: string) => {
  try {
    const commentsRef = collection(db, 'comments');
    return query(
      commentsRef,
      where('threadId', '==', threadId),
      where('subThreadId', '==', null),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('Error creating thread comments query:', error);
    throw error;
  }
};

export const getSubThreadCommentsQuery = (threadId: string, subThreadId: string) => {
  try {
    const commentsRef = collection(db, 'comments');
    return query(
      commentsRef,
      where('threadId', '==', threadId),
      where('subThreadId', '==', subThreadId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.error('Error creating subthread comments query:', error);
    throw error;
  }
};