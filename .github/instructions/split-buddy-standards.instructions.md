---
description: "Use when writing or reviewing code for Split Buddy. Covers Next.js/React patterns, validation, security, accessibility, and response style for hackathon professional-grade delivery."
name: "Split Buddy Code Standards"
applyTo: ["**/*.js", "**/*.jsx"]
---

# Split Buddy Code Standards

> **Canonical references:** [`PRD_and_Tech_Spec.md`](../PRD_and_Tech_Spec.md), [`TECHNICAL_SPEC.md`](../TECHNICAL_SPEC.md), [`AI_BUILD_GUIDELINES.md`](../AI_BUILD_GUIDELINES.md)

This project is a hackathon submission built for professional, production-grade delivery. All code must follow the rules below.

---

## Core Principles

1. **No emojis anywhere** — Not in code, comments, commit messages, UI copy, or documentation.
2. **No scope creep** — Only build what's in PRD.md and TECHNICAL_SPEC.md. Do not add "nice to have" features.
3. **Professional quality** — This must look and function like a polished product, not a demo or tutorial project.
4. **If conflict with spec, say so directly** — Ask before adjusting the request or spec.
5. **Concise, code-focused responses** — No padding, no unnecessary narration. Get straight to the work.

---

## React / Next.js Patterns

### Components

- **Use `'use client'` directive** at the top of interactive components
- **Extract magic numbers and thresholds to named constants** at module level
  ```javascript
  const BALANCE_THRESHOLD = 0.005;
  const MAX_DESCRIPTION_LENGTH = 200;
  ```
- **Use `useMemo` for expensive calculations** and derived state
  ```javascript
  const { balances, settlements } = useMemo(() => {
    // expensive work
    return { balances, settlements };
  }, [expenses, group]);
  ```

### State & Effects

- **Validate state changes before `setState`** — Never allow invalid states
  ```javascript
  if (!parsedAmount || parsedAmount <= 0) {
    setError('Amount must be greater than 0.');
    return;
  }
  ```
- **Always provide complete error handling** — No orphaned `catch` blocks
  ```javascript
  catch (err) {
    setError(err.message || 'Operation failed');
  } finally {
    setSubmitting(false);
  }
  ```
- **Use effect dependencies carefully** — Avoid unnecessary rerenders and redirect loops
  ```javascript
  useEffect(() => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (nextPath !== currentPath) {
      router.push(nextPath);
    }
  }, [nextPath, router]);
  ```

### Styling & UI

- **Responsive first** — Mobile-first Tailwind design; use `sm:`, `md:` breakpoints
- **Semantic HTML** — Use proper `<section>`, `<button>`, `<form>` tags
- **Accessible by default:**
  - Buttons have `aria-label` if text alone is unclear
  - Avatars have `aria-label` for screen readers
  - Interactive elements are keyboard-operable
  - Color alone never conveys critical information

### Naming

- **Descriptive component names:** `BalanceCard`, not `Card1`
- **Descriptive function names:** `formatINR`, not `format`
- **Avoid placeholder names** — No `foo`, `bar`, `test123` in committed code
- **Member/user references:** Use consistent variable names (`userId`, `memberId`, not mixed `id`, `uid`, `user`)

---

## Validation & Security

### Input Validation

**Every form must validate BEFORE submission:**
- Amount > 0 (currency cannot be negative or zero)
- Required fields present and non-empty
- Split count > 0 (at least one person in the split)
- User selections are valid (members still exist in group)

Example:
```javascript
if (splitCount === 0) {
  setError('Select at least one member.');
  return;
}
if (!parsedAmount || parsedAmount <= 0) {
  setError('Amount must be greater than 0.');
  return;
}
```

### Currency Handling (FUTURE FIX)

**Current:** Using floats (imprecise for money math)
**TODO:** Store amounts as integers (paise/cents), divide only for display
```javascript
// Future: convert to paise to avoid float precision issues
const amountInPaise = Math.round(parseFloat(amount) * 100);
const perPersonPaise = Math.floor(amountInPaise / splitCount);
```

### User Input Sanitization

- **Descriptions** entered by users should be validated before storage (prevent XSS if rendered as HTML elsewhere)
- **Never trust user input** — Validate at every system boundary
- **Error messages** in UI should not expose sensitive data or stack traces

### Authentication & Routes

- **Protected routes** must check `user.emailVerified` before allowing access
- **Redirect unverified users** to `/auth/verify-email`, not the login page
- **Logout** must clear all auth state server-side (Firebase Auth handles this, but verify tokens are cleared)

---

## Code Quality Checklist

Before marking a component complete:

- [ ] No console logs or debug code left in
- [ ] No commented-out code or dead imports
- [ ] All magic numbers extracted to named constants
- [ ] Error handling complete (all `catch` blocks filled)
- [ ] Input validation done (form won't accept invalid data)
- [ ] Accessibility checked (buttons have labels, colors aren't the only indicator)
- [ ] No emojis anywhere in code or comments
- [ ] Component size < 400 lines; if larger, split it
- [ ] Naming is clear and descriptive

---

## Testing Expectations

- **Happy path tested** — "Adding an expense" with valid input works end-to-end
- **Error paths tested** — Form validation catches bad input, shows error message
- **Edge cases tested** — Empty group, zero members in split, negative amounts rejected
- **Integration tested** — Firebase calls work; data persists and updates correctly

---

## Response Behavior

When asked to implement a feature, debug, or review code:

1. **Say "no" directly if it conflicts with PRD/TECHNICAL_SPEC** — e.g., "This is out of scope per the spec. Should I update the spec or adjust the request?"
2. **Give one clear recommendation** — Don't list five options unless asked; pick the best one and explain why
3. **Code-focused** — Show implementation first; explain afterward if needed
4. **No hedging language** — Don't say "might" or "could potentially"; state the recommendation plainly
5. **No narration** — Skip "Let me think about..." and go straight to the work
6. **Stay concise** — If it fits in a 1-3 sentence response, don't expand it

---

## File Organization

Follow the structure in `TECHNICAL_SPEC.md` exactly:
- `/app` — Next.js pages and layouts
- `/components` — Reusable React components
- `/lib` — Utilities, hooks, Firebase config, calculations
- `/public` — Static assets (logo, icons)

Do not introduce new top-level folders without updating the spec.

---

## Commit Message Format

Follow Conventional Commits:
```
feat: add expense deletion UI
fix: validate amount > 0 in ExpenseForm
docs: update README with setup instructions
refactor: extract balance calculation to helper
```

---

## When in Doubt

1. Check `PRD_and_Tech_Spec.md` — is this feature in scope?
2. Check `TECHNICAL_SPEC.md` — does this follow the architecture?
3. Check `AI_BUILD_GUIDELINES.md` — does this match the tone and standards?
4. Ask directly — don't assume or improvise.
