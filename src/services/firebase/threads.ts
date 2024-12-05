import { collection, doc, getDoc, getDocs, addDoc, Timestamp, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Thread } from '../../types';

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
    throw error;
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
    throw error;
  }
}

export async function getParentThread(threadId: string): Promise<Thread | null> {
  try {
    const thread = await getThread(threadId);
    if (!thread.parentId) return null;
    return await getThread(thread.parentId);
  } catch (error) {
    console.error('Error fetching parent thread:', error);
    return null;
  }
}

export async function getChildThreads(threadId: string): Promise<Thread[]> {
  try {
    const threadsQuery = query(
      collection(db, 'threads'),
      where('parentId', '==', threadId),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(threadsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Thread[];
  } catch (error) {
    console.error('Error fetching child threads:', error);
    throw error;
  }
}

export async function createThread(data: Omit<Thread, 'id' | 'createdAt' | 'updatedAt' | 'commentCount'>): Promise<Thread> {
  try {
    const now = Timestamp.now();
    const threadData = {
      ...data,
      parentId: data.parentId || null,
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
    throw error;
  }
}