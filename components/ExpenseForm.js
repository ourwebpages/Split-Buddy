'use client';

import { useEffect, useState } from 'react';
import { addExpense } from '../lib/expenseService';
import { memberLabel } from '../lib/groupService';

export default function ExpenseForm({ group, currentUserId, onAdded }) {
  const members = group?.members || [];
  const memberKey = members.join(',');
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await addExpense(group.id, {
        amount,
        description,
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
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-base font-semibold">Add expense</h2>
      <p className="mt-1 text-sm text-gray-500">Equal split across the people you select.</p>

      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Description
        <input
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Groceries, rent, takeout"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Amount (₹)
        <div className="relative mt-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">
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
            className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Paid by
        <select
          required
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {members.map((id) => (
            <option key={id} value={id}>
              {memberLabel(group, id)}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-gray-700">Split between</legend>
        <div className="mt-2 space-y-2">
          {members.map((id) => (
            <label key={id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={splitBetween.includes(id)}
                onChange={() => toggleMember(id)}
              />
              {memberLabel(group, id)}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add expense'}
      </button>
    </form>
  );
}
