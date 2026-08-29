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
  const [editingExpense, setEditingExpense] = useState(null);

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

  function handleEditExpense(expense) {
    setEditingExpense(expense);
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  function handleExpenseAdded() {
    // Expenses are auto-subscribed in real-time, so no need to do anything here
  }

  const membersCount = group?.members?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans">
      <AppHeader title={group?.name || 'Group'} backHref="/dashboard" />

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-2xl border border-gray-200 bg-white" />
            <div className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-white" />
          </div>
        ) : !group ? null : (
          <>
            {/* Group Header & Invite Card */}
            <section className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-gray-200/80">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-bold text-brand-blue">
                      Flat Group
                    </span>
                    <span className="text-xs text-brand-muted">
                      {membersCount} {membersCount === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                  <h1 className="mt-1 font-nunito text-2xl font-extrabold text-brand-navy sm:text-3xl">
                    {group.name}
                  </h1>
                </div>

                {/* Invite Code Pill */}
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50/80 p-2 shadow-xs">
                  <div className="px-2 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Invite Code</p>
                    <p className="font-mono text-base font-extrabold tracking-wider text-gray-900">
                      {group.inviteCode}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyInvite}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-brand text-white hover:opacity-90'
                    }`}
                  >
                    {copied ? '✓ Copied' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </section>

            {/* Balances & Settlement Overview */}
            <BalanceCard group={group} expenses={expenses} />

            {/* Add Expense Form */}
            <ExpenseForm
              group={group}
              currentUserId={user.uid}
              onAdded={handleExpenseAdded}
              editingExpense={editingExpense}
              onCancelEdit={handleCancelEdit}
            />

            {/* Expense History List */}
            <ExpenseList
              group={group}
              expenses={expenses}
              onEditRequest={handleEditExpense}
            />
          </>
        )}
      </main>
    </div>
  );
}
