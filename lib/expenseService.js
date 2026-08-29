import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export async function addExpense(groupId, { amount, description, paidBy, splitBetween }) {
  const parsedAmount = Math.round(Number(amount) * 100) / 100;
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Enter an amount greater than 0.');
  }
  const cleanDescription = String(description || '').trim();
  if (!cleanDescription) {
    throw new Error('Enter a description.');
  }
  if (!splitBetween?.length) {
    throw new Error('Select at least one person to split with.');
  }

  const docRef = await addDoc(collection(db, 'groups', groupId, 'expenses'), {
    amount: parsedAmount,
    description: cleanDescription,
    paidBy,
    splitBetween,
    date: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export function subscribeExpenses(groupId, onExpenses, onError) {
  const q = query(
    collection(db, 'groups', groupId, 'expenses'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onExpenses(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    onError
  );
}
