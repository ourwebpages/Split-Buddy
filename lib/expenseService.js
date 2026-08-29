// lib/expenseService.js
// Reads/writes groups/{groupId}/expenses subcollection (Tech Spec Part 2, Section 3).
// Security is enforced by Firestore Security Rules, not here.

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Subscribes to real-time expense updates for a group, newest first.
 * Returns the unsubscribe function - caller must invoke it on unmount.
 */
export function subscribeExpenses(groupId, onUpdate, onError) {
  const expensesRef = collection(db, 'groups', groupId, 'expenses');
  const expensesQuery = query(expensesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    expensesQuery,
    (snapshot) => {
      const expenses = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onUpdate(expenses);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

/**
 * Adds a new expense. splitBetween defaults to equal split across the
 * given member list (custom ratios are explicitly out of MVP scope,
 * PRD Part 1, Section 5).
 */
export async function addExpense(groupId, { amount, description, paidBy, splitBetween }) {
  const expensesRef = collection(db, 'groups', groupId, 'expenses');
  return addDoc(expensesRef, {
    amount,
    description,
    paidBy,
    splitBetween,
    date: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

/**
 * Updates an existing expense (P1 - edit expense).
 */
export async function updateExpense(groupId, expenseId, { amount, description, paidBy, splitBetween }) {
  const expenseRef = doc(db, 'groups', groupId, 'expenses', expenseId);
  return updateDoc(expenseRef, { amount, description, paidBy, splitBetween });
}

/**
 * Deletes an expense (P1 - delete expense). Balances recalculate
 * automatically since BalanceCard derives from the live expense list.
 */
export async function deleteExpense(groupId, expenseId) {
  const expenseRef = doc(db, 'groups', groupId, 'expenses', expenseId);
  return deleteDoc(expenseRef);
}
