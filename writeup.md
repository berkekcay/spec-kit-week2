# Week 2 Writeup — Spec-Driven Development with Spec Kit

**Agent**: Claude Code (Claude Opus 5.5), desktop app. **Spec Kit**: specify-cli 1.1.2, installed
with `uv tool install specify-cli`, initialized with
`specify init spec-kit-week2 --integration claude --script ps` (Windows / PowerShell scripts).
The `/speckit-*` skills were installed to `.claude/skills/` and the agent ran each one by
following its `SKILL.md` (scripts, templates, and gates included). I reviewed each artifact
before moving to the next stage, and every stage is a separate commit (`git log`).

## Prompts given to each skill

| Stage | Prompt |
|-------|--------|
| `/speckit-constitution` | Create principles focused on code quality, testing, and maintainability. |
| `/speckit-specify` | A quote-of-the-day page: one random quote from a built-in list, a "New quote" button, and favoriting that persists across reloads. |
| `/speckit-plan` | Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage. |
| `/speckit-tasks` | *(no arguments)* |
| `/speckit-implement` | *(no arguments)* |
| `/speckit-converge` | *(no arguments)*, run 3 times |

Artifacts: [constitution](.specify/memory/constitution.md) ·
[spec](specs/001-quote-of-the-day/spec.md) · [plan](specs/001-quote-of-the-day/plan.md) ·
[research](specs/001-quote-of-the-day/research.md) ·
[data model](specs/001-quote-of-the-day/data-model.md) ·
[contracts](specs/001-quote-of-the-day/contracts/) ·
[quickstart](specs/001-quote-of-the-day/quickstart.md) ·
[tasks](specs/001-quote-of-the-day/tasks.md)

## Before / after: refining the spec changed the output

**What was vague.** The first spec said FR-003: *"a 'New quote' button that displays a
randomly chosen quote from the collection."* That's exactly what was implemented
(`pickRandomQuote`). While reviewing v1 in the browser I clicked "New quote" 60 times and
**once the same quote came back**, so the button looked broken. The code matched the spec,
but the spec itself was wrong: User Story 2 says the visitor wants "a different one", yet the
requirement never said so.

**What I changed (spec, not code).** Commit `4dec7f3`:

- FR-003 → *"…a quote chosen at random from the collection **excluding the currently
  displayed quote**, so pressing the button always visibly changes the quote."*
- US2 got a new acceptance scenario: *"no two consecutive quotes are the same."*
- New edge cases for the repeat case and for a 1-quote collection.
- The module contract gained `pickNextQuote(quotes, currentId, rng)`. The tasks gained
  T017–T019 (tests first), and the quickstart now says to click 50+ times.

**Result.** Implement then regenerated from the updated artifacts (commit `4ff7559`). With
the new tests and the button wired to `pickNextQuote`, the browser check went from **1 repeat
in 60 clicks → 0 repeats in 500 clicks**.

A smaller plan fix also happened during implement: the plan said `node --test tests/`, which
fails on Node 20+ (a directory argument isn't accepted). I fixed it in
plan/tasks/quickstart first, then in `package.json`.

## Convergence outcome

| Round | Result |
|-------|--------|
| 1 | 5 findings appended as **Phase 7** (T020–T024). One CRITICAL: `init()` in `app.js` was 39 lines, which breaks Constitution I (≤ 30). Also FR-007 partial (the "not saved" notice only appeared after a toggle, not on load), a double-quoted string, the missing README (T015), and missing test-file headers. |
| 2 | 1 finding appended as **Phase 8** (T025): `createFavoritesStore` was 40 lines (CRITICAL, Constitution I). Round 1 had missed it. |
| 3 | **✅ Converged.** All 8 FRs, US1–US3 acceptance scenarios, and 5 constitution principles satisfied; `tasks.md` left unchanged. |

Final state: 25/25 tasks done, `npm test` → 21/21 passing. Browser checks: quote and author
on load; no repeats in 500 "New quote" clicks; ☆/★ with `aria-pressed` and a changing label;
favorite still shown after reload; corrupted saved data (`{oops`) ignored without errors; no
console errors. The "storage blocked" case is covered by unit tests (throwing / `null`
storage). I did not test it in a real private-mode browser.

## What I learned

SDD felt like overhead at the start. Writing a constitution, a spec, a plan, research, a data
model, contracts and 25 tasks for a 12-quote page is more text than code. It paid off at
review time: when "New quote" repeated, the spec told me the bug was in the *requirement*,
not the code, so fixing one sentence and regenerating gave a better result than patching the
button by hand. Convergence was the most useful step. It checked the code against rules I had
written myself (≤ 30-line functions, FR-007's notice) and found real gaps I would have
shipped, though it also showed that one pass isn't enough (round 2 caught what round 1
missed).
