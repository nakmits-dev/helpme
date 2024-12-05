import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MessageCircle } from 'lucide-react';
import { Thread } from '../../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { replaceUrlsWithLinks } from '../../utils/text';

interface ThreadHeaderProps {
  thread: Thread;
}

export default function ThreadHeader({ thread }: ThreadHeaderProps) {
  const navigate = useNavigate();
  const isSubThread = thread.parentId !== null;

  return (
    <>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>戻る</span>
        </button>
      </div>

      <div className={`bg-white rounded-lg shadow p-6 ${
        isSubThread ? 'border-l-4 border-primary-400' : ''
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className={`h-5 w-5 ${isSubThread ? 'text-primary-400' : 'text-primary-600'}`} />
          <span className={`text-sm px-2 py-1 rounded ${
            isSubThread 
              ? 'text-primary-600 bg-primary-50'
              : 'text-gray-600 bg-gray-100'
          }`}>
            {isSubThread ? 'サブスレッド' : 'メインスレッド'}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{thread.title}</h1>
        <p 
          className="mt-2 text-gray-600 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ 
            __html: replaceUrlsWithLinks(thread.description) 
          }}
        />
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div>
            作成者: {thread.authorName} ・ 
            作成日: {format(thread.createdAt.toDate(), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>
              最終更新: {format(thread.updatedAt.toDate(), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}