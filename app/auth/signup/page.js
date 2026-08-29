'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getPostAuthPath, useAuth } from '../../../lib/authContext';
import { getAuthErrorMessage } from '../../../lib/authErrors';

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-6">
          <p className="text-sm text-gray-500">Loading...</p>
        </main>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const { user, loading, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '';

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(getPostAuthPath(user, redirectUrl));
    }
  }, [user, loading, router, redirectUrl]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const newUser = await signup(email, password, displayName);
      router.push(getPostAuthPath(newUser, redirectUrl));
    } catch (err) {
      setError(err.message || getAuthErrorMessage(err, 'signup'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  const loginLink = redirectUrl
    ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
    : '/auth/login';

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-gray-200 p-8">
        <h1 className="text-xl font-semibold">Create account</h1>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <label className="mt-6 block text-sm font-medium text-gray-700">
          Name
          <input
            type="text"
            required
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href={loginLink} className="font-medium text-gray-900 underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
