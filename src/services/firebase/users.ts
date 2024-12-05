import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { logger } from '../../utils/logger';
import type { UserProfile, ProfileFormData } from '../../types';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    logger.info(`Fetching user profile for userId: ${userId}`);
    const userDoc = await getDoc(doc(db, 'profiles', userId));
    
    if (!userDoc.exists()) {
      logger.warn(`User profile not found for userId: ${userId}`);
      return null;
    }
    
    const profileData = { id: userDoc.id, ...userDoc.data() } as UserProfile;
    logger.info(`Successfully fetched user profile for userId: ${userId}`);
    return profileData;
  } catch (error) {
    logger.error('Error fetching user profile:', {
      userId,
      error,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error('プロフィールの取得に失敗しました');
  }
}

export async function createUserProfile(userId: string, data: ProfileFormData): Promise<UserProfile> {
  try {
    logger.info(`Creating user profile for userId: ${userId}`);
    const now = Timestamp.now();
    
    const profileData: UserProfile = {
      id: userId,
      displayName: data.displayName,
      bio: data.bio,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(doc(db, 'profiles', userId), profileData);
    logger.info(`Successfully created user profile for userId: ${userId}`);
    return profileData;
  } catch (error) {
    logger.error('Error creating user profile:', {
      userId,
      data,
      error,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error('プロフィールの作成に失敗しました');
  }
}

export async function updateUserProfile(userId: string, data: Partial<ProfileFormData>): Promise<UserProfile> {
  try {
    logger.info(`Updating user profile for userId: ${userId}`, { updateData: data });
    const profileRef = doc(db, 'profiles', userId);
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      return await createUserProfile(userId, data as ProfileFormData);
    }

    const now = Timestamp.now();
    const updates = {
      ...data,
      updatedAt: now
    };

    await updateDoc(profileRef, updates);
    
    const updatedProfile = {
      ...profileDoc.data(),
      ...updates,
      id: userId
    } as UserProfile;

    logger.info(`Successfully updated user profile for userId: ${userId}`);
    return updatedProfile;
  } catch (error) {
    logger.error('Error updating user profile:', {
      userId,
      updateData: data,
      error,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error('プロフィールの更新に失敗しました');
  }
}