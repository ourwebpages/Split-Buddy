// Core settlement math for a group. Two-step process:
// 1. calculateBalances: net amount each member is owed (+) or owes (-)
// 2. settleTransactions: greedy debtor/creditor matching to minimize
//    the number of payments needed to zero everyone out.
//
// Greedy matching is not guaranteed to be the theoretical minimum for
// every balance distribution (true optimal minimum-transaction settlement
// is NP-hard), but for hackathon-scale groups (3-10 people) it produces
// an effectively optimal result and is the standard practical approach.
// See PRD_and_Tech_Spec.md Part 2 Section 4.

export function formatINR(value) {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateBalances(expenses = [], members = []) {
  const balances = {};
  members.forEach((m) => {
    balances[m] = 0;
  });

  expenses.forEach((exp) => {
    const splitCount = exp.splitBetween?.length || 0;
    if (splitCount === 0 || !exp.amount) return;

    const perPerson = exp.amount / splitCount;

    balances[exp.paidBy] = (balances[exp.paidBy] || 0) + exp.amount;

    exp.splitBetween.forEach((person) => {
      balances[person] = (balances[person] || 0) - perPerson;
    });
  });

  return balances;
}

export function settleTransactions(balances = {}) {
  const settled = [];

  const debtors = Object.entries(balances)
    .filter(([, b]) => b < -0.005)
    .map(([id, b]) => ({ id, amount: -b }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Object.entries(balances)
    .filter(([, b]) => b > 0.005)
    .map(([id, b]) => ({ id, amount: b }))
    .sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].amount, creditors[j].amount);

    settled.push({
      from: debtors[i].id,
      to: creditors[j].id,
      amount: amount.toFixed(2),
    });

    debtors[i].amount -= amount;
    creditors[j].amount -= amount;

    // Use a small epsilon rather than exact equality since floating-point
    // subtraction rarely lands on precisely 0.
    if (debtors[i].amount < 0.005) i++;
    if (creditors[j].amount < 0.005) j++;
  }

  return settled;
}
