import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { getSubThreadCommentsQuery } from '../utils/firebase';
import type { Thread, SubThread as SubThreadType, Comment } from '../types';
import ThreadHeader from '../components/thread/ThreadHeader';
import CommentSection from '../components/thread/CommentSection';

export default function SubThread() {
  const { threadId, subThreadId } = useParams();
  const { user } = useAuth();
  const [thread, setThread] = useState<Thread | null>(null);
  const [subThread, setSubThread] = useState<SubThreadType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!threadId || !subThreadId) {
        setError('スレッドIDが見つかりません');
        return;
      }

      try {
        const [threadDoc, subThreadDoc] = await Promise.all([
          getDoc(doc(db, 'threads', threadId)),
          getDoc(doc(db, 'subThreads', subThreadId))
        ]);

        if (!threadDoc.exists() || !subThreadDoc.exists()) {
          setError('スレッドが見つかりません');
          return;
        }

        setThread({ id: threadDoc.id, ...threadDoc.data() } as Thread);
        setSubThread({ id: subThreadDoc.id, ...subThreadDoc.data() } as SubThreadType);

        const commentsSnapshot = await getDocs(getSubThreadCommentsQuery(threadId, subThreadId));
        setComments(commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[]);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('データの取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [threadId, subThreadId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadId || !subThreadId || !newComment.trim()) return;

    try {
      const commentData = {
        threadId,
        subThreadId,
        content: newComment.trim(),
        authorId: user?.id,
        authorName: user?.displayName || '匿名ユーザー',
        createdAt: Timestamp.now(),
        isAnonymous: !user || user.isAnonymous
      };

      const docRef = await addDoc(collection(db, 'comments'), commentData);
      
      const newCommentWithId = { id: docRef.id, ...commentData };
      setComments(prev => [newCommentWithId, ...prev]);
      
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('コメントの投稿に失敗しました');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-gray-600">読み込み中...</div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {error}
    </div>;
  }

  if (!thread || !subThread) {
    return <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-600">
      スレッドが見つかりません
    </div>;
  }

  return (
    <div className="space-y-8">
      <ThreadHeader thread={subThread} />
      <CommentSection
        comments={comments}
        newComment={newComment}
        onCommentChange={setNewComment}
        onCommentSubmit={handleCommentSubmit}
      />
    </div>
  );
}