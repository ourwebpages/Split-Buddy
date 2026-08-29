'use client';

import { useEffect, useState } from 'react';
import { addExpense } from '../lib/expenseService';
import { memberLabel } from '../lib/groupService';
import { formatINR } from '../lib/calculations';

export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', icon: '', placeholder: 'Milk, groceries, veggies' },
  { id: 'food', label: 'Food & Drinks', icon: '', placeholder: 'Dinner, pizza, takeout' },
  { id: 'utilities', label: 'Bills & Utilities', icon: '', placeholder: 'Electricity, Wi-Fi, water' },
  { id: 'rent', label: 'Rent & Housing', icon: '', placeholder: 'Monthly rent, maintenance' },
  { id: 'transport', label: 'Transport', icon: '', placeholder: 'Cab, petrol, metro' },
  { id: 'entertainment', label: 'Fun & Movies', icon: '', placeholder: 'Movie tickets, outing, party' },
  { id: 'general', label: 'Other', icon: '', placeholder: 'Household supplies, general' },
];

export default function ExpenseForm({ group, currentUserId, onAdded }) {
  const members = group?.members || [];
  const memberKey = members.join(',');
  const [isOpen, setIsOpen] = useState(true);
  const [category, setCategory] = useState('groceries');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId || '');
  const [splitBetween, setSplitBetween] = useState(members);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPaidBy((current) => current || currentUserId || members[0] || '');
  }, [currentUserId, memberKey]);

  useEffect(() => {
    setSplitBetween((prev) => {
      if (!prev || prev.length === 0) return members;
      const valid = prev.filter((id) => members.includes(id));
      return valid.length > 0 ? valid : members;
    });
  }, [memberKey]);

  function toggleMember(id) {
    setSplitBetween((current) =>
      current.includes(id) ? current.filter((m) => m !== id) : [...current, id]
    );
  }

  function handleSelectAll() {
    setSplitBetween(members);
  }

  function handleClearAll() {
    setSplitBetween([]);
  }

  const selectedCategory = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const parsedAmount = parseFloat(amount);
  const splitCount = splitBetween.length;
  const perPersonAmount =
    !isNaN(parsedAmount) && parsedAmount > 0 && splitCount > 0
      ? parsedAmount / splitCount
      : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (splitCount === 0) {
      setError('Please select at least one member to split the expense.');
      return;
    }

    setSubmitting(true);
    try {
      await addExpense(group.id, {
        amount,
        description: description.trim() || selectedCategory.label,
        category,
        paidBy,
        splitBetween,
      });
      setAmount('');
      setDescription('');
      setSplitBetween(members);
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.message || 'Could not add expense.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-sm font-bold">
            +
          </div>
          <div>
            <h2 className="font-nunito text-base font-bold text-brand-navy">Add Expense</h2>
            <p className="text-xs text-brand-muted">Split bills equally with flatmates</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
        >
          {isOpen ? 'Minimize' : 'Expand Form'}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <span className="shrink-0 text-base">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Category Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
              Category
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      if (!description) {
                        setDescription(cat.placeholder.split(',')[0]);
                      }
                    }}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-brand text-white shadow-sm scale-105'
                        : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
                Amount (₹)
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base font-bold text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-base font-semibold text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
            </div>

            {/* Paid By */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
                Paid by
              </label>
              <select
                required
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              >
                {members.map((id) => (
                  <option key={id} value={id}>
                    {memberLabel(group, id)} {id === currentUserId ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
              Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={selectedCategory.placeholder}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          {/* Split Between Members */}
          <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                  Split between ({splitCount} selected)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-semibold text-brand-blue hover:underline"
                >
                  Select all
                </button>
                <span className="text-xs text-gray-300">|</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Live Per-Person Split Badge */}
            {perPersonAmount > 0 && (
              <div className="mt-2.5 flex items-center justify-between rounded-lg bg-brand-blue/10 px-3 py-1.5 text-xs font-semibold text-brand-blue">
                <span>⚡ Live Breakdown:</span>
                <span className="font-bold">{formatINR(perPersonAmount)} / person</span>
              </div>
            )}

            {/* Member Chips Grid */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {members.map((id) => {
                const isSelected = splitBetween.includes(id);
                const name = memberLabel(group, id);
                const initial = name.charAt(0).toUpperCase() || 'U';
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleMember(id)}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                      isSelected
                        ? 'border-brand-blue bg-white shadow-xs ring-2 ring-brand-blue/15'
                        : 'border-gray-200 bg-gray-100/80 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isSelected
                          ? 'bg-gradient-brand text-white shadow-xs'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {initial}
                    </div>
                    <span
                      className={`min-w-0 flex-1 truncate text-xs font-semibold ${
                        isSelected ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {name}
                    </span>
                    {isSelected && (
                      <span className="text-xs text-brand-blue font-bold">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
          >
            {submitting ? (
              <span>Adding expense...</span>
            ) : (
              <>
                <span>Add Expense</span>
                {perPersonAmount > 0 && (
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-medium">
                    ({formatINR(parsedAmount)})
                  </span>
                )}
              </>
            )}
          </button>
        </form>
      )}
    </section>
  );
}
