SplitBuddy

Shared expenses. Clear balances. Fewer settlements.

SplitBuddy is a web-based expense tracker for roommates and small groups. It helps users record shared expenses, calculate who owes whom, and simplify the resulting debts into fewer settlement transactions.

Built for the DSO Spirit Hackathon — Problem #01: Web Development.

Problem

Roommates and shared households regularly split expenses such as groceries, rent, utilities, and takeout. Tracking these manually through memory, spreadsheets, or chat messages makes it difficult to maintain an accurate view of who owes whom.

The official challenge asks for a web application that can:

Log shared expenses
Show who owes whom
Settle balances using the minimum number of transactions
Solution

SplitBuddy provides a single workflow for managing shared expenses:

Create or join a group
Add shared expenses
Select who paid
Select who participated in the expense
Automatically calculate each member's net balance
Generate a simplified settlement plan
Review expense history
Features
MVP
Email/password authentication
Create expense groups
Join groups using an invite code/link
Add equal-split expenses
Select the payer
Select members involved in an expense
Real-time balance dashboard
Debt simplification
Settlement transaction calculation
Expense history
Additional
Delete expenses with balance recalculation
Responsive mobile-friendly interface

Unequal/custom splits, payment processing, notifications, multi-currency support, receipt uploads, recurring expenses, and a native mobile application are outside the current MVP scope.

How the Settlement Works

SplitBuddy first calculates a net balance for every group member.

For each expense:

Payer → receives credit for the full expense

Participants → receive an equal share of the expense as debt

Example:

Alex pays ₹900
Alex, Priya and Sam share the expense

Each person's share = ₹900 / 3 = ₹300

Alex: +₹600
Priya: -₹300
Sam:  -₹300

The application then separates:

Creditors — members with positive balances
Debtors — members with negative balances

A greedy settlement algorithm matches debtors with creditors and transfers the required amounts until the balances are cleared.

The implementation runs in:

O(n log n)

for sorting and matching, which is appropriate for the small groups targeted by the application.

Tech Stack
Layer	Technology
Frontend	Next.js
UI	React + Tailwind CSS
Language	JavaScript
Authentication	Firebase Authentication
Database	Cloud Firestore
Hosting	Vercel

The architecture uses a serverless, client-heavy approach. The browser communicates with Firebase through the Firebase SDK, while Firestore Security Rules provide access control.

Project Structure
split-buddy/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── group/
│   │   ├── create/
│   │   └── [id]/
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── Navbar.js
│   ├── ExpenseForm.js
│   ├── ExpenseList.js
│   ├── SettleUp.js
│   └── BalanceCard.js
│
├── lib/
│   ├── firebase.js
│   ├── authContext.js
│   ├── groupService.js
│   ├── expenseService.js
│   └── calculations.js
│
├── firestore.rules
├── package.json
└── README.md
Getting Started
1. Clone the repository
git clone <repository-url>
cd split-buddy
2. Install dependencies
npm install
3. Configure Firebase

Create a Firebase project and enable:

Firebase Authentication with Email/Password
Cloud Firestore

Create .env.local:

NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

Do not commit .env.local.

4. Configure Firestore Rules

Publish the project's firestore.rules through the Firebase Console before using the application.

5. Run locally
npm run dev

Open:

http://localhost:3000
Deployment

SplitBuddy is designed for deployment through Vercel.

The deployment flow is:

Git Push
   ↓
Vercel Build
   ↓
Production Deployment

The same six NEXT_PUBLIC_FIREBASE_* environment variables must be configured in the Vercel project.

Security

SplitBuddy uses Firebase Authentication and Firestore Security Rules.

The application:

Requires authentication
Restricts group data to group members
Uses Firestore rules for authorization
Keeps Firebase configuration in environment variables
Does not process or transfer actual payments

SplitBuddy is an expense calculation and settlement-planning application, not a payment processor.

AI-Assisted Development

AI and IDE tools used during development

Tool	Role
Claude - Code generation, debugging, architecture assistance
ChatGPT -	Problem solving, technical guidance, documentation and presentation support
Cursor - AI-assisted coding and repository-level development
Antigravity	AI-assisted development workflow
GitHub / ECC	Agent-oriented development workflow and reusable engineering skills

ECC reference

We used the ECC (Everything Claude Code) project by Affaan Mustafa as part of our AI-agent development workflow. The repository describes ECC as an agent-harness and performance-optimization system for tools including Claude Code, Codex, OpenCode and Cursor.

Presentation wording:

“This project was built with AI-assisted development. We used Claude, ChatGPT, Cursor, and Antigravity for coding, debugging, planning, and technical problem solving. We also used the GitHub ecosystem and the ECC project to support an agent-oriented development workflow. AI accelerated implementation, but the architecture, scope decisions, integration, testing, and final validation were handled by our team.”

AI tools were used as development assistants throughout the project:

Hackathon

Event: DSO Spirit Hackathon
Problem: #01 — Split-Bill Expense Tracker for Roommates
Category: Web Development
Build Duration: 24 hours
Team Size: 2

The project follows the defined MVP requirements and technical specification for the hackathon.

Current MVP Status
Authentication
Group creation
Group joining
Expense tracking
Equal splitting
Balance calculation
Debt simplification
Settlement calculation
Expense history
Responsive UI
Firebase integration
Vercel deployment
