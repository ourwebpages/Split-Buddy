'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../lib/authContext';
import { joinGroupByCode } from '../../lib/groupService';

export default function JoinPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<p className="p-6 text-sm text-gray-500">Loading...</p>}>
        <JoinBody />
      </Suspense>
    </ProtectedRoute>
  );
}

function JoinBody() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get('code');
    if (fromUrl) {
      setCode(fromUrl.toUpperCase());
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const groupId = await joinGroupByCode(code, user);
      router.push(`/group/${groupId}`);
    } catch (err) {
      setError(err.message || 'Could not join group.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Join a group" backHref="/dashboard" />
      <main className="mx-auto flex max-w-sm px-4 py-10">
        <form onSubmit={handleSubmit} className="w-full rounded-lg border border-gray-200 bg-white p-6">
          {error && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Invite code
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC234"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase tracking-widest"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? 'Joining...' : 'Join group'}
          </button>
        </form>
      </main>
    </div>
  );
}
