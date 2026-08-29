import { calculateBalances, settleTransactions } from './lib/calculations.js';

const members = ['alex', 'priya', 'sam'];
const expenses = [
  { amount: 900, paidBy: 'alex', splitBetween: ['alex', 'priya', 'sam'] }
];

const balances = calculateBalances(expenses, members);
console.log('balances:', balances);
console.log('settlements:', settleTransactions(balances));
