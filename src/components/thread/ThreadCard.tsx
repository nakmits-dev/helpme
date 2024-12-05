import React from 'react';
import { MessageCircle, Clock, MessageSquare } from 'lucide-react';
import { Thread } from '../../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { replaceUrlsWithLinks } from '../../utils/text';

interface ThreadCardProps {
  thread: Thread;
  onClick: () => void;
}

export default function ThreadCard({ thread, onClick }: ThreadCardProps) {
  const isSubThread = thread.parentId !== null;

  return (
    <div
      className={`bg-white rounded-lg shadow-soft p-6 hover:shadow-md transition-shadow cursor-pointer ${
        isSubThread ? 'border-l-4 border-primary-400' : ''
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <MessageCircle className={`h-5 w-5 ${
          isSubThread ? 'text-primary-400' : 'text-primary-600'
        }`} />
        <span className={`text-sm px-2 py-1 rounded ${
          isSubThread 
            ? 'text-primary-600 bg-primary-50'
            : 'text-gray-600 bg-gray-100'
        }`}>
          {isSubThread ? 'サブスレッド' : 'メインスレッド'}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {thread.title}
      </h2>
      <div 
        className="text-gray-600 mb-4 line-clamp-2"
        dangerouslySetInnerHTML={{ 
          __html: replaceUrlsWithLinks(thread.description) 
        }}
      />

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-gray-50 rounded-full text-sm">
            {thread.authorName}
          </span>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{thread.commentCount}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>
            {format(thread.updatedAt.toDate(), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
          </span>
        </div>
      </div>
    </div>
  );
}