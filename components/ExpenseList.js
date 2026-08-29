'use client';

import { formatINR } from '../lib/calculations';
import { memberLabel } from '../lib/groupService';
import { CATEGORIES } from './ExpenseForm';

const CATEGORY_ICONS = {
  groceries: '',
  food: '',
  utilities: '',
  rent: '',
  transport: '',
  entertainment: '',
  general: '',
};

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

export default function ExpenseList({ group, expenses = [] }) {
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
        {expenses.length > 0 && (
          <div className="rounded-xl border border-brand-teal/20 bg-brand-teal/10 px-3 py-1 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Total Group Spend</p>
            <p className="text-sm font-bold text-teal-900">{formatINR(totalAmount)}</p>
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-xl">
            🧾
          </div>
          <p className="mt-3 font-semibold text-gray-700">No expenses recorded yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Use the form above to add shared expenses for your flat.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {expenses.map((exp) => {
            const icon = CATEGORY_ICONS[exp.category] || '';
            const splitCount = exp.splitBetween?.length || 0;
            const perPerson = splitCount > 0 ? Number(exp.amount) / splitCount : 0;
            const payerName = memberLabel(group, exp.paidBy);

            return (
              <li key={exp.id} className="p-4 transition hover:bg-gray-50/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg shadow-xs">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">{exp.description}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {/* Payer badge — always visible */}
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 px-2 py-0.5 text-[11px] font-bold text-brand-blue">
                          💳 {payerName} paid
                        </span>
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                          ÷ {splitCount} {splitCount === 1 ? 'person' : 'people'} · {formatINR(perPerson)} each
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-nunito text-base font-bold text-brand-navy">
                      {formatINR(exp.amount)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {formatDate(exp.createdAt || exp.date)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
