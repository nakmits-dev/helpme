import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, UserPlus, UserX } from 'lucide-react';
import Input from '../components/common/Input';
import Logo from '../components/common/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInAnon, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (user && (user.isAnonymous || user.emailVerified)) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccess('アカウントを作成しました。確認メールをお送りしましたので、メールボックスをご確認ください。');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('確認メール')) {
          setSuccess('確認メールを再送信しました。メールボックスをご確認ください。');
          setError('');
        } else {
          setError(err.message);
        }
      } else {
        setError('エラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signInAnon();
    } catch (err) {
      setError(err instanceof Error ? err.message : '匿名ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center" />
          <p className="mt-2 text-gray-600">
            助け合いのためのディスカッションプラットフォーム
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-soft p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isSignUp ? 'アカウント作成' : 'ログイン'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={loading}
              autoComplete="email"
            />

            <Input
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上で入力"
              required
              disabled={loading}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={8}
            />

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm bg-green-50 p-4 rounded-lg border border-green-100 shadow-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading || !email || !password}
            >
              {isSignUp ? (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>{loading ? '作成中...' : 'アカウント作成'}</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>{loading ? 'ログイン中...' : 'ログイン'}</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          <button
            onClick={handleAnonymousLogin}
            className="w-full btn-secondary"
            disabled={loading}
          >
            <UserX className="h-5 w-5" />
            <span>{loading ? '処理中...' : '匿名でログイン'}</span>
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              disabled={loading}
            >
              {isSignUp
                ? 'すでにアカウントをお持ちの方はこちら'
                : '新規アカウントを作成'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}