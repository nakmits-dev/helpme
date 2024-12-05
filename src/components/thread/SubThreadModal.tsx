import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MessageCircle, Clock, MessageSquare } from 'lucide-react';
import Modal from '../common/Modal';
import CommentSection from './CommentSection';
import type { Thread, Comment } from '../../types';
import { replaceUrlsWithLinks } from '../../utils/text';

interface SubThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subThread: Thread;
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (e: React.FormEvent) => void;
}

export default function SubThreadModal({
  isOpen,
  onClose,
  subThread,
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit
}: SubThreadModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-primary-500" />
          <span>サブスレッド</span>
        </div>
      }
    >
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-lg shadow-soft p-6 border-l-4 border-primary-400">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="h-5 w-5 text-primary-400" />
            <span className="text-sm px-2 py-1 rounded text-primary-600 bg-primary-50">
              サブスレッド
            </span>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {subThread.title}
          </h3>
          <div 
            className="text-gray-600 mb-4 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: replaceUrlsWithLinks(subThread.description) 
            }}
          />
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-gray-50 rounded-full text-sm">
                {subThread.authorName}
              </span>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{subThread.commentCount}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {format(subThread.updatedAt.toDate(), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
              </span>
            </div>
          </div>
        </div>

        <CommentSection
          comments={comments}
          newComment={newComment}
          onCommentChange={onCommentChange}
          onCommentSubmit={onCommentSubmit}
        />
      </div>
    </Modal>
  );
}