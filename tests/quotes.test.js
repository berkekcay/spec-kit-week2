// Tests for the built-in quote collection: size, unique IDs, required fields (FR-001).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUOTES } from '../js/quotes.js';

test('collection has at least 10 quotes', () => {
  assert.ok(QUOTES.length >= 10, `expected >= 10 quotes, got ${QUOTES.length}`);
});

test('quote IDs are unique', () => {
  const ids = QUOTES.map((quote) => quote.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every quote has non-empty id, text and author', () => {
  for (const quote of QUOTES) {
    for (const field of ['id', 'text', 'author']) {
      assert.equal(typeof quote[field], 'string', `${field} of ${quote.id} is not a string`);
      assert.ok(quote[field].trim().length > 0, `${field} of ${quote.id} is empty`);
    }
  }
});
