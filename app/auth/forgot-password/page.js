'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/authContext';
import { getAuthErrorMessage } from '../../../lib/authErrors';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSuccess('If an account exists for that email, a reset link has been sent.');
    } catch (err) {
      setError(getAuthErrorMessage(err, 'reset'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-gray-200 p-8">
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and we&apos;ll send you a link to choose a new password.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        {success && (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
        )}

        <label className="mt-6 block text-sm font-medium text-gray-700">
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

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? 'Sending...' : 'Send reset link'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/auth/login" className="font-medium text-gray-900 underline">
            Back to log in
          </Link>
        </p>
      </form>
    </main>
  );
}
