# Product Requirements Document (PRD) & Technical Specification
## SplitBill — Expense Tracker for Roommates

**Version:** 1.0
**Status:** Hackathon MVP (24-hour build)
**Team Size:** 2
**Event:** DSO Spirit Hackathon — Problem #01 (Web Development)

---

# PART 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Problem Statement

Roommates and shared households constantly juggle who paid for what — groceries, rent utilities, takeout — and tracking it manually (mental math, spreadsheets, or "I'll just Venmo you later") leads to forgotten debts, awkward conversations, and unfair splits.

**Official brief:** *Build a web app where a group can log shared expenses, see who owes whom, and settle up with the minimum number of transactions.*

## 2. Goals & Objectives

| Goal | Why it matters for judging |
|---|---|
| Make group expense tracking effortless | Core value prop — must feel obviously useful in a live demo |
| Show correct, non-trivial math (debt simplification) | This is the technical differentiator vs. "just a list of expenses" |
| Ship a working, deployed product in 24 hrs | Hackathons reward *finished* over *ambitious* |
| Clean, believable UI | Judges remember what they can see |

## 3. Target Users

- **Primary:** College students/roommates sharing a flat, splitting rent + daily costs.
- **Secondary:** Any small group with recurring shared expenses (trip groups, project teams).

**Persona:** "Priya" — shares a 3-BHK with two flatmates, pays for groceries, wants to know at month-end who owes what without opening a spreadsheet.

## 4. User Stories

| ID | As a... | I want to... | So that... | Priority |
|---|---|---|---|---|
| US-1 | User | Sign up / log in | My data is tied to my identity | P0 |
| US-2 | User | Create a group | I can start tracking shared expenses with roommates | P0 |
| US-3 | User | Join a group (via invite) | I can see expenses my flatmates added | P0 |
| US-4 | User | Add an expense (amount, payer, split-between) | It's recorded who paid and who owes | P0 |
| US-5 | User | See a live balance ("who owes whom") | I know the current state without doing math | P0 |
| US-6 | User | See the *minimum* transactions to settle up | I don't have to make 5 payments when 2 would do | P0 |
| US-7 | User | View expense history | I can review/audit past spending | P1 |
| US-8 | User | Delete/edit an expense | I can fix mistakes | P1 |
| US-9 | User | Split unequally (not just even split) | Real expenses aren't always 50/50 | P2 |
| US-10 | User | Mark a settlement as "paid" | The balance updates once debts are actually settled | P2 |

**P0 = MVP (must-have for demo). P1 = build if time allows. P2 = stretch/cut first if behind.**

## 5. Feature Scope

### In Scope (MVP — P0)
1. Email/password authentication (Firebase Auth)
2. Create a group; invite members (shareable code/link)
3. Add expense: amount, description, paid-by, split-between (equal split)
4. Real-time balance dashboard per group
5. Debt-simplification algorithm → minimum settlement transactions
6. Expense history list

### In Scope if Time Allows (P1)
7. Delete expenses (with balance recalculation)
8. Edit expenses
9. Basic member avatars/display names instead of raw emails

### Explicitly Out of Scope (P2 / Post-hackathon)
- Unequal/custom split ratios (percentage or exact-amount splits)
- "Mark as settled" payment tracking / partial payments
- Push/email notifications
- Multi-currency support
- Receipt photo uploads
- Recurring/scheduled expenses
- Native mobile app

> **Why this cut matters:** equal-split covers the demo-able 80% case. Custom splits add UI complexity and edge cases (rounding, validation) that risk eating hours without changing the judged outcome.

## 6. Success Metrics (Demo-Day Definition of Done)

- [ ] A judge can sign up, create a group, add 3 expenses, and see correct settlement math in under 2 minutes
- [ ] App is live on a public Vercel URL (not localhost)
- [ ] Zero console errors during the demo flow
- [ ] Works on a phone-sized viewport (judges often check this)

## 7. Constraints

- **Time:** 24 hours total, 2-person team, first hackathon
- **Budget:** $0 — must stay within Firebase/Vercel free tiers
- **Team skill level:** Beginner-friendly stack required (drove the tech stack choice below)

---

# PART 2: TECHNICAL SPECIFICATION

## 1. Architecture Overview

```
┌─────────────────────────────────────────────┐
│              Client (Browser)                │
│   Next.js App Router + React + Tailwind      │
└───────────────────┬───────────────────────────┘
                    │ Firebase SDK (client-side)
                    ▼
┌─────────────────────────────────────────────┐
│                 Firebase                      │
│  ┌───────────────┐   ┌─────────────────────┐ │
│  │ Auth           │   │ Firestore            │ │
│  │ (email/pass)   │   │ (groups, expenses)    │ │
│  └───────────────┘   └─────────────────────┘ │
└─────────────────────────────────────────────┘
                    │
                    ▼
         Deployed via Vercel (CI/CD on git push)
```

