import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getThread, getParentThread, getChildThreads } from '../services/firebase/threads';
import { getComments, createComment } from '../services/firebase/comments';
import { createThread } from '../services/firebase/threads';
import { MessageSquarePlus, MessageCircle, Plus } from 'lucide-react';
import ThreadHeader from '../components/thread/ThreadHeader';
import CommentSection from '../components/thread/CommentSection';
import SubThreadList from '../components/thread/SubThreadList';
import SubThreadModal from '../components/thread/SubThreadModal';
import CreateSubThreadModal from '../components/thread/CreateSubThreadModal';
import type { Thread as ThreadType, Comment } from '../types';

export default function Thread() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thread, setThread] = useState<ThreadType | null>(null);
  const [parentThread, setParentThread] = useState<ThreadType | null>(null);
  const [childThreads, setChildThreads] = useState<ThreadType[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingSubThread, setIsCreatingSubThread] = useState(false);
  const [selectedSubThread, setSelectedSubThread] = useState<ThreadType | null>(null);
  const [subThreadComments, setSubThreadComments] = useState<Comment[]>([]);
  const [newSubThreadComment, setNewSubThreadComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!threadId) {
        setError('スレッドIDが見つかりません');
        return;
      }

      try {
        const [threadData, parentData, childrenData, commentsData] = await Promise.all([
          getThread(threadId),
          getParentThread(threadId),
          getChildThreads(threadId),
          getComments(threadId)
        ]);

        setThread(threadData);
        setParentThread(parentData);
        setChildThreads(childrenData);
        setComments(commentsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [threadId]);

  useEffect(() => {
    const fetchSubThreadComments = async () => {
      if (selectedSubThread) {
        try {
          const comments = await getComments(selectedSubThread.id);
          setSubThreadComments(comments);
        } catch (error) {
          console.error('Error fetching subthread comments:', error);
        }
      }
    };

    fetchSubThreadComments();
  }, [selectedSubThread]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadId || !newComment.trim()) return;

    try {
      const commentData = {
        threadId,
        content: newComment.trim(),
        authorId: user?.id,
        authorName: user?.displayName || '匿名ユーザー',
        isAnonymous: !user || user.isAnonymous
      };

      const newCommentWithId = await createComment(commentData);
      setComments(prev => [newCommentWithId, ...prev]);
      setNewComment('');
      
      if (thread) {
        setThread(prev => prev ? {
          ...prev,
          commentCount: prev.commentCount + 1
        } : null);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('コメントの投稿に失敗しました');
    }
  };

  const handleSubThreadCreate = async (title: string, description: string) => {
    if (!threadId) return;

    try {
      const subThreadData = {
        title: title.trim(),
        description: description.trim(),
        authorId: user?.id,
        authorName: user?.displayName || '匿名ユーザー',
        parentId: threadId
      };

      const newSubThreadWithId = await createThread(subThreadData);
      setChildThreads(prev => [newSubThreadWithId, ...prev]);
    } catch (error) {
      console.error('Error creating subthread:', error);
      throw new Error('サブスレッドの作成に失敗しました');
    }
  };

  const handleSubThreadCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubThread || !newSubThreadComment.trim()) return;

    try {
      const commentData = {
        threadId: selectedSubThread.id,
        content: newSubThreadComment.trim(),
        authorId: user?.id,
        authorName: user?.displayName || '匿名ユーザー',
        isAnonymous: !user || user.isAnonymous
      };

      const newCommentWithId = await createComment(commentData);
      setSubThreadComments(prev => [newCommentWithId, ...prev]);
      setNewSubThreadComment('');

      setChildThreads(prev => prev.map(thread => 
        thread.id === selectedSubThread.id
          ? { ...thread, commentCount: thread.commentCount + 1 }
          : thread
      ));
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('コメントの投稿に失敗しました');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-600">
        スレッドが見つかりません
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {parentThread && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-soft p-4 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => navigate(`/thread/${parentThread.id}`)}>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <MessageCircle className="h-4 w-4" />
            <span>親スレッド</span>
          </div>
          <h3 className="font-semibold text-gray-900">{parentThread.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{parentThread.description}</p>
        </div>
      )}

      <ThreadHeader thread={thread} />

      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CommentSection
              comments={comments}
              newComment={newComment}
              onCommentChange={setNewComment}
              onCommentSubmit={handleCommentSubmit}
            />
          </div>

          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">サブスレッド</h2>
                <button
                  onClick={() => setIsCreatingSubThread(true)}
                  className="btn-primary"
                >
                  <Plus className="h-5 w-5" />
                  <span>新規作成</span>
                </button>
              </div>
              <SubThreadList
                threadId={thread.id}
                subThreads={childThreads}
                onSubThreadClick={setSelectedSubThread}
              />
            </div>
          </div>
        </div>
      </div>

      <CreateSubThreadModal
        isOpen={isCreatingSubThread}
        onClose={() => setIsCreatingSubThread(false)}
        onSubmit={handleSubThreadCreate}
      />

      {selectedSubThread && (
        <SubThreadModal
          isOpen={!!selectedSubThread}
          onClose={() => {
            setSelectedSubThread(null);
            setSubThreadComments([]);
            setNewSubThreadComment('');
          }}
          subThread={selectedSubThread}
          comments={subThreadComments}
          newComment={newSubThreadComment}
          onCommentChange={setNewSubThreadComment}
          onCommentSubmit={handleSubThreadCommentSubmit}
        />
      )}
    </div>
  );
}