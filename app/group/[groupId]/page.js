'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AppHeader from '../../../components/AppHeader';
import BalanceCard from '../../../components/BalanceCard';
import ExpenseForm from '../../../components/ExpenseForm';
import ExpenseList from '../../../components/ExpenseList';
import { useAuth } from '../../../lib/authContext';
import { subscribeExpenses } from '../../../lib/expenseService';
import { subscribeGroup } from '../../../lib/groupService';

export default function GroupPage() {
  return (
    <ProtectedRoute>
      <GroupBody />
    </ProtectedRoute>
  );
}

function GroupBody() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!groupId) return undefined;
    const unsubGroup = subscribeGroup(
      groupId,
      (next) => {
        setGroup(next);
        setLoading(false);
        if (!next) {
          setError('Group not found, or you are not a member.');
        }
      },
      () => {
        setError('Could not load this group.');
        setLoading(false);
      }
    );
    const unsubExpenses = subscribeExpenses(
      groupId,
      setExpenses,
      () => setError('Could not load expenses.')
    );
    return () => {
      unsubGroup();
      unsubExpenses();
    };
  }, [groupId]);

  async function copyInvite() {
    if (!group?.inviteCode) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const text = `${group.inviteCode} — ${origin}/join?code=${group.inviteCode}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title={group?.name || 'Group'} backHref="/dashboard" />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading group...</p>
        ) : !group ? null : (
          <>
            <section className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Share this code so roommates can join</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="font-mono text-xl tracking-widest">{group.inviteCode}</p>
                <button
                  type="button"
                  onClick={copyInvite}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
                >
                  {copied ? 'Copied' : 'Copy invite'}
                </button>
              </div>
            </section>

            <BalanceCard group={group} expenses={expenses} />
            <ExpenseForm group={group} currentUserId={user.uid} />
            <ExpenseList group={group} expenses={expenses} />
          </>
        )}
      </main>
    </div>
  );
}
