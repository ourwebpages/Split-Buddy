# 🚀 24-HOUR HACKATHON: SPLIT-BILL EXPENSE TRACKER
## Complete Battle Plan for 2-Person Team

---

## 📋 PROJECT SCOPE (LOCKED)

**What You're Building:**
A web app where roommates can:
1. Create/join a shared expense group
2. Log expenses (who paid, amount, who's involved)
3. See real-time dashboard of who owes whom
4. Settle debts with minimum transaction calculation
5. View expense history

**Tech Stack:**
- Frontend: Next.js + React + Tailwind CSS
- Backend: Firebase (Firestore + Auth)
- Deployment: Vercel
- Language: JavaScript (single codebase, hot reload)

---

# ⏱️ PHASE-BY-PHASE BREAKDOWN

## 🟢 PHASE 1: SETUP + DATA STRUCTURE (Hours 0-2)

### Hour 0-1: Project Initialization & Firebase Setup

**PERSON A (Firebase/Backend):**
```bash
# Step 1: Create Next.js project
npx create-next-app@latest split-bill --typescript
cd split-bill

# Step 2: Install dependencies
npm install firebase tailwindcss postcss autoprefixer
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Step 3: Set up Firebase project
# Go to: https://console.firebase.google.com
# 1. Create new project: "split-bill-hackathon"
# 2. Enable Authentication (Email/Password)
# 3. Create Firestore Database (start in test mode for now)
# 4. Copy your config
```

**Create `lib/firebase.js`:**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**Create `.env.local`:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

**PERSON B (Frontend/UI):**
- Set up Tailwind CSS basics
- Create folder structure:
  ```
  app/
    ├── layout.js
    ├── page.js (home)
    ├── auth/
    │   ├── login/page.js
    │   ├── signup/page.js
    ├── dashboard/
    │   └── page.js
    ├── group/
    │   └── [id]/page.js
  components/
    ├── Navbar.js
    ├── ExpenseForm.js
    ├── ExpenseList.js
    ├── SettleUp.js
    └── BalanceCard.js
  ```

**Checkpoint (Hour 1):**
- ✅ Next.js running on `localhost:3000`
- ✅ Firebase initialized
- ✅ Folder structure created
- ✅ Tailwind working (test with a blue button)

---

### Hour 1-2: Data Structure & Firestore Schema

**FIRESTORE COLLECTIONS:**

```
groups/
  └── {groupId}/
      ├── name: string
      ├── members: array[userId]
      ├── createdAt: timestamp
      ├── createdBy: userId
      
expenses/
  └── {groupId}/
      └── {expenseId}/
          ├── amount: number
          ├── description: string
          ├── paidBy: userId
          ├── splitBetween: array[userId]
          ├── date: timestamp
          ├── createdAt: timestamp

users/
  └── {userId}/
      ├── email: string
      ├── displayName: string
      ├── createdAt: timestamp
```

**PERSON A: Create Firestore Rules (for testing):**
```javascript
// firestore.rules (in Firebase Console > Firestore > Rules tab)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Groups: members can read/write
    match /groups/{groupId} {
      allow read: if request.auth.uid in resource.data.members;
      allow write: if request.auth.uid in resource.data.members;
      
      // Expenses in group
      match /expenses/{expenseId} {
        allow read: if request.auth.uid in get(/databases/$(database)/documents/groups/$(groupId)).data.members;
        allow create: if request.auth.uid != null;
      }
    }
  }
}
```

**PERSON B: Create Core Utility Functions**

Create `lib/calculations.js`:
```javascript
/**
 * Calculate who owes whom
 * Input: array of expenses
 * Output: array of settlement transactions
 */
export function calculateBalances(expenses, members) {
  // Track how much each person paid vs. owed
  const balances = {};
  members.forEach(m => balances[m] = 0);

  expenses.forEach(exp => {
    const perPerson = exp.amount / exp.splitBetween.length;
    
    // Person who paid gets positive credit
    balances[exp.paidBy] += exp.amount;
    
    // Everyone in split gets negative debt
    exp.splitBetween.forEach(person => {
      balances[person] -= perPerson;
    });
  });

  return balances; // { userId: netAmount, ... }
}

/**
 * Minimal transactions to settle up
 * Greedy algorithm: match debtors with creditors
 */
export function settleTransactions(balances) {
  const settled = [];
  const debtors = Object.entries(balances)
    .filter(([_, b]) => b < 0)
    .map(([id, b]) => ({ id, amount: -b }));
  const creditors = Object.entries(balances)
    .filter(([_, b]) => b > 0)
    .map(([id, b]) => ({ id, amount: b }));

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].amount, creditors[j].amount);
    settled.push({
      from: debtors[i].id,
      to: creditors[j].id,
      amount: amount.toFixed(2),
    });

    debtors[i].amount -= amount;
    creditors[j].amount -= amount;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return settled;
}
```

**Checkpoint (Hour 2):**
- ✅ Firestore schema defined
- ✅ Firebase rules written
- ✅ Calculation functions tested locally
- ✅ Both team members understand data flow

**🔴 CRITICAL: Commit to git now!**
```bash
git add .
git commit -m "Setup: Firebase config + Firestore schema + calculation utils"
git push origin main
```

---

## 🟡 PHASE 2: CORE FEATURES (Hours 2-6)

### Hour 2-3: Authentication (Sign Up / Login)

**PERSON A: Auth Context & Hooks**

Create `lib/authContext.js`:
```javascript
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        setUser({ id: firebaseUser.uid, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), {
      email,
      displayName,
      createdAt: new Date(),
    });
    return res.user;
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

**PERSON B: Login / Signup Pages**

Create `app/auth/login/page.js`:
```javascript
'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

Create `app/auth/signup/page.js` (similar, with displayName field)

**PERSON A: Protected Route Wrapper**

Create `components/ProtectedRoute.js`:
```javascript
'use client';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return null;

  return children;
}
```

**Update `app/layout.js` to wrap with AuthProvider:**
```javascript
import { AuthProvider } from '@/lib/authContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Checkpoint (Hour 3):**
- ✅ User can sign up with email/password
- ✅ User can log in
- ✅ Auth state persists (refresh page = still logged in)
- ✅ Protected routes redirect to login
- **TEST**: Sign up, log out, log back in

---

### Hour 3-4: Group Management (Create & Join)

**PERSON A: Firestore Group Functions**

Create `lib/groupService.js`:
```javascript
import { db } from './firebase';
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';

export async function createGroup(name, userId) {
  const docRef = await addDoc(collection(db, 'groups'), {
    name,
    members: [userId],
    createdBy: userId,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function getGroup(groupId) {
  const docSnap = await getDoc(doc(db, 'groups', groupId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function joinGroup(groupId, userId) {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    members: arrayUnion(userId),
  });
}

export async function getUserGroups(userId) {
  const q = query(collection(db, 'groups'), where('members', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

**PERSON B: Group Pages**

Create `app/dashboard/page.js`:
```javascript
'use client';
import { useAuth } from '@/lib/authContext';
import { useEffect, useState } from 'react';
import { getUserGroups } from '@/lib/groupService';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserGroups(user.id).then(setGroups).finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <p>Loading groups...</p>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">My Groups</h1>
            <Link
              href="/group/create"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Create Group
            </Link>
          </div>

          {groups.length === 0 ? (
            <div className="bg-white p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">You haven't joined any groups yet.</p>
              <Link href="/group/create" className="text-blue-600 font-semibold hover:underline">
                Create your first group
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map(group => (
                <Link key={group.id} href={`/group/${group.id}`}>
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                    <h2 className="text-xl font-bold text-gray-800">{group.name}</h2>
                    <p className="text-gray-600 text-sm mt-2">{group.members.length} members</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

Create `app/group/create/page.js`:
```javascript
'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { createGroup } from '@/lib/groupService';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CreateGroupPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const groupId = await createGroup(name, user.id);
    router.push(`/group/${groupId}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Create a Group</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Group name (e.g., Apartment ABC)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

**Checkpoint (Hour 4):**
- ✅ User can create a group
- ✅ Dashboard shows all user's groups
- ✅ Group can be joined (manually add members)
- **TEST**: Create 2 groups, verify on dashboard

**🔴 COMMIT:**
```bash
git add .
git commit -m "Feature: Authentication & Group Management"
git push origin main
```

---

### Hour 4-6: Core Expense Features

**PERSON A: Expense Service**

Create `lib/expenseService.js`:
```javascript
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export async function addExpense(groupId, expense) {
  const docRef = await addDoc(collection(db, 'groups', groupId, 'expenses'), {
    ...expense,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function getGroupExpenses(groupId) {
  const q = query(collection(db, 'groups', groupId, 'expenses'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => b.date - a.date);
}

export async function deleteExpense(groupId, expenseId) {
  await deleteDoc(doc(db, 'groups', groupId, 'expenses', expenseId));
}
```

**PERSON B: Expense Form & Display**

Create `components/ExpenseForm.js`:
```javascript
'use client';
import { useState } from 'react';
import { addExpense } from '@/lib/expenseService';
import { useAuth } from '@/lib/authContext';

export function ExpenseForm({ groupId, members, onExpenseAdded }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState(user.id);
  const [splitBetween, setSplitBetween] = useState([user.id]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addExpense(groupId, {
        amount: parseFloat(amount),
        description,
        paidBy,
        splitBetween,
        date: new Date(),
      });
      setAmount('');
      setDescription('');
      setSplitBetween([user.id]);
      onExpenseAdded();
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId) => {
    setSplitBetween(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          placeholder="Amount"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Who paid?</label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {members.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Split between:</label>
        <div className="grid grid-cols-2 gap-2">
          {members.map(m => (
            <label key={m} className="flex items-center">
              <input
                type="checkbox"
                checked={splitBetween.includes(m)}
                onChange={() => toggleMember(m)}
                className="mr-2"
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
```

Create `components/ExpenseList.js`:
```javascript
'use client';
export function ExpenseList({ expenses, members, onDelete }) {
  const memberMap = members.reduce((acc, id) => {
    acc[id] = id.split('@')[0]; // Simple name extraction
    return acc;
  }, {});

  return (
    <div className="space-y-2">
      {expenses.map(exp => (
        <div key={exp.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="font-semibold">{exp.description}</p>
            <p className="text-sm text-gray-600">
              {memberMap[exp.paidBy]} paid ₹{exp.amount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              Split between: {exp.splitBetween.map(id => memberMap[id]).join(', ')}
            </p>
          </div>
          <button
            onClick={() => onDelete(exp.id)}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

Create `components/BalanceCard.js`:
```javascript
'use client';
import { calculateBalances, settleTransactions } from '@/lib/calculations';

export function BalanceCard({ expenses, members }) {
  const balances = calculateBalances(expenses, members);
  const settlements = settleTransactions(balances);

  const memberMap = members.reduce((acc, id) => {
    acc[id] = id.split('@')[0];
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Settle Up</h2>
      {settlements.length === 0 ? (
        <p>Everything is settled! ✨</p>
      ) : (
        <div className="space-y-2">
          {settlements.map((s, i) => (
            <p key={i} className="text-lg">
              {memberMap[s.from]} → {memberMap[s.to]}: ₹{s.amount}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
```

Create `app/group/[id]/page.js`:
```javascript
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getGroup } from '@/lib/groupService';
import { getGroupExpenses, deleteExpense } from '@/lib/expenseService';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { BalanceCard } from '@/components/BalanceCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function GroupPage() {
  const params = useParams();
  const groupId = params.id;
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const grp = await getGroup(groupId);
    const exps = await getGroupExpenses(groupId);
    setGroup(grp);
    setExpenses(exps);
  };

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [groupId]);

  const handleDelete = async (expenseId) => {
    await deleteExpense(groupId, expenseId);
    setExpenses(expenses.filter(e => e.id !== expenseId));
  };

  if (loading) return <p>Loading...</p>;
  if (!group) return <p>Group not found</p>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">{group.name}</h1>

          <BalanceCard expenses={expenses} members={group.members} />
          <ExpenseForm
            groupId={groupId}
            members={group.members}
            onExpenseAdded={loadData}
          />

          <div>
            <h2 className="text-2xl font-bold mb-4">Expenses</h2>
            {expenses.length === 0 ? (
              <p className="text-gray-600">No expenses yet</p>
            ) : (
              <ExpenseList expenses={expenses} members={group.members} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

**Checkpoint (Hour 6):**
- ✅ Add expense to a group
- ✅ See all expenses in list
- ✅ Calculate and display who owes whom
- ✅ Delete expenses
- **TEST**: Add 3 expenses, split differently, verify math

**🔴 COMMIT:**
```bash
git add .
git commit -m "Feature: Core expense tracking & calculations"
git push origin main
```

---

## 🟠 PHASE 3: UI POLISH & REFINEMENT (Hours 6-12)

### Hour 6-8: Design Pass & Component Refinement

**PERSON B: Tailwind Styling Upgrade**
- Add gradient backgrounds
- Improve typography (font sizes, weights)
- Add hover effects, transitions
- Mobile-first responsive design
- Add loading spinners, error states

**PERSON A: Real-time Updates (Optional)**
- Add Firestore listeners for live updates when teammates add expenses
- Implement auto-refresh when viewing group page

### Hour 8-10: Add Member Invitation

**PERSON A: Invite Code Generation**
```javascript
// In groupService.js
export async function generateInviteCode(groupId) {
  const code = Math.random().toString(36).substr(2, 8).toUpperCase();
  // Store in Firestore or just return
  return code;
}

export async function joinGroupByCode(code, userId) {
  // Decode code and get groupId, then joinGroup()
}
```

**PERSON B: Invite UI & Copy Button**
- Display group invite code/link
- Copy to clipboard functionality
- Show members list with avatars

### Hour 10-12: Mobile Optimization & Edge Cases

**Both:**
- Test on mobile (use Chrome DevTools)
- Fix responsive layout issues
- Add input validation (negative amounts, etc.)
- Handle loading/error states gracefully
- Test with 0 expenses, 1 person, many members

**🔴 COMMIT:**
```bash
git add .
git commit -m "Polish: UI refinement, invites, mobile optimization"
git push origin main
```

---

## 🔴 PHASE 4: TESTING & EDGE CASES (Hours 12-18)

### Hour 12-14: Manual Testing

**Test Scenarios:**
1. Sign up → Create group → Add expense → Verify balance
2. Multiple users → Add to same group → Verify each user sees correct data
3. Complex split (3 people, 1 pays, 2 split) → Verify math
4. Delete expense → Verify recalculation
5. No expenses → Verify "all settled" message
6. Uneven splits (3 people, ₹100 = ₹33.33 each)

### Hour 14-16: Bug Fixes & Optimization

**Common Issues:**
- Firestore rules preventing writes? → Debug console errors
- Calculation rounding errors? → Use `.toFixed(2)` everywhere
- Performance issues with many expenses? → Add pagination or filtering
- Real-time sync issues? → Test network latency

### Hour 16-18: Demo Readiness

**Prepare:**
- Create a fresh account for demo
- Pre-populate with realistic test data
- Write down 3-min demo script
- Test on Vercel preview link
- Take screenshots for slide deck

**🔴 COMMIT:**
```bash
git add .
git commit -m "Testing: Fixed edge cases, demo-ready build"
git push origin main
```

---

## 🟢 PHASE 5: DEPLOYMENT & DEMO (Hours 18-24)

### Hour 18-19: Deploy to Vercel

```bash
# If not already connected:
vercel login
vercel

# Or: git push to trigger auto-deploy (if linked)
git push origin main

# Add environment variables in Vercel dashboard
# NEXT_PUBLIC_FIREBASE_* (all 6 variables)

# Once deployed, test live URL
```

### Hour 19-20: Final Polish & Bug Fixes

- Test on live Vercel URL (not localhost)
- Fix any production issues
- Verify Firebase Firestore rules are locked down
- Add loading states, error messages everywhere

### Hour 20-22: Create Presentation

**Slide Deck (5-10 slides):**
1. Problem statement
2. Solution (what you built)
3. Tech stack (why these choices)
4. Demo video or live walkthrough
5. Key features (expense tracking, balance calculation, settlements)
6. Challenges faced & how you solved them
7. Future improvements
8. Thank you / Questions

### Hour 22-23: Final Demo Run

- **Live demo** on Vercel (5 min max)
  - Sign up new user
  - Create group
  - Add 3 expenses
  - Show balance calculation
  - Show settlement breakdown
- **Q&A Prep**: Anticipate questions about tech choices, scalability, etc.

### Hour 23-24: Relax & Celebrate 🎉

- Submit final link
- Take screenshots for portfolio
- Write down lessons learned
- Get some sleep!

---

## 🎯 SUCCESS CRITERIA

Your app should have by Hour 24:

✅ **MVP Working:**
- Users can sign up / log in
- Create groups with teammates
- Add expenses with split logic
- See who owes whom
- Settle up calculation

✅ **Deployed:**
- Live on Vercel
- All team members can access via public URL

✅ **Demo-Ready:**
- No console errors
- Handles edge cases gracefully
- Mobile-friendly
- 5-minute demo prepared

---

## 🚨 EMERGENCY CHECKLIST (If Behind)

**Hour 12 and only have auth?**
→ Skip invite codes, focus on core expense logic

**Hour 15 and no deployment?**
→ Deploy immediately (Vercel setup = 2 min), test live

**Hour 20 and UI is rough?**
→ Don't waste time on design, focus on features working

**Unclear math on balances?**
→ Use simple equal split first, skip complex ratios

---

## 💡 TEAM COMMUNICATION

**Use Discord / Slack for:**
- Hourly checkins
- Blocking issues (Firestore errors, etc.)
- Pairing when stuck

**Key Sync Points:**
- Hour 2: Setup complete?
- Hour 6: Core features done?
- Hour 12: All features working?
- Hour 18: Deployed?
- Hour 23: Demo ready?

---

## 📚 USEFUL LINKS

- Firebase Console: https://console.firebase.google.com
- Vercel Dashboard: https://vercel.com/dashboard
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Firestore: https://firebase.google.com/docs/firestore

---

**🔥 You've got this. Build fast, commit often, deploy early. Let's go! 🚀**
