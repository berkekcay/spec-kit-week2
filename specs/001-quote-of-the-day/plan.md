# Implementation Plan: Quote of the Day

**Branch**: `001-quote-of-the-day` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-quote-of-the-day/spec.md`

## Summary

A single static page shows one random quote from a built-in collection, a "New quote" button,
and a favorite toggle whose state is saved in the browser. Technical approach (from the user's
plan input): plain HTML/CSS/JavaScript with no backend; favorites persisted in `localStorage`.
Logic lives in small pure ES modules (quote selection, favorites store) that are unit-tested
with Node's built-in test runner; a thin DOM module wires them to the page.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2020 modules (no transpilation)

**Primary Dependencies**: None (no frameworks, no runtime or test dependencies)

**Storage**: Browser `localStorage`, one key holding a JSON array of favorite quote IDs

**Testing**: Node.js 18+ built-in runner (`node --test`) for pure modules; manual browser check
against the spec's acceptance scenarios (see [quickstart.md](./quickstart.md))

**Target Platform**: Current Chrome, Edge, Firefox, Safari (desktop and mobile)

**Project Type**: Static single-page web app

**Performance Goals**: Quote visible < 1 s after load (SC-001); no network requests after the
initial page load

**Constraints**: No build step; must be served over HTTP (ES modules don't load from
`file://` in Chromium); must keep working when `localStorage` throws or holds invalid data

**Scale/Scope**: 1 page, ~15 quotes, 4 JS modules, ~300 LOC

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | How this plan complies | Status |
|-----------|------------------------|--------|
| I. Small, readable units | 4 modules with one responsibility each (data, picker, favorites, DOM) | ✅ |
| II. Test-first for logic | Picker, favorites store and data validation have `node --test` suites written before implementation | ✅ |
| III. Logic separated from DOM | `favorites.js` receives a storage object (DI); `quote-picker.js` receives an RNG; only `app.js` touches `document` | ✅ |
| IV. Simplicity, zero dependencies | No build, no packages; `package.json` only declares `"type": "module"` and the test script | ✅ |
| V. Resilience & accessibility | Storage failures fall back to in-memory set + notice; real `<button>`s with `aria-pressed` and an `aria-live` quote region | ✅ |

**Post-design re-check (after Phase 1)**: still ✅ for all five; no violations to track.

## Project Structure

### Documentation (this feature)

```text
specs/001-quote-of-the-day/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── modules.md       # Public functions of each JS module
│   └── ui.md            # DOM/ARIA contract of the page
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
index.html               # Page markup; loads js/app.js as a module
css/
└── styles.css           # Layout, light/dark theme, focus styles
js/
├── quotes.js            # Built-in quote collection (data only)
├── quote-picker.js      # pickRandomQuote(): pure selection logic
├── favorites.js         # createFavoritesStore(storage): load/toggle/persist favorites
└── app.js               # DOM wiring: render quote, handle buttons, show notices
tests/
├── quotes.test.js       # Collection is valid (≥10, unique IDs, non-empty fields)
├── quote-picker.test.js
└── favorites.test.js
package.json             # {"type":"module"} + "test": "node --test tests/"
```

**Structure Decision**: Single static project at the repository root (no frontend/backend
split, since there is no backend). Pure logic in `js/*.js` modules, DOM in `js/app.js` only,
tests in `tests/`.

## Complexity Tracking

No constitution violations; nothing to justify.
