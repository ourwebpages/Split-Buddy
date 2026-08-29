'use client';

import { formatINR } from '../lib/calculations';
import { memberLabel } from '../lib/groupService';

function formatDate(value) {
  if (!value) return 'Just now';
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ExpenseList({ group, expenses }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-base font-semibold">Expense history</h2>
      {expenses.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">No expenses yet. Add the first one above.</p>
      ) : (
        <ul className="mt-3 divide-y divide-gray-100">
          {expenses.map((exp) => (
            <li key={exp.id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{exp.description}</p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {memberLabel(group, exp.paidBy)} paid · split{' '}
                    {exp.splitBetween?.length || 0}
                  </p>
                </div>
                <p className="shrink-0 font-semibold">{formatINR(exp.amount)}</p>
              </div>
              <p className="mt-1 text-xs text-gray-400">{formatDate(exp.createdAt || exp.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
