'use client';

import { useState, useEffect } from 'react';
import { addExpense, updateExpense } from '../lib/expenseService';
import { memberLabel } from '../lib/groupService';

export default function ExpenseForm({ group, currentUserId, onAdded, editingExpense, onCancelEdit }) {
  const isEditMode = Boolean(editingExpense);
  const members = group?.members || [];

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitBetween, setSplitBetween] = useState(members);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setAmount(String(editingExpense.amount));
      setDescription(editingExpense.description);
      setPaidBy(editingExpense.paidBy);
      setSplitBetween(editingExpense.splitBetween);
    }
  }, [editingExpense]);

  function resetForm() {
    setAmount('');
    setDescription('');
    setPaidBy(currentUserId);
    setSplitBetween(members);
    setError('');
  }

  function toggleMember(id) {
    setSplitBetween((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description.trim()) {
      setError('Enter a description for this expense.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }
    if (splitBetween.length === 0) {
      setError('Select at least one person to split this expense between.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        amount: Math.round(numericAmount * 100) / 100,
        description: description.trim(),
        paidBy,
        splitBetween,
      };

      if (isEditMode) {
        await updateExpense(group.id, editingExpense.id, payload);
        onCancelEdit();
      } else {
        await addExpense(group.id, payload);
        resetForm();
        if (onAdded) onAdded();
      }
    } catch (err) {
      setError(err.message || 'Could not save the expense. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-sm font-bold">
            +
          </div>
          <div>
            <h2 className="font-nunito text-base font-bold text-brand-navy">
              {isEditMode ? 'Edit Expense' : 'Add Expense'}
            </h2>
            <p className="text-xs text-brand-muted">Split bills equally with flatmates</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            <span className="shrink-0">!</span>
            <p>{error}</p>
          </div>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Groceries, rent, takeout..."
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
              Amount (₹)
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base font-bold text-gray-400">
                ₹
              </span>
              <input
                id="amount"
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
            <label htmlFor="paid-by" className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
              Paid by
            </label>
            <select
              id="paid-by"
              required
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            >
              {members.map((id) => (
                <option key={id} value={id}>
                  {memberLabel(group, id)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Split Between Members */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
              Split between ({splitBetween.length} selected)
            </span>
          </div>

          {/* Member Chips Grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                  {isSelected && <span className="text-xs text-brand-blue font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-gradient-brand py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
          >
            {isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : isEditMode ? 'Save Changes' : 'Add Expense'}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
