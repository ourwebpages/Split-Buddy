'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPostAuthPath, useAuth } from '../../../lib/authContext';
import { getAuthErrorMessage } from '../../../lib/authErrors';

export default function VerifyEmailPage() {
  const { user, loading, sendVerificationEmail, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    if (user.emailVerified) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  async function handleResend() {
    setError('');
    setSuccess('');
    setResending(true);
    try {
      await sendVerificationEmail();
      setSuccess('Verification email sent. Check your inbox and spam folder.');
    } catch (err) {
      setError(getAuthErrorMessage(err, 'verify'));
    } finally {
      setResending(false);
    }
  }

  async function handleCheckVerification() {
    setError('');
    setSuccess('');
    setChecking(true);
    try {
      const refreshedUser = await refreshUser();
      if (refreshedUser?.emailVerified) {
        router.replace('/dashboard');
        return;
      }
      setError('Email not verified yet. Click the link in your inbox, then try again.');
    } catch (err) {
      setError(getAuthErrorMessage(err, 'verify'));
    } finally {
      setChecking(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push('/auth/login');
  }

  if (loading || !user || user.emailVerified) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 p-8">
        <h1 className="text-xl font-semibold">Verify your email</h1>
        <p className="mt-2 text-sm text-gray-600">
          We sent a verification link to{' '}
          <span className="font-medium text-gray-900">{user.email}</span>. Open it to
          activate your account.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        {success && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
        )}

        <button
          type="button"
          onClick={handleCheckVerification}
          disabled={checking}
          className="mt-6 w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {checking ? 'Checking...' : "I've verified my email"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="mt-3 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50"
        >
          {resending ? 'Sending...' : 'Resend verification email'}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 w-full text-sm font-medium text-gray-600 underline hover:text-gray-900"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
