'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPostAuthPath, useAuth } from '../lib/authContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const currentUrl =
        typeof window !== 'undefined'
          ? window.location.pathname + window.location.search
          : '';
      const loginUrl =
        currentUrl && currentUrl !== '/' && currentUrl !== '/dashboard'
          ? `/auth/login?redirect=${encodeURIComponent(currentUrl)}`
          : '/auth/login';
      router.push(loginUrl);
      return;
    }

    const nextPath = getPostAuthPath(user);
    if (nextPath !== '/dashboard') {
      router.push(nextPath);
    }
  }, [user, loading, router]);

  if (loading || !user || !user.emailVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return children;
}
