'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext(null);

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function getPostAuthPath(user, redirectUrl) {
  if (!user) return '/auth/login';
  if (!user.emailVerified) return '/auth/verify-email';
  if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
    return redirectUrl;
  }
  return '/dashboard';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signup(email, password, displayName) {
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = String(displayName || '').trim();

    if (!normalizedName) {
      throw new Error('Enter your name.');
    }

    const credential = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    );

    try {
      await updateProfile(credential.user, { displayName: normalizedName });

      // Mirrored into Firestore (not just Firebase Auth) so groupService and
      // expenseService can read a member's display name via a normal
      // Firestore query instead of a separate Admin SDK lookup.
      await setDoc(doc(db, 'users', credential.user.uid), {
        email: normalizedEmail,
        displayName: normalizedName,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      await deleteUser(credential.user);
      throw err;
    }

    try {
      await sendEmailVerification(credential.user);
    } catch (err) {
      console.error('Failed to send verification email:', err);
    }

    return credential.user;
  }

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(
      auth,
      normalizeEmail(email),
      password
    );
    return credential.user;
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, normalizeEmail(email));
  }

  async function sendVerificationEmail() {
    if (!auth.currentUser) {
      throw new Error('You must be logged in to resend a verification email.');
    }
    await sendEmailVerification(auth.currentUser);
  }

  async function refreshUser() {
    if (!auth.currentUser) return null;
    await reload(auth.currentUser);
    const refreshed = auth.currentUser;
    setUser(
      refreshed
        ? Object.assign(Object.create(Object.getPrototypeOf(refreshed)), refreshed)
        : null
    );
    return refreshed;
  }

  async function logout() {
    await signOut(auth);
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    sendVerificationEmail,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
