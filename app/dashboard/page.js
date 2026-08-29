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

const GRADIENT_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-teal-400 to-emerald-600',
  'from-orange-400 to-rose-500',
  'from-cyan-500 to-blue-600',
];

function DashboardBody() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

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

  async function handleCopyCode(e, code) {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      setCopiedCode(null);
    }
  }

  const firstName = (user?.displayName || user?.email || 'there').split(' ')[0].split('@')[0];

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans">
      <AppHeader />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-brand p-6 text-white shadow-md sm:p-8">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/80">Dashboard</p>
                <h1 className="mt-1 font-nunito text-2xl font-extrabold sm:text-3xl">
                  Welcome back, {firstName} 👋
                </h1>
                <p className="mt-1.5 max-w-md text-sm text-white/90">
                  Track shared expenses with your flatmates, view live balances, and settle up easily.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/group/create"
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-brand-navy shadow-sm transition hover:bg-gray-50 active:scale-98"
                >
                  <span className="text-base leading-none">+</span>
                  <span>Create Group</span>
                </Link>
                <Link
                  href="/join"
                  className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-98"
                >
                  <span>🔑</span>
                  <span>Join with Code</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-white/20 pt-4 text-xs font-medium text-white/90">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>
                  <strong>{groups.length}</strong> {groups.length === 1 ? 'active group' : 'active groups'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Groups Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-nunito text-lg font-bold text-brand-navy">Your Flat Groups</h2>
            {groups.length > 0 && (
              <span className="text-xs font-semibold text-brand-muted">
                {groups.length} {groups.length === 1 ? 'group' : 'groups'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-white p-5"
                />
              ))}
            </div>
          ) : groups.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-xs">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10 text-3xl">
                🏠
              </div>
              <h3 className="mt-4 font-nunito text-lg font-bold text-brand-navy">No groups yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-brand-muted">
                Create a group for your apartment or join your roommates using a 6-character invite code.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/group/create"
                  className="rounded-xl bg-gradient-brand px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-90"
                >
                  Create Your First Group
                </Link>
                <Link
                  href="/join"
                  className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Join Existing Flat
                </Link>
              </div>
            </div>
          ) : (
            /* Groups Grid */
            <div className="grid gap-4 sm:grid-cols-2">
              {groups.map((group, idx) => {
                const gradient = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
                const initial = (group.name || 'G').charAt(0).toUpperCase();
                const membersCount = group.members?.length || 0;
                const isCopied = copiedCode === group.inviteCode;

                return (
                  <Link
                    key={group.id}
                    href={`/group/${group.id}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-base font-extrabold text-white shadow-xs`}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate font-nunito text-base font-bold text-brand-navy group-hover:text-brand-blue transition">
                              {group.name}
                            </h3>
                            <p className="text-xs text-brand-muted mt-0.5">
                              {membersCount} {membersCount === 1 ? 'roommate' : 'roommates'}
                            </p>
                          </div>
                        </div>

                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition text-xs font-bold">
                          →
                        </span>
                      </div>

                      {/* Roommate initial tags */}
                      {group.memberNames && (
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          {Object.entries(group.memberNames)
                            .slice(0, 4)
                            .map(([uid, name]) => (
                              <span
                                key={uid}
                                className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                              >
                                {name.split(' ')[0]}
                              </span>
                            ))}
                          {membersCount > 4 && (
                            <span className="text-[11px] font-medium text-gray-400">
                              +{membersCount - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer with Invite Code */}
                    {group.inviteCode && (
                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-gray-400 uppercase">Code:</span>
                          <span className="font-mono font-bold tracking-wider text-gray-800">
                            {group.inviteCode}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(e, group.inviteCode)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                            isCopied
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {isCopied ? '✓ Copied' : 'Copy Code'}
                        </button>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
