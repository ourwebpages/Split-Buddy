'use client';

import { useMemo } from 'react';
import { calculateBalances, formatINR, settleTransactions } from '../lib/calculations';
import { memberLabel } from '../lib/groupService';

export default function BalanceCard({ group, expenses }) {
  const { balances, settlements } = useMemo(() => {
    if (!group?.members?.length) {
      return { balances: {}, settlements: [] };
    }
    const nextBalances = calculateBalances(expenses, group.members);
    return {
      balances: nextBalances,
      settlements: settleTransactions(nextBalances),
    };
  }, [expenses, group]);

  if (!group) return null;

  const rows = group.members.map((id) => ({
    id,
    amount: balances[id] || 0,
  }));

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-base font-semibold">Who owes whom</h2>
      <p className="mt-1 text-sm text-gray-500">
        Net balances update live. Settlements are the fewest payments to zero everyone out.
      </p>

      <ul className="mt-4 divide-y divide-gray-100">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between py-2 text-sm">
            <span className="font-medium">{memberLabel(group, row.id)}</span>
            <span
              className={
                row.amount > 0.005
                  ? 'text-green-700 font-semibold'
                  : row.amount < -0.005
                    ? 'text-red-700 font-semibold'
                    : 'text-gray-500'
              }
            >
              {row.amount > 0.005
                ? `is owed ${formatINR(row.amount)}`
                : row.amount < -0.005
                  ? `owes ${formatINR(Math.abs(row.amount))}`
                  : 'settled'}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-md bg-gray-50 px-3 py-3">
        <h3 className="text-sm font-semibold">Minimum payments</h3>
        {settlements.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Everyone is even. No payments needed.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {settlements.map((tx, index) => (
              <li key={`${tx.from}-${tx.to}-${index}`}>
                <span className="font-medium">{memberLabel(group, tx.from)}</span>
                {' pays '}
                <span className="font-medium">{memberLabel(group, tx.to)}</span>
                {` ${formatINR(tx.amount)}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
