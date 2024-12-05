import React, { useState } from 'react';
import { MessageSquarePlus, ChevronDown } from 'lucide-react';
import { Comment } from '../../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Textarea from '../common/Textarea';
import { replaceUrlsWithLinks } from '../../utils/text';

const COMMENTS_PER_PAGE = 10;

interface CommentSectionProps {
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (e: React.FormEvent) => void;
}

export default function CommentSection({
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit
}: CommentSectionProps) {
  const [displayCount, setDisplayCount] = useState(COMMENTS_PER_PAGE);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (newComment.trim()) {
        onCommentSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleShowMore = () => {
    setDisplayCount(prev => prev + COMMENTS_PER_PAGE);
  };

  const visibleComments = comments.slice(0, displayCount);
  const hasMoreComments = comments.length > displayCount;

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h2 className="text-xl font-semibold mb-4">コメント</h2>
      <form onSubmit={onCommentSubmit} className="mb-8">
        <div className="relative">
          <Textarea
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="コメントを入力してください..."
            helperText="Enterで送信、Shift + Enterで改行"
            maxLength={2000}
            className="min-h-[6rem] resize-y"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={!newComment.trim()}
            >
              <MessageSquarePlus className="h-5 w-5" />
              <span>送信</span>
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            まだコメントはありません
          </div>
        ) : (
          <>
            {visibleComments.map(comment => (
              <div key={comment.id} className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-medium">{comment.authorName}</span>
                      <time dateTime={comment.createdAt.toDate().toISOString()}>
                        {format(comment.createdAt.toDate(), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                      </time>
                    </div>
                    <p 
                      className="text-gray-900 whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ 
                        __html: replaceUrlsWithLinks(comment.content) 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {hasMoreComments && (
              <div className="text-center pt-4">
                <button
                  onClick={handleShowMore}
                  className="btn-secondary group"
                >
                  <ChevronDown className="h-5 w-5 group-hover:animate-bounce" />
                  <span>もっと見る</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}