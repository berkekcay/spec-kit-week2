---

description: "Task list for the Quote of the Day feature"
---

# Tasks: Quote of the Day

**Input**: Design documents from `/specs/001-quote-of-the-day/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included. Constitution Principle II (Test-First, NON-NEGOTIABLE) requires tests for
all non-UI logic, written first and failing before implementation.

**Organization**: Tasks are grouped by user story so each story can be implemented and
tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Single static project at the repository root: `index.html`, `css/`, `js/`, `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create `package.json` at repo root with `"type": "module"`, `"private": true`, and
  script `"test": "node --test"` (no dependencies; Node 20+ does not accept a directory
  argument, the runner auto-discovers `*.test.js`)
- [X] T002 [P] Create `.gitignore` at repo root ignoring `node_modules/` and OS/editor files
- [X] T003 [P] Create `index.html` skeleton with the elements and IDs from
  `contracts/ui.md` (`#quote` with `aria-live="polite"`, `#quote-text`, `#quote-author`,
  `#new-quote`, `#favorite` with `aria-pressed="false"`, `#notice` with `role="status"` and
  `hidden`) and `<script type="module" src="js/app.js">`
- [X] T004 [P] Create `css/styles.css` with centered card layout, light/dark theme via
  `prefers-color-scheme`, and a visible `:focus-visible` outline for buttons

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The quote collection every story depends on

- [X] T005 Write `tests/quotes.test.js`: collection "length ≥ 10", "IDs unique", each `id`,
  `text`, `author` is a "non-empty string after trimming" (data-model.md) — run, confirm it
  fails
- [X] T006 Create `js/quotes.js` exporting frozen `QUOTES` with ≥ 10 quotes (`id` as stable
  kebab-case slug, `text`, `author`) — run `npm test`, confirm T005 passes

**Checkpoint**: Foundation ready — user story work can begin

---

## Phase 3: User Story 1 - See a quote when the page opens (Priority: P1) 🎯 MVP

**Goal**: On load, one random quote and its author are shown.

**Independent Test**: Open the page several times; a quote + author always appears and more
than one distinct quote shows up across visits.

### Tests for User Story 1 ⚠️

- [X] T007 [P] [US1] Write `tests/quote-picker.test.js` per `contracts/modules.md`: with a
  stub RNG returning 0 → first quote; returning 0.999 → last quote; result is always an
  element of the input; empty array throws — run, confirm it fails

### Implementation for User Story 1

- [X] T008 [US1] Implement `pickRandomQuote(quotes, rng = Math.random)` in
  `js/quote-picker.js` — confirm T007 passes
- [X] T009 [US1] Implement `js/app.js` render: on `DOMContentLoaded`, pick a quote from
  `QUOTES`, set `#quote-text` and `#quote-author` ("— Author"), keep it as `currentQuote`

**Checkpoint**: Page shows a random quote on every load (MVP)

---

## Phase 4: User Story 2 - Get a new quote on demand (Priority: P2)

**Goal**: "New quote" button replaces the displayed quote.

**Independent Test**: Click "New quote" (and Tab + Enter/Space) → a quote from the collection
is displayed.

### Implementation for User Story 2

- [X] T010 [US2] In `js/app.js`, handle `click` on `#new-quote`: pick a quote with
  `pickRandomQuote` and re-render (keyboard activation comes from the native `<button>`)

### Refinement: never repeat the displayed quote (spec FR-003 refined 2026-10-09)

- [X] T017 [US2] Add tests for `pickNextQuote(quotes, currentId, rng)` to
  `tests/quote-picker.test.js` per `contracts/modules.md`: with rng 0 and currentId of the
  first quote → returns the second; result never has `currentId` over 200 runs with the
  default rng; single-quote collection returns that quote; empty array throws — run,
  confirm they fail
- [X] T018 [US2] Implement `pickNextQuote` in `js/quote-picker.js` (uniform over quotes with
  `id !== currentId`) — confirm T017 passes
