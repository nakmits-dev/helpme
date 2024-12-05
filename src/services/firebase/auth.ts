import {
  signInWithEmailAndPassword,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  User as FirebaseUser,
  applyActionCode,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import type { UserProfile } from '../../types';

export async function signIn(email: string, password: string): Promise<void> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await sendEmailVerification(user);
      await signOut();
      throw new Error('メールアドレスの確認が必要です。確認メールを再送信しました。');
    }

    const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
    
    if (!profileDoc.exists()) {
      const now = Timestamp.now();
      const profileData: UserProfile = {
        id: user.uid,
        displayName: '匿名ユーザー',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(doc(db, 'profiles', user.uid), profileData);
    }
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('ログイン試行回数が多すぎます。しばらく時間をおいて再試行してください。');
    }
    throw error;
  }
}

export async function signUp(email: string, password: string): Promise<void> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    const now = Timestamp.now();
    const profileData: UserProfile = {
      id: user.uid,
      displayName: '匿名ユーザー',
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, 'profiles', user.uid), profileData);

    await signOut();
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('このメールアドレスは既に使用されています');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('パスワードは8文字以上で設定してください');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('有効なメールアドレスを入力してください');
    }
    throw error;
  }
}

export async function signInAnon(): Promise<void> {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    throw new Error('匿名ログインに失敗しました');
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error('ログアウトに失敗しました');
  }
}

export async function verifyEmail(actionCode: string): Promise<void> {
  try {
    await applyActionCode(auth, actionCode);
  } catch (error) {
    throw new Error('メールアドレスの確認に失敗しました');
  }
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}