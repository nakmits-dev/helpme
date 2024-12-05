import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/firebase/users';
import type { UserProfile, ProfileFormData } from '../types';
import { logger } from '../utils/logger';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getUserProfile(userId);
        setProfile(userProfile);
        setError(null);
      } catch (err) {
        logger.error('Error fetching profile:', err);
        setError('プロフィールの取得に失敗しました');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (data: ProfileFormData) => {
    if (!userId) return;

    try {
      const updatedProfile = await updateUserProfile(userId, data);
      setProfile(updatedProfile);
      setError(null);
      return updatedProfile;
    } catch (err) {
      logger.error('Error updating profile:', err);
      setError('プロフィールの更新に失敗しました');
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile
  };
}