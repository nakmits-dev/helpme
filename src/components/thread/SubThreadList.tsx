import React from 'react';
import { MessageCircle, MessageSquareOff, Clock } from 'lucide-react';
import { Thread } from '../../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface SubThreadListProps {
  threadId: string;
  subThreads: Thread[];
  onSubThreadClick: (subThread: Thread) => void;
}

export default function SubThreadList({ threadId, subThreads, onSubThreadClick }: SubThreadListProps) {
  if (subThreads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-gray-500">
        <MessageSquareOff className="h-8 w-8 mb-2" />
        <p className="text-sm">サブスレッドはまだありません</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {subThreads.map(subThread => (
        <div
          key={subThread.id}
          className="py-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSubThreadClick(subThread)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSubThreadClick(subThread);
            }
          }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <MessageCircle className="h-4 w-4 text-primary-400" />
            <h3 className="text-sm font-medium text-gray-900">
              {subThread.title}
            </h3>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>{subThread.authorName}</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>
                {format(subThread.updatedAt.toDate(), 'MM/dd HH:mm', { locale: ja })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}