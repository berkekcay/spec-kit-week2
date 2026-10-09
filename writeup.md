# Week 2 writeup: spec-driven development with Spec Kit

I used Claude Code (Claude Opus 5.5) in the desktop app as my coding agent. I installed Spec Kit
1.1.2 with `uv tool install specify-cli` and set up the project with
`specify init spec-kit-week2 --integration claude --script ps`, since I'm on Windows. Spec Kit put
the `/speckit-*` skills in `.claude/skills/`, and the agent ran each one by following its
`SKILL.md`, including the PowerShell scripts and templates. I read every artifact before going
to the next stage. Each stage is its own commit, so `git log` shows the whole loop.

## Prompts

| Stage | Prompt |
|-------|--------|
| `/speckit-constitution` | Create principles focused on code quality, testing, and maintainability. |
| `/speckit-specify` | A quote-of-the-day page: one random quote from a built-in list, a "New quote" button, and favoriting that persists across reloads. |
| `/speckit-plan` | Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage. |
| `/speckit-tasks` | (no arguments) |
| `/speckit-implement` | (no arguments) |
| `/speckit-converge` | (no arguments), ran it 3 times |

The artifacts are the [constitution](.specify/memory/constitution.md), the
[spec](specs/001-quote-of-the-day/spec.md), the [plan](specs/001-quote-of-the-day/plan.md) with
its [research](specs/001-quote-of-the-day/research.md),
[data model](specs/001-quote-of-the-day/data-model.md),
[contracts](specs/001-quote-of-the-day/contracts/) and
[quickstart](specs/001-quote-of-the-day/quickstart.md), and the
[tasks](specs/001-quote-of-the-day/tasks.md).

## Before and after: fixing the spec instead of the code

The first spec had FR-003 as "a 'New quote' button that, when activated, displays a randomly
chosen quote from the collection." The agent implemented exactly that with `pickRandomQuote`.
When I tested v1 in the browser, I clicked "New quote" 60 times and once it picked the quote
that was already on screen. Nothing changed on the page, so the button looked broken. The code
did what the spec said. User Story 2 talks about the visitor wanting "a different one", but the
requirement itself never said so.

I fixed it in the spec (commit `4dec7f3`). FR-003 now says the quote is chosen at random
"excluding the currently displayed quote, so pressing the button always visibly changes the
quote." US2 got a new acceptance scenario saying no two consecutive quotes can be the same, and
I added edge cases for that and for a collection with only one quote. The change then went into
the module contract as `pickNextQuote(quotes, currentId, rng)`, into new tasks T017 to T019
(tests first), and into the quickstart, which now says to click 50+ times.

Implement then worked from the updated artifacts (commit `4ff7559`). Before the fix the button
repeated a quote once in 60 clicks. After it, I got 0 repeats in 500 clicks.

There was a smaller plan fix too. The plan said `node --test tests/`, but Node 20 and later
don't accept a folder there. I corrected plan.md, tasks.md and quickstart.md first and only
then changed `package.json`.

## Convergence

| Round | Result |
|-------|--------|
| 1 | Added Phase 7 with 5 tasks (T020 to T024). The serious one was `init()` in `app.js` at 39 lines, which breaks my own constitution rule of 30 lines max. The others: the "favorites won't be saved" notice only showed up after a toggle and not on load (FR-007), one string used double quotes, the README (T015) was missing, and the test files had no header comment. |
| 2 | Added Phase 8 with one task (T025). `createFavoritesStore` was 40 lines, and round 1 had missed it. |
| 3 | Converged. All 8 FRs, the US1 to US3 acceptance scenarios and the 5 principles were satisfied, so tasks.md stayed unchanged. |

At the end all 25 tasks are done and `npm test` passes 21 of 21. In the browser I checked that a
quote and author show up on load, that 500 "New quote" clicks never repeat, that the star
toggles with `aria-pressed` and a label that changes, that a favorite is still there after a
reload, and that broken saved data (`{oops`) is ignored without errors in the console. Blocked
storage is only covered by unit tests with a throwing or `null` storage. I didn't try it in a
real private-mode browser.

## What I learned

For a page with 12 quotes, writing a constitution, spec, plan, research notes, data model,
contracts and 25 tasks felt like a lot of overhead, and there was more text than code. It paid
off when "New quote" repeated: the spec showed me the bug was in the requirement, so I changed
one sentence, regenerated, and got a better result than if I had patched the button by hand.
Converge was the step I'd keep. It checked the code against rules I wrote myself, like the
30-line limit and the FR-007 notice, and found things I would have shipped. One round wasn't
enough, though, because round 2 caught a function that round 1 skipped.
