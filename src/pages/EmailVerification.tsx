import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { verifyEmail } from '../services/firebase/auth';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import Logo from '../components/common/Logo';

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URLからactionCodeを取得
  const searchParams = new URLSearchParams(location.search);
  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    const verify = async () => {
      if (mode === 'verifyEmail' && oobCode) {
        setVerifying(true);
        try {
          await verifyEmail(oobCode);
          setVerified(true);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } catch (error) {
          console.error('Error verifying email:', error);
          setError('メールアドレスの確認に失敗しました。リンクが無効か期限切れの可能性があります。');
        } finally {
          setVerifying(false);
        }
      }
    };

    verify();
  }, [mode, oobCode, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center" />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-soft p-8">
          <div className="text-center">
            {verifying ? (
              <div className="space-y-4">
                <RefreshCw className="h-12 w-12 text-primary-500 mx-auto animate-spin" />
                <h2 className="text-xl font-semibold">メールアドレスを確認中...</h2>
              </div>
            ) : verified ? (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h2 className="text-xl font-semibold text-green-600">
                  メールアドレスの確認が完了しました
                </h2>
                <p className="text-gray-600">
                  ログイン画面に移動します...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {error ? (
                  <>
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h2 className="text-xl font-semibold text-red-600">
                      確認に失敗しました
                    </h2>
                    <p className="text-gray-600">{error}</p>
                  </>
                ) : (
                  <>
                    <Mail className="h-12 w-12 text-primary-500 mx-auto" />
                    <h2 className="text-xl font-semibold">
                      メールアドレスの確認
                    </h2>
                    <p className="text-gray-600">
                      確認メールに記載されているリンクをクリックしてください。
                    </p>
                  </>
                )}
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary w-full"
                >
                  ログイン画面に戻る
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}