'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AppHeader from '../../../components/AppHeader';
import { useAuth } from '../../../lib/authContext';
import { createGroup } from '../../../lib/groupService';

export default function CreateGroupPage() {
  return (
    <ProtectedRoute>
      <CreateGroupBody />
    </ProtectedRoute>
  );
}

function CreateGroupBody() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const groupId = await createGroup(name, user);
      router.push(`/group/${groupId}`);
    } catch (err) {
      setError(err.message || 'Could not create group.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Create a group" backHref="/dashboard" />
      <main className="mx-auto flex max-w-sm px-4 py-10">
        <form onSubmit={handleSubmit} className="w-full rounded-lg border border-gray-200 bg-white p-6">
          {error && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Group name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="3-BHK roommates"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create group'}
          </button>
        </form>
      </main>
    </div>
  );
}
