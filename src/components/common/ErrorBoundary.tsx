import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <AlertOctagon className="h-16 w-16 text-red-500 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                エラーが発生しました
              </h1>
              <p className="text-gray-600">
                申し訳ありません。予期せぬエラーが発生しました。
                もう一度お試しください。
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="btn-primary mx-auto"
            >
              <Home className="h-5 w-5" />
              <span>ホームに戻る</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}