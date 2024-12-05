import React, { useState } from 'react';
import { User as LucideUser } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import { logger } from '../utils/logger';

export default function Profile() {
  const { user } = useAuth();
  const { profile, loading, error: fetchError, updateProfile } = useProfile(user?.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    bio: profile?.bio || ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName,
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile({
        displayName: formData.displayName,
        bio: formData.bio
      });
      setSuccess(true);
      logger.info('Profile updated successfully');
    } catch (err) {
      logger.error('Error updating profile:', err);
      setError('プロフィールの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {fetchError}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-full">
            <LucideUser className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">プロフィール設定</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="表示名"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            maxLength={30}
            required
            disabled={saving}
          />

          <Textarea
            label="自己紹介"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            maxLength={200}
            placeholder="自己紹介を入力してください（任意）"
            disabled={saving}
          />

          {error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 bg-green-50 p-4 rounded-lg">
              プロフィールを更新しました
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? '更新中...' : '更新する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}