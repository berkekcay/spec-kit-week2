# Module Contracts

Public functions exported by each JavaScript module. Only `js/app.js` may touch the DOM or
the real `localStorage`.

## `js/quotes.js`

```js
export const QUOTES; // ReadonlyArray<{ id: string, text: string, author: string }>
```

## `js/quote-picker.js`

```js
/**
 * Returns one quote chosen uniformly at random.
 * @param {Array<Quote>} quotes  non-empty array
 * @param {() => number} [rng=Math.random]  returns a number in [0, 1)
 * @returns {Quote}
 * @throws {Error} if quotes is empty
 */
export function pickRandomQuote(quotes, rng = Math.random);

/**
 * Returns a random quote whose id differs from currentId (FR-003, refined).
 * Uniform over the remaining quotes. If no other quote exists, returns the only quote.
 * @param {Array<Quote>} quotes  non-empty array
 * @param {string} currentId     id of the quote on screen
 * @param {() => number} [rng=Math.random]
 * @returns {Quote}
 * @throws {Error} if quotes is empty
 */
export function pickNextQuote(quotes, currentId, rng = Math.random);
```

`pickRandomQuote` is used on page load; `pickNextQuote` is used by the "New quote" button.

## `js/favorites.js`

```js
export const STORAGE_KEY = 'qotd.favorites.v1';

/**
 * @param {Storage | null} storage  e.g. window.localStorage; may be null or throw on access
 * @param {Set<string>} validIds    IDs present in the current collection
 * @returns {{
 *   isFavorite(id: string): boolean,
 *   toggle(id: string): boolean,   // returns the new favorite state
 *   ids(): string[],               // current favorite IDs
 *   persistent: boolean            // false once storage failed; never flips back to true
 * }}
 */
export function createFavoritesStore(storage, validIds);
```

Behavior guarantees:

- Never throws because of storage problems (Constitution V).
- `toggle` updates memory first, then tries to persist.
