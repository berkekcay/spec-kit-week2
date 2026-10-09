# Quote of the Day Constitution

## Core Principles

### I. Code Quality: Small, Readable Units

- Every JavaScript module MUST have one clear responsibility, described in a one-line comment
  at the top of the file.
- Functions MUST be short enough to read without scrolling (target ≤ 30 lines) and MUST use
  descriptive names; no single-letter names outside loop indices.
- No dead code, commented-out code, or `console.log` debugging statements in committed code.
- Formatting MUST be consistent across files (2-space indent, semicolons, single quotes).

Rationale: a small static app should be understandable in one sitting by a new contributor
or a coding agent.

### II. Test-First for Logic (NON-NEGOTIABLE)

- All non-UI logic (quote selection, favorites persistence, data validation) MUST have
  automated tests written before or alongside the implementation, and the tests MUST fail
  before the implementation makes them pass.
- Tests MUST run with zero installs using Node's built-in runner (`node --test`).
- A change MUST NOT be merged while any test fails.
- Every bug fix MUST add a test that reproduces the bug.

Rationale: tests are the only objective signal that the implementation matches the spec,
which is what lets an agent iterate until the work converges.

### III. Logic Separated from the DOM

- Business logic MUST live in pure ES modules that do not touch `document`, `window`, or
  `localStorage` directly; storage MUST be passed in (dependency injection) so tests can use
  an in-memory fake.
- DOM code MUST be a thin layer that wires events to logic and renders results.

Rationale: separating logic from the page makes it testable without a browser and keeps
UI changes from breaking behavior.

### IV. Simplicity and Zero Dependencies

- The app MUST run by opening `index.html` through any static file server, with no build
  step, bundler, framework, or third-party runtime dependency.
- New files, abstractions, or tooling MUST be justified by a concrete requirement in the spec
  (YAGNI).

Rationale: the fewer moving parts, the easier the app is to maintain and to review.

### V. Resilience and Accessibility

- The app MUST stay usable when `localStorage` is unavailable, full, or contains corrupted
  data: it falls back to in-memory state and never throws to the user.
- Interactive elements MUST be real `<button>` elements with accessible names and visible
  focus styles; state changes (e.g. favorited) MUST be exposed via ARIA attributes.

Rationale: browser storage is unreliable (private mode, quotas), and accessibility is part
of quality, not an add-on.

## Technical Constraints

- Languages: HTML5, CSS3, JavaScript (ES2020+ modules). No TypeScript, no transpilation.
- Persistence: browser `localStorage` only; no backend, no network calls.
- Supported browsers: current versions of Chrome, Edge, Firefox, and Safari.
- Testing: Node.js 18+ built-in test runner (`node --test`), no test dependencies.

## Development Workflow and Quality Gates

- Work follows the Spec Kit loop: constitution → specify → plan → tasks → implement →
  converge. A human reviews each artifact before moving to the next stage.
- When an artifact is vague or wrong, the spec or plan is corrected first; code is then
  regenerated from the corrected artifact rather than patched by hand.
- Before every commit: `node --test` passes, and the page has been opened and checked
  manually against the acceptance scenarios in the spec.
- Commit messages MUST be in imperative mood and describe why, not only what.

## Governance

- This constitution overrides other practices in this repository. Plans MUST include a
  Constitution Check, and any violation MUST be recorded with a justification in the plan's
  Complexity Tracking table.
- Amendments are made by editing this file in a dedicated commit, with a short rationale in
  the commit message.
- Versioning follows semantic versioning: MAJOR for removing or redefining a principle, MINOR
  for adding a principle or section, PATCH for wording clarifications.
- Every review checks the change against Principles I–V.

**Version**: 1.0.0 | **Ratified**: 2026-10-09 | **Last Amended**: 2026-10-09