**Pattern:** Serverless, client-heavy architecture. No custom backend server — Firestore is read/written directly from the client via the Firebase SDK, secured by Firestore Security Rules rather than a middle-tier API. This is the correct trade-off for a 24-hour build: it removes an entire layer (API routes, server auth middleware) without meaningfully weakening security for this data sensitivity level.

## 2. Tech Stack & Justification

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | Next.js (App Router) | File-based routing, hot reload, one command to deploy |
| UI | React + Tailwind CSS | Component reuse across 2 devs; utility classes = fast styling without a design system |
| Auth | Firebase Authentication | Zero backend auth code; email/password is enough for MVP |
| Database | Firestore | Real-time listeners (live balance updates), generous free tier, no schema migrations to manage under time pressure |
| Hosting | Vercel | Git-push-to-deploy; zero DevOps config |
| Language | JavaScript (not TS) | One less thing to debug under time pressure for first-time hackers — type safety is a good trade to skip here |

## 3. Data Model

### Firestore Collections

```
users/{userId}
  ├─ email: string
  ├─ displayName: string
  └─ createdAt: timestamp

groups/{groupId}
  ├─ name: string
  ├─ members: array<userId>
  ├─ createdBy: userId
  └─ createdAt: timestamp

groups/{groupId}/expenses/{expenseId}
  ├─ amount: number
  ├─ description: string
  ├─ paidBy: userId
  ├─ splitBetween: array<userId>
  ├─ date: timestamp
  └─ createdAt: timestamp
```

**Design decisions:**
- Expenses are a **subcollection** of groups (not a top-level collection filtered by groupId) — this scopes Firestore security rules naturally and avoids needing composite indexes for the common query ("all expenses for group X").
- `members` is a flat array on the group doc (not a subcollection) — simpler `array-contains` queries for "find all groups I'm in," and group sizes here are small (3-6 people), so array growth isn't a concern.

## 4. Core Algorithm: Debt Simplification

This is the technical centerpiece — worth calling out explicitly in the demo/judging.

**Step 1 — Net balance per person:**
For each expense, the payer's balance increases by the full amount; each person in `splitBetween` has their balance decreased by `amount / splitBetween.length`.

**Step 2 — Minimum transaction settlement (greedy algorithm):**
Split people into debtors (negative balance) and creditors (positive balance). Repeatedly match the current debtor against the current creditor, transfer `min(debt, credit)`, and advance whichever side hits zero first.

- **Complexity:** O(n log n) for sorting + O(n) for matching — trivial at hackathon group sizes (3-10 people), but worth stating that it's not accidental.
- **Note:** greedy matching produces *a* minimal-transaction-count solution but not necessarily the theoretically optimal one for all balance distributions (true optimal minimum-transaction settlement is NP-hard in general). For groups this size, greedy is effectively optimal and is the standard practical approach — fine to state plainly if a judge asks.

## 5. Security

- Firestore Security Rules enforce: a user can only read/write a group document if their UID is in that group's `members` array; expense writes require an authenticated UID.
- No amount/money actually moves through the app — it only *calculates* who owes whom. This meaningfully lowers the security bar versus a real payments product.
- `.env.local` holds Firebase config; added to `.gitignore` — never committed. Equivalent values re-added as environment variables in the Vercel dashboard at deploy time.

## 6. Non-Functional Requirements

| Requirement | Target | Rationale |
|---|---|---|
| Page load | < 2s on 4G | Judges test on their own devices |
| Real-time balance update | < 1s after expense added | Firestore listeners, not polling |
| Mobile responsive | 375px width minimum | Phone-sized demo viewing is common |
| Uptime during demo window | 100% | Vercel free tier is sufficient at this traffic scale |

## 7. Known Limitations (be upfront about these if asked)

- Equal-split only — no custom ratios (documented as explicit scope cut, see PRD §5)
- No payment integration — this is a *calculator*, not a payment processor, by design
- Firestore free tier limits (50K reads/day) are far beyond hackathon demo traffic, not a real constraint here
- No automated tests — manual test pass only, appropriate for 24-hour scope

## 8. Deployment Plan

1. `git push` to `main` → Vercel auto-builds and deploys (already connected in Hour 0 setup)
2. Environment variables (6 Firebase config values) set once in Vercel dashboard, not per-deploy
3. Firestore Security Rules published from Firebase Console before final demo (currently test-mode during dev)

---

## Appendix: Traceability — PRD → Implementation

| PRD User Story | Implemented By |
|---|---|
| US-1 (Auth) | `lib/authContext.js`, `app/auth/*` |
| US-2/US-3 (Groups) | `lib/groupService.js`, `app/group/create`, `app/dashboard`, `app/join` |
| US-4 (Add expense) | `lib/expenseService.js`, `components/ExpenseForm.js` |
| US-5/US-6 (Balances/Settlement) | `lib/calculations.js`, `components/BalanceCard.js` |
| US-7 (History) | `components/ExpenseList.js` |
