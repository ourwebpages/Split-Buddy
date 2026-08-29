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
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-emerald-500 text-base shadow-sm">
            ⚖️
          </div>
          <div>
            <h2 className="font-nunito text-base font-bold text-brand-navy">Who Owes Whom</h2>
            <p className="text-xs text-brand-muted">
              Live net balances & simplified minimum settlements
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Balances List */}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {rows.map((row) => {
            const name = memberLabel(group, row.id);
            const initial = name.charAt(0).toUpperCase() || 'U';
            const isOwed = row.amount > 0.005;
            const owes = row.amount < -0.005;

            return (
              <div
                key={row.id}
                className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                  isOwed
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : owes
                      ? 'border-rose-200 bg-rose-50/50'
                      : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isOwed
                        ? 'bg-emerald-600 text-white'
                        : owes
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-400 text-white'
                    }`}
                  >
                    {initial}
                  </div>
                  <span className="truncate text-xs font-semibold text-gray-900">{name}</span>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${
                      isOwed
                        ? 'bg-emerald-100 text-emerald-800'
                        : owes
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isOwed
                      ? `+${formatINR(row.amount)}`
                      : owes
                        ? `-${formatINR(Math.abs(row.amount))}`
                        : 'Settled'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimum Settle-Up Payments */}
        <div className="mt-5 rounded-xl border border-gray-200/90 bg-gradient-to-br from-gray-50 to-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy">
              Suggested Payments to Settle
            </h3>
            <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-bold text-brand-blue">
              Min Transactions
            </span>
          </div>

          {settlements.length === 0 ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs font-medium text-emerald-800">
              <span>🎉</span>
              <p>Everyone is settled up! No payments needed right now.</p>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {settlements.map((tx, index) => {
                const debtorName = memberLabel(group, tx.from);
                const creditorName = memberLabel(group, tx.to);

                return (
                  <li
                    key={`${tx.from}-${tx.to}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-2.5 text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-gray-900 truncate">{debtorName}</span>
                      <span className="shrink-0 text-brand-blue font-bold">➔</span>
                      <span className="font-bold text-gray-900 truncate">{creditorName}</span>
                    </div>
                    <span className="shrink-0 font-nunito text-sm font-bold text-brand-purple">
                      {formatINR(tx.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
