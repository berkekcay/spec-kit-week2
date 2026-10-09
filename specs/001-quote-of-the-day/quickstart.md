# Quickstart: Quote of the Day

## Prerequisites

- Node.js 18+ (for tests)
- Any static file server, e.g. Python 3 (`python -m http.server`) or `npx serve`
- A modern browser

## Run the tests

```bash
npm test          # same as: node --test (auto-discovers tests/*.test.js)
```

Expected: all suites pass (quotes, quote-picker, favorites).

## Run the page

```bash
python -m http.server 8000
```

Open http://localhost:8000. (Opening `index.html` directly from disk will not load the ES
modules in Chromium-based browsers.)

## Validation scenarios

Map to the acceptance scenarios in [spec.md](./spec.md):

1. **US1** Load the page → one quote and its author are visible. Reload a few times → the
   quote changes at least once.
2. **US2** Click "New quote" → a quote from the collection is shown. Tab to the button and
   press Enter/Space → same result.
3. **US3** Click ☆ → it becomes ★ and its label is "Remove from favorites". Reload until the
   same quote appears → still ★. Click ★ → back to ☆.
4. **Edge: corrupted data** In DevTools console run
   `localStorage.setItem('qotd.favorites.v1', '{oops')` and reload → page works, no favorites.
5. **Edge: storage blocked** Block site data for localhost (or use a private window where
   storage is disabled) and reload → page works, notice "Favorites won't be saved in this
   browser" appears after toggling.

Module and DOM contracts: [contracts/modules.md](./contracts/modules.md),
[contracts/ui.md](./contracts/ui.md). Data rules: [data-model.md](./data-model.md).
