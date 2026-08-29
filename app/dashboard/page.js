'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../lib/authContext';
import { subscribeUserGroups } from '../../lib/groupService';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardBody />
    </ProtectedRoute>
  );
}

function DashboardBody() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return undefined;
    const unsubscribe = subscribeUserGroups(
      user.uid,
      (next) => {
        setGroups(next);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching user groups:', err);
        setError(err.message || 'Could not load groups.');
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Your groups" />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/group/create"
            className="rounded-md bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800"
          >
            Create a group
          </Link>
          <Link
            href="/join"
            className="rounded-md border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            Join with a code
          </Link>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        {loading ? (
          <p className="mt-8 text-sm text-gray-500">Loading groups...</p>
        ) : groups.length === 0 ? (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-center">
            <p className="text-gray-600">No groups yet.</p>
            <p className="mt-1 text-sm text-gray-500">
              Create one for your flat, then share the invite code with roommates.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {groups.map((group) => (
              <li key={group.id}>
                <Link
                  href={`/group/${group.id}`}
                  className="block rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
                >
                  <p className="font-semibold">{group.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {group.members?.length || 0} members
                    {group.inviteCode ? ` · code ${group.inviteCode}` : ''}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
