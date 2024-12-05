import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createThread, getThreads } from '../services/firebase/threads';
import { getComments, createComment } from '../services/firebase/comments';
import { Plus } from 'lucide-react';
import type { Thread, Comment } from '../types';
import SEO from '../components/SEO';
import ThreadCard from '../components/thread/ThreadCard';
import CreateThreadModal from '../components/thread/CreateThreadModal';
import SubThreadModal from '../components/thread/SubThreadModal';
import { useLoading } from '../hooks/useLoading';
import { useAppNavigation } from '../hooks/useNavigation';

export default function Home() {
  const { user } = useAuth();
  const { goToThread } = useAppNavigation();
  const [threads, setThreads] = useState<Thread[]>([]);
  const { loading, shouldShow, withLoading } = useLoading({ delay: 300 });
  const [error, setError] = useState<string | null>(null);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    withLoading(async () => {
      try {
        const fetchedThreads = await getThreads();
        setThreads(fetchedThreads);
        setError(null);
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError('スレッドの取得に失敗しました');
      }
    });
  }, [withLoading]);

  useEffect(() => {
    const fetchComments = async () => {
      if (selectedThread) {
        try {
          const fetchedComments = await getComments(selectedThread.id);
          setComments(fetchedComments);
        } catch (err) {
          console.error('Error fetching comments:', err);
        }
      }
    };

    fetchComments();
  }, [selectedThread]);

  const handleCreateThread = async (title: string, description: string) => {
    const threadData = {
      title,
      description,
      authorId: user?.id,
      authorName: user?.displayName || '匿名ユーザー'
    };

    const createdThread = await createThread(threadData);
    setThreads(prev => [createdThread, ...prev]);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !newComment.trim()) return;

    try {
      const commentData = {
        threadId: selectedThread.id,
        content: newComment.trim(),
        authorId: user?.id,
        authorName: user?.displayName || '匿名ユーザー',
        isAnonymous: !user || user.isAnonymous
      };

      const newCommentWithId = await createComment(commentData);
      setComments(prev => [newCommentWithId, ...prev]);
      setNewComment('');

      setThreads(prev => prev.map(thread =>
        thread.id === selectedThread.id
          ? { ...thread, commentCount: thread.commentCount + 1 }
          : thread
      ));
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleThreadClick = (thread: Thread) => {
    if (thread.parentId) {
      setSelectedThread(thread);
    } else {
      goToThread(thread.id);
    }
  };

  return (
    <>
      <SEO />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">スレッド一覧</h1>
          <button
            onClick={() => setIsCreatingThread(true)}
            className="btn-primary"
          >
            <Plus className="h-5 w-5" />
            <span>新規作成</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 shadow-sm">
            {error}
          </div>
        )}

        <div className={`grid gap-4 min-h-[200px] ${loading && !shouldShow ? 'opacity-50' : ''}`}>
          {threads.map(thread => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onClick={() => handleThreadClick(thread)}
            />
          ))}
        </div>

        <CreateThreadModal
          isOpen={isCreatingThread}
          onClose={() => setIsCreatingThread(false)}
          onSubmit={handleCreateThread}
        />

        {selectedThread && (
          <SubThreadModal
            isOpen={!!selectedThread}
            onClose={() => {
              setSelectedThread(null);
              setComments([]);
              setNewComment('');
            }}
            subThread={selectedThread}
            comments={comments}
            newComment={newComment}
            onCommentChange={setNewComment}
            onCommentSubmit={handleCommentSubmit}
          />
        )}
      </div>
    </>
  );
}