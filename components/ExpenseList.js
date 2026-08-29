'use client';

import { useState } from 'react';
import { deleteExpense } from '../lib/expenseService';
import { memberLabel } from '../lib/groupService';

function formatDate(timestamp) {
  if (!timestamp || !timestamp.toDate) return '';
  return timestamp.toDate().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function ExpenseList({ group, expenses, onEditRequest }) {
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(expenseId) {
    const confirmed = window.confirm('Delete this expense? This cannot be undone.');
    if (!confirmed) return;

    setDeletingId(expenseId);
    try {
      await deleteExpense(group.id, expenseId);
    } finally {
      setDeletingId(null);
    }
  }

  if (!expenses || expenses.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white px-5 py-4">
          <h2 className="font-nunito text-base font-bold text-brand-navy">Expense History</h2>
          <p className="text-xs text-brand-muted">No expenses yet</p>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">No expenses recorded yet. Add one to start tracking.</p>
        </div>
      </section>
    );
  }

  const totalAmount = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white px-5 py-4">
        <div>
          <h2 className="font-nunito text-base font-bold text-brand-navy">Expense History</h2>
          <p className="text-xs text-brand-muted">
            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} recorded
          </p>
        </div>
        <div className="rounded-xl border border-brand-teal/20 bg-brand-teal/10 px-3 py-1 text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Total Group Spend</p>
          <p className="text-sm font-bold text-teal-900">₹{totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        {expenses.map((exp) => {
          const splitCount = exp.splitBetween?.length || 0;
          const perPerson = splitCount > 0 ? Number(exp.amount) / splitCount : 0;
          const payerName = memberLabel(group, exp.paidBy);

          return (
            <li key={exp.id} className="p-4 transition hover:bg-gray-50/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900">{exp.description}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 px-2 py-0.5 text-[11px] font-bold text-brand-blue">
                      {payerName} paid
                    </span>
                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                      ÷ {splitCount} {splitCount === 1 ? 'person' : 'people'} · ₹{perPerson.toFixed(2)} each
                    </span>
                    {exp.date && (
                      <span className="text-[11px] text-gray-400">{formatDate(exp.date)}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="font-nunito text-base font-bold text-brand-navy">
                    ₹{exp.amount.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    {onEditRequest && (
                      <button
                        type="button"
                        onClick={() => onEditRequest(exp)}
                        className="text-xs text-blue-600 hover:underline focus:outline-none"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(exp.id)}
                      disabled={deletingId === exp.id}
                      className="text-xs text-red-600 hover:underline disabled:opacity-50 focus:outline-none"
                    >
                      {deletingId === exp.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
