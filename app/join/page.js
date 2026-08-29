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
    <div className="min-h-screen bg-gray-50/70 font-sans">
      <AppHeader title="Join a Group" backHref="/dashboard" />
      <main className="mx-auto flex max-w-md px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-xl text-white shadow-xs">
            🔑
          </div>
          <h2 className="mt-4 font-nunito text-2xl font-extrabold text-brand-navy">
            Join Flat Group
          </h2>
          <p className="mt-1 text-xs text-brand-muted">
            Enter the 6-character invite code shared by your roommate to join their flat group.
          </p>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-brand-muted">
            6-Character Invite Code
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABC234"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-base font-bold uppercase tracking-widest text-gray-900 shadow-sm transition placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-brand py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
          >
            {submitting ? 'Joining Flat...' : 'Join Group'}
          </button>
        </form>
      </main>
    </div>
  );
}
