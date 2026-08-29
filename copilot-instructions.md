---
name: "Split Buddy Hackathon Instructions"
description: "Agent instructions for Split Buddy expense-sharing app. Enforces professional hackathon delivery standards: no emojis, no scope creep, concise code-focused responses, alignment with PRD/TECHNICAL_SPEC/AI_BUILD_GUIDELINES."
---

# Split Buddy Agent Instructions

This is a **24-hour hackathon project** building a professional-grade expense-sharing app for roommates. All responses and code must reflect production-quality standards, not demos or tutorials.

## Reference Documents

These are canonical and non-negotiable:
- **PRD_and_Tech_Spec.md** — Feature scope, user stories, technical architecture
- **TECHNICAL_SPEC.md** — Tech stack (Next.js, React, Tailwind, Firebase), performance budgets, accessibility requirements
- **AI_BUILD_GUIDELINES.md** — Communication rules, code standards, security checklist

**Read these at the start of any new session.**

---

## Hard Rules (Non-Negotiable)

1. **No emojis, anywhere** — Not in code, comments, commit messages, UI, responses, or documentation
2. **No scope creep** — Only build what's explicitly in PRD.md. Do not suggest "nice to have" features or additional libraries
3. **Follow the tech stack exactly** — Next.js, React, Tailwind, Firebase Auth, GSAP (if needed). No alternatives without explicit approval
4. **No placeholder content** — No lorem ipsum, no "TODO: add real copy". Write realistic draft copy and flag it with `<!-- DRAFT -->` comments
5. **Production quality** — This is a hackathon submission judged on polish, not cleverness. Code must look professional, not experimental

---

## Response Behavior

### Say No Clearly

If a request conflicts with PRD or TECHNICAL_SPEC:
```
This is out of scope per PRD.md (Feature Scope section, P1/P2 cut list).
Should I update the spec to include it, or adjust the request?
```

Do NOT quietly do one or the other.

### Be Code-Focused

- Implement first; explain after if needed
- Skip generic encouragement ("Great question!", "Let's dive in!")
- No narration ("Let me think about this..."). Get straight to the work
- No hedging ("might", "could potentially"). State recommendations plainly with reasoning

### Keep It Concise

- 1–3 sentence answers when possible
- For code: show working code first, no lengthy preamble
- For reviews: flag issues by severity (🔴 CRITICAL, 🟡 HIGH); skip trivial suggestions
- No unnecessary summaries or "to recap"

### Present One Clear Option

If multiple approaches exist:
```
Use [Option A] because [reasoning].

Alternative: [Option B] trades [trade-off] for [benefit].
```

Do NOT present five options and ask "which do you prefer?" unless explicitly asked to compare.

---

## Scope Guardrails

### In Scope (P0 — MVP)
- Email/password auth (Firebase)
- Create/join groups
- Add expenses (equal split only)
- Live balance dashboard
- Debt-simplification algorithm
- Expense history

### Out of Scope (Cut if behind)
- Unequal splits (US-9)
- Mark settlement as paid (US-10)
- Notifications, email receipts
- Mobile app
- Advanced charts/analytics
- Undo/redo history

**If asked to build something not in P0, ask: "Should I update the spec to prioritize this, or keep it for post-hackathon?"**

---

## Code Standards (See `.github/instructions/split-buddy-standards.instructions.md` for full details)

Quick checklist:
- ✅ No magic numbers — extract to named constants
- ✅ Input validation before form submission
- ✅ Complete error handling (no orphaned `catch` blocks)
- ✅ Accessibility by default (aria-labels, keyboard navigation)
- ✅ No commented-out code or dead imports
- ✅ Clear, descriptive naming (`BalanceCard`, not `Card1`)
- ✅ Responsive design (mobile-first Tailwind)

---

## Common Patterns

### Validation
```javascript
if (!parsedAmount || parsedAmount <= 0) {
  setError('Amount must be greater than 0.');
  return;
}
```

### Constants
```javascript
const BALANCE_THRESHOLD = 0.005;
const MAX_MEMBERS = 20;
```

### Error Handling
```javascript
try {
  await addExpense(data);
} catch (err) {
  setError(err.message || 'Failed to add expense');
} finally {
  setSubmitting(false);
}
```

### Memoization
```javascript
const { balances, settlements } = useMemo(() => {
  return calculateBalances(expenses, members);
}, [expenses, members]);
```

---

## Debugging & Fixes

When fixing a bug or error:
1. Ask to see the error or reproduction steps
2. Identify the root cause (not a symptom)
3. Fix the root cause, not a workaround
4. Test the fix covers edge cases (e.g., empty splits, zero amounts)

---

## Security Checklist

Before any commit:
- ❌ No hardcoded API keys, secrets, or Firebase credentials
- ❌ No sensitive data in error messages
- ✅ All user inputs validated
- ✅ Firebase Auth permissions correct (Firestore rules, auth state)
- ✅ No SQL injection / XSS vulnerabilities (though Next.js/Firebase mitigates most)

---

## When in Doubt

1. **Check PRD.md** — Is this feature in scope?
2. **Check TECHNICAL_SPEC.md** — Does this follow the architecture?
3. **Check AI_BUILD_GUIDELINES.md** — Does this match tone and code standards?
4. **Ask directly** — "Does this count as scope creep?" or "Should I update the spec?"

---

## Example Prompts to Test These Instructions

```
/code-review          → Review Split Buddy components for violations
/build-fix            → Fix a validation or Firebase error
feat: add group creation UI
```

After a fix: The agent should not narrate the process but show the fixed code directly, flag violations concisely, and link to reference docs.
