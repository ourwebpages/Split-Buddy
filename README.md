# split-buddy

Expense tracker for roommates. See `PRD\\\\\\\_and\\\\\\\_Tech\\\\\\\_Spec.md` for full requirements.

## Setup

1. Install dependencies:

```
   npm install
   ```

2. Create a Firebase project in the Firebase Console:

   * Enable Authentication (Email/Password)
   * Create a Firestore database
3. Copy `.env.local.example` to `.env.local` and fill in the six Firebase
config values from the Firebase Console.
4. Publish `firestore.rules` from the Firebase Console (Rules tab) before
creating groups. Test-mode rules will not match this app's invite flow.
5. Run the dev server:

```
   npm run dev
   ```

## Status

P0 demo path is implemented:

* Auth (signup / login / logout)
* Create group with invite code
* Join via code or `/join?code=`
* Add equal-split expenses
* Live balances and minimum settlement payments
* Expense history

Deploy: connect the repo to Vercel and set the same six `NEXT\\\\\\\_PUBLIC\\\\\\\_FIREBASE\\\\\\\_\\\\\\\*`
variables. Publish Firestore rules before the demo.

