# Research: Quote of the Day

No `NEEDS CLARIFICATION` items remained in the Technical Context; the decisions below record
the technology choices and their best practices.

## 1. Module format without a build step

- **Decision**: Native ES modules (`<script type="module">`), served over HTTP.
- **Rationale**: Lets the same files be imported by the browser and by `node --test`, with no
  bundler (Constitution IV). Chromium blocks module scripts from `file://`, so the quickstart
  uses a one-line static server.
- **Alternatives considered**: A single classic `<script>` with globals (can't be imported by
  Node tests without hacks); a bundler such as Vite (violates zero-build principle).

## 2. Unit testing with zero installs

- **Decision**: Node's built-in `node:test` + `node:assert/strict`; `package.json` sets
  `"type": "module"` so `.js` files load as ESM.
- **Rationale**: Ships with Node 18+, no `npm install`, satisfies Constitution II and IV.
- **Alternatives considered**: Jest/Vitest (extra dependencies), browser-only testing (slower,
  not scriptable in CI).

## 3. Persisting favorites in localStorage

- **Decision**: One key, `qotd.favorites.v1`, storing a JSON array of quote IDs. Every
  read/write is wrapped in `try/catch`; any failure switches the store to in-memory mode and
  reports `persistent: false` so the UI can show a notice.
- **Rationale**: `localStorage` can throw on access (Safari private mode, blocked site data),
  on `setItem` (quota), or contain data written by an older version. Versioned key allows
  future format changes. Storing IDs (not text) keeps favorites valid if quote wording is
  corrected.
- **Alternatives considered**: Cookies (sent to servers, size limits), IndexedDB (async API,
  overkill for a small set), storing full quote objects (duplicates data, breaks on edits).

## 4. Randomness and testability

- **Decision**: `pickRandomQuote(quotes, rng = Math.random)` takes the RNG as a parameter.
- **Rationale**: Tests pass a deterministic RNG to assert exact picks (Constitution III).
- **Alternatives considered**: Mocking `Math.random` globally (fragile, leaks between tests).

## 5. Accessibility of the toggle and quote updates

- **Decision**: Favorite control is a `<button>` with `aria-pressed="true|false"` and a label
  that changes ("Add to favorites" / "Remove from favorites"); the quote container is an
  `aria-live="polite"` region.
- **Rationale**: Native buttons give keyboard support (FR-008); `aria-pressed` exposes favorite
  state to assistive technology (FR-005); live region announces new quotes.
- **Alternatives considered**: Clickable `<span>`/icon (not keyboard-accessible), checkbox
  (semantically "form value", less natural for a toggle action).
