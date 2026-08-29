// lib/calculations.js
// Core algorithm: Debt Simplification (Tech Spec Part 2, Section 4)
//
// Step 1: net balance per person across all expenses.
// Step 2: greedy min-transaction settlement (debtors vs creditors).
//
// Note: greedy matching yields a minimal-transaction-count solution, not
// necessarily the theoretical optimum for every balance distribution (true
// optimal settlement is NP-hard). At hackathon group sizes (3-10 people)
// greedy is effectively optimal and is the standard practical approach.

// Money comparisons must not use exact float equality (0.1 + 0.2 !== 0.3).
// One paisa (0.01) is below any amount this app can produce, so it's a
// safe "close enough to zero" threshold.
const EPSILON = 0.01;

/**
 * Computes each member's net balance for a group.
 * Positive balance = the group owes this person money (they overpaid).
 * Negative balance = this person owes the group money.
 *
 * @param {Array} expenses - array of { amount, paidBy, splitBetween }
 * @param {Array<string>} memberIds - all member UIDs in the group, so
 *   members with zero net balance still appear (needed for the UI to
 *   show "settled up" rather than omitting them).
 * @returns {Object} map of userId -> balance (rounded to 2 decimals)
 */
export function computeBalances(expenses, memberIds) {
  const balances = {};
  memberIds.forEach((id) => {
    balances[id] = 0;
  });

  expenses.forEach((expense) => {
    const { amount, paidBy, splitBetween } = expense;
    if (!splitBetween || splitBetween.length === 0) return;

    const share = amount / splitBetween.length;

    balances[paidBy] = (balances[paidBy] || 0) + amount;
    splitBetween.forEach((memberId) => {
      balances[memberId] = (balances[memberId] || 0) - share;
    });
  });

  Object.keys(balances).forEach((id) => {
    balances[id] = Math.round(balances[id] * 100) / 100;
  });

  return balances;
}

/**
 * Greedy minimum-transaction debt settlement.
 *
 * @param {Object} balances - map of userId -> net balance
 * @returns {Array<{from: string, to: string, amount: number}>}
 *   "from" owes "to" the given amount.
 */
export function simplifyDebts(balances) {
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance < -EPSILON) debtors.push({ userId, amount: -balance });
    else if (balance > EPSILON) creditors.push({ userId, amount: balance });
  });

  // Largest-first ordering tends to produce fewer transactions in practice
  // for typical hackathon-sized groups, though it is not guaranteed optimal.
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settled = Math.min(debtor.amount, creditor.amount);

    if (settled > EPSILON) {
      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: Math.round(settled * 100) / 100,
      });
    }

    debtor.amount -= settled;
    creditor.amount -= settled;

    if (debtor.amount <= EPSILON) i += 1;
    if (creditor.amount <= EPSILON) j += 1;
  }

  return transactions;
}

export { EPSILON };
