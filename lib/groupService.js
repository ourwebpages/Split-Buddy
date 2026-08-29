import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateInviteCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function memberLabel(group, userId) {
  return group?.memberNames?.[userId] || userId.slice(0, 8);
}

async function allocateInviteCode() {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateInviteCode();
    const inviteSnap = await getDoc(doc(db, 'invites', code));
    if (!inviteSnap.exists()) {
      return code;
    }
  }
  throw new Error('Could not allocate an invite code. Try again.');
}

export async function createGroup(name, user) {
  const cleanName = String(name || '').trim();
  if (!cleanName) {
    throw new Error('Enter a group name.');
  }

  const inviteCode = await allocateInviteCode();
  const groupRef = doc(collection(db, 'groups'));
  const inviteRef = doc(db, 'invites', inviteCode);
  const batch = writeBatch(db);

  batch.set(groupRef, {
    name: cleanName,
    members: [user.uid],
    memberNames: {
      [user.uid]: user.displayName || user.email || 'You',
    },
    createdBy: user.uid,
    inviteCode,
    createdAt: serverTimestamp(),
  });

  batch.set(inviteRef, {
    groupId: groupRef.id,
    createdBy: user.uid,
  });

  await batch.commit();
  return groupRef.id;
}

export async function joinGroupByCode(code, user) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) {
    throw new Error('Enter an invite code.');
  }

  const inviteSnap = await getDoc(doc(db, 'invites', normalized));
  if (!inviteSnap.exists()) {
    throw new Error('No group found for that code.');
  }

  const { groupId } = inviteSnap.data();

  // arrayUnion is a no-op if already a member. Non-members cannot read the
  // group first, so we do not getDoc here — the join rule allows this update.
  await updateDoc(doc(db, 'groups', groupId), {
    members: arrayUnion(user.uid),
    [`memberNames.${user.uid}`]: user.displayName || user.email || 'Roommate',
  });

  return groupId;
}

export function subscribeUserGroups(userId, onGroups, onError) {
  const q = query(
    collection(db, 'groups'),
    where('members', 'array-contains', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const groups = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      groups.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      onGroups(groups);
    },
    onError
  );
}

export function subscribeGroup(groupId, onGroup, onError) {
  return onSnapshot(
    doc(db, 'groups', groupId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onGroup(null);
        return;
      }
      onGroup({ id: snapshot.id, ...snapshot.data() });
    },
    onError
  );
}
