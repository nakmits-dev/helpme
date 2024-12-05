import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="ページが見つかりません"
        description="お探しのページは存在しないか、移動または削除された可能性があります。"
      />
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ページが見つかりません
            </h1>
            <p className="text-gray-600">
              お探しのページは存在しないか、移動または削除された可能性があります。
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-flex"
          >
            <Home className="h-5 w-5" />
            <span>ホームに戻る</span>
          </button>
        </div>
      </div>
    </>
  );
}