- [X] T019 [US2] In `js/app.js`, make `#new-quote` use `pickNextQuote(QUOTES, currentQuote.id)`

**Checkpoint**: US1 + US2 work independently

---

## Phase 5: User Story 3 - Favorite a quote and keep it after reload (Priority: P3)

**Goal**: Toggle favorite on the displayed quote; state survives reloads; failures degrade
gracefully.

**Independent Test**: Favorite a quote, reload until it reappears → still favorite; works
(session-only + notice) when storage is blocked.

### Tests for User Story 3 ⚠️

- [X] T011 [P] [US3] Write `tests/favorites.test.js` using an in-memory fake `Storage`:
  empty storage → no favorites; `toggle` adds then removes and returns new state; state is
  written to key `qotd.favorites.v1` as a JSON array; a new store over the same storage sees
  saved favorites (reload); invalid JSON / non-array → empty set; unknown IDs and non-strings
  dropped; storage whose `getItem`/`setItem` throws → no exception, `persistent === false`,
  in-memory toggling still works; `storage === null` → `persistent === false` — run, confirm
  it fails

### Implementation for User Story 3

- [X] T012 [US3] Implement `createFavoritesStore(storage, validIds)` and `STORAGE_KEY` in
  `js/favorites.js` per `contracts/modules.md` and data-model.md load/save rules — confirm
  T011 passes
- [X] T013 [US3] In `js/app.js`, obtain `window.localStorage` inside `try/catch` (access itself
  can throw), create the store with the set of `QUOTES` IDs, and render `#favorite` state:
  ☆/★, `aria-pressed`, label "Add to favorites"/"Remove from favorites"
- [X] T014 [US3] In `js/app.js`, handle `click` on `#favorite`: `toggle(currentQuote.id)`,
  re-render the button; if `store.persistent` is false, unhide `#notice` with
  "Favorites won't be saved in this browser."

**Checkpoint**: All three stories work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T015 [P] Write `README.md`: what it is, how to run tests and the page (link quickstart)
- [ ] T016 Run `npm test` and every validation scenario in `quickstart.md`; fix anything that
  fails by updating spec/plan first if the artifact was wrong

---

## Dependencies & Execution Order

- **Setup (T001–T004)** → **Foundational (T005–T006)** → user stories.
- **US1 (T007–T009)** is the MVP. **US2 (T010)** reuses `pickRandomQuote` from US1.
  **US3 (T011–T014)** depends only on Foundational for logic, but its UI hooks into the
  `currentQuote` rendering from US1.
- Within each story: tests → implementation → DOM wiring.
- **Polish (T015–T016)** after all desired stories.

## Parallel Opportunities

- T002, T003, T004 in parallel (different files).
- T007 (picker tests) and T011 (favorites tests) can be written in parallel once T006 exists.

## Implementation Strategy

1. MVP first: Setup → Foundational → US1 → validate with quickstart scenario 1.
2. Add US2 → validate scenario 2.
3. Add US3 → validate scenarios 3–5.
4. Polish, then `/speckit-converge`.

---

## Phase 7: Convergence

- [X] T020 CRITICAL: Split `init()` in `js/app.js` (39 lines) into focused functions of ≤ 30 lines each per Constitution I (contradicts)
- [X] T021 Show the `#notice` on page load when the favorites store is not persistent, not only after a toggle, per FR-007 (partial)
- [X] T022 Use single quotes for the notice string in `js/app.js` (escape the apostrophe) per Constitution I formatting rule (contradicts)
- [X] T023 Write `README.md` (what it is, how to run tests and the page, link to quickstart) per T015 / plan structure (missing)
- [X] T024 Add the one-line responsibility comment at the top of each file in `tests/` per Constitution I (partial)

---

## Phase 8: Convergence

- [ ] T025 CRITICAL: Split `createFavoritesStore` in `js/favorites.js` (40 lines) so every function is ≤ 30 lines, keeping `contracts/modules.md` behavior, per Constitution I (contradicts)
