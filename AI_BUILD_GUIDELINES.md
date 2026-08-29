# AI Build Guidelines

## For any AI assistant (Claude Code, Copilot, Cursor, ChatGPT, etc.) contributing to this project

**Companion to:** `PRD.md`, `TECHNICAL\\\\\\\\\\\\\\\_SPEC.md`

This file defines the operating rules for AI assistance on this project. It should be placed at the repository root (or referenced at the start of every AI session) so the assistant's output stays consistent, professional, and aligned with the PRD and Technical Spec.

\---

## 1\. Purpose

This project is a professional  website built for a hackathon submission. The output must look and function like a polished, production-grade product — not a demo, tutorial project, or AI-generated placeholder site. Every response and every file the AI produces should reflect that standard.

\---

## 2\. Non-Negotiable Rules

1. **No emojis, anywhere.** Not in code, code comments, commit messages, UI copy, documentation, or chat responses. This includes emoji-style Unicode symbols used decoratively.
2. **No lorem ipsum or placeholder copy in final deliverables.** If real content isn't available yet, write realistic draft copy relevant to the actual project and flag it clearly as a draft (e.g., `<!-- DRAFT COPY: replace with final -->`), rather than generic filler.
3. **Stay strictly on scope.** Only build what is defined in `PRD.md` and `TECHNICAL\\\\\\\\\\\\\\\_SPEC.md`. Do not add features, pages, libraries, or "nice to have" flourishes that were not requested or scoped, even if they seem impressive.
4. **Do not change the agreed tech stack** (Next.js, React Three Fiber, Tailwind, GSAP — see `TECHNICAL\\\\\\\\\\\\\\\_SPEC.md`) without being explicitly asked. Do not introduce a competing library for something already covered by the stack.
5. **No unexplained "magic."** Any non-obvious technique (shader math, camera easing curves, performance workaround) must include a short code comment explaining why it's there.
6. **Never fabricate content, credentials, or capabilities.** If a project detail, statistic, or bio fact is unknown, ask rather than inventing one.
7. **Do not silently drop accessibility or performance requirements** from the spec to make a feature easier to build. If a trade-off is necessary, state it explicitly and ask before proceeding.

\---

## 3\. Communication Rules (Chat/Response Behavior)

* Keep responses focused on the task asked. Do not pad answers with generic encouragement, unnecessary summaries, or restating the request back at length.
* When multiple implementation options exist (e.g., continuous scene vs. per-section scenes), present the trade-off briefly and recommend one — don't default to listing every possible option exhaustively unless asked.
* If a request conflicts with the PRD or Technical Spec, say so directly and ask whether to update the spec or adjust the request, rather than quietly doing one or the other.
* Avoid hedging language ("might," "could potentially," "just a suggestion") when giving a technical recommendation. State the recommendation plainly, with reasoning.
* Do not narrate internal process ("Let me think about the best approach...") — go straight to the work or the question.

\---

## 4\. Code Standards

* **Language/typing:**
* **Comments:** Explain *why*, not *what*, for non-obvious logic. Skip comments that just restate the code.
* **File organization:** Follow the folder structure defined in `TECHNICAL\\\\\\\\\\\\\\\_SPEC.md` exactly. Do not introduce new top-level folders without updating the spec.
* **Naming:** Use clear, descriptive names for components, functions, and variables (`HeroCameraRig`, not `Thing1`). No placeholder names (`foo`, `test123`) in committed code.
* **No dead code:** Remove commented-out experiments and unused imports before considering a task complete.
* **Performance-aware by default:** Any new 3D asset, effect, or animation must be checked against the performance budget in `TECHNICAL\\\\\\\\\\\\\\\_SPEC.md` (Section 6) before being finalized.
* **Accessibility by default:** Any new interactive element must be keyboard-operable and have a non-canvas equivalent where required by `TECHNICAL\\\\\\\\\\\\\\\_SPEC.md` (Section 8).

\---

## 5\. Content and Copy Rules

* Tone: confident, concise, professional — matching Section 7 of `PRD.md`.
* No exaggerated marketing adjectives ("amazing," "revolutionary," "world-class") unless backed by a specific, stated fact.
* Keep section copy tight: prefer fewer, stronger sentences over long paragraphs.
* Do not invent testimonials, client names, or metrics. Use real information provided by the user, or clearly marked draft placeholders.

\---

## 6\. Design Rules

* Follow the visual direction established for the project (to be defined by the user/builder) rather than defaulting to generic "AI-generated" aesthetics: avoid default purple-to-blue gradients, generic glassmorphism, and stock 3D primitives (plain spheres/torus knots) unless they are a deliberate, justified design choice.
* Maintain one consistent color system, type scale, and spacing system across all sections — do not vary styling approach section to section.
* Any 3D object introduced should serve the brand concept defined in the PRD, not be added purely because it's visually interesting in isolation.

\---

## 7\. Process Rules

* Before starting a new feature, check it against `PRD.md` Section 4 (Scope). If it's not listed, flag it instead of building it.
* When a task is ambiguous, make the smallest reasonable assumption needed to proceed, state the assumption, and continue — do not stall on non-critical ambiguity, but do not silently guess on decisions with major cost (e.g., changing the tech stack, removing a required section).
* Prefer incremental, testable changes over large rewrites. Flag when a change is likely to affect performance budget or accessibility compliance.
* Any deviation from `TECHNICAL\\\\\\\\\\\\\\\_SPEC.md` must be called out explicitly in the response, with a one-line reason.

\---

## 8\. Explicit Do / Don't Summary

**Do:**

* Stay within the scope defined in `PRD.md`
* Match the tech stack in `TECHNICAL\\\\\\\\\\\\\\\_SPEC.md`
* Write real, specific copy or clearly flagged drafts
* Comment non-obvious code
* Flag trade-offs and conflicts directly
* Keep responses concise and on-task

**Don't:**

* Use emojis in any output
* Add unscoped features or libraries
* Use lorem ipsum or generic filler copy
* Fabricate facts, stats, or credentials
* Default to generic "AI template" visual styling
* Pad responses with filler commentary or excessive hedging
* Silently drop performance or accessibility requirements

\---

## 9\. Session Checklist (for the AI to self-verify before finalizing any output)

* \[ ] Does this match something explicitly in `PRD.md` or `TECHNICAL\\\\\\\\\\\\\\\_SPEC.md`?
* \[ ] Is the tech stack consistent with what's already defined?
* \[ ] Is there any emoji, filler copy, or fabricated content in this output?
* \[ ] Is all new interactive functionality keyboard-accessible?
* \[ ] Would this addition meaningfully affect the performance budget? If yes, was that flagged?
* \[ ] Is the tone and code style consistent with the rest of the project?

