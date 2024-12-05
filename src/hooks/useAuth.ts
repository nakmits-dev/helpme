import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  subscribeToAuthState, 
  signOut as firebaseSignOut,
  signIn,
  signUp,
  signInAnon,
  verifyEmail 
} from '../services/firebase/auth';
import { getUserProfile } from '../services/firebase/users';

interface AuthUser {
  id: string;
  email?: string;
  isAnonymous: boolean;
  emailVerified: boolean;
  displayName: string;
  bio?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          let displayName = '匿名ユーザー';
          let bio: string | undefined;

          if (!firebaseUser.isAnonymous) {
            const userProfile = await getUserProfile(firebaseUser.uid);
            if (userProfile) {
              displayName = userProfile.displayName;
              bio = userProfile.bio;
            }
          }

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            isAnonymous: firebaseUser.isAnonymous,
            emailVerified: firebaseUser.emailVerified,
            displayName,
            bio
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    signInAnon,
    verifyEmail,
    isAuthenticated: !!user,
    isAnonymous: user?.isAnonymous ?? false
  };
}