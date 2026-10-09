// Tests for the favorites store: toggle, persistence, corrupted data, storage failures (FR-004..FR-007).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createFavoritesStore, STORAGE_KEY } from '../js/favorites.js';

const VALID_IDS = new Set(['a', 'b', 'c']);

function createMemoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

function createThrowingStorage() {
  return {
    getItem: () => { throw new Error('SecurityError'); },
    setItem: () => { throw new Error('QuotaExceededError'); },
    removeItem: () => { throw new Error('SecurityError'); },
  };
}

test('empty storage has no favorites', () => {
  const store = createFavoritesStore(createMemoryStorage(), VALID_IDS);
  assert.deepEqual(store.ids(), []);
  assert.equal(store.isFavorite('a'), false);
  assert.equal(store.persistent, true);
});

test('toggle adds then removes and returns the new state', () => {
  const store = createFavoritesStore(createMemoryStorage(), VALID_IDS);
  assert.equal(store.toggle('a'), true);
  assert.equal(store.isFavorite('a'), true);
  assert.equal(store.toggle('a'), false);
  assert.equal(store.isFavorite('a'), false);
});

test('favorites are saved as a JSON array under the versioned key', () => {
  const storage = createMemoryStorage();
  const store = createFavoritesStore(storage, VALID_IDS);
  store.toggle('b');
  assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)), ['b']);
});

test('a new store over the same storage sees saved favorites (reload)', () => {
  const storage = createMemoryStorage();
  createFavoritesStore(storage, VALID_IDS).toggle('c');
  const reloaded = createFavoritesStore(storage, VALID_IDS);
  assert.equal(reloaded.isFavorite('c'), true);
});

test('invalid JSON is treated as no favorites', () => {
  const storage = createMemoryStorage({ [STORAGE_KEY]: '{oops' });
  assert.deepEqual(createFavoritesStore(storage, VALID_IDS).ids(), []);
});

test('a non-array value is treated as no favorites', () => {
  const storage = createMemoryStorage({ [STORAGE_KEY]: '{"a":true}' });
  assert.deepEqual(createFavoritesStore(storage, VALID_IDS).ids(), []);
});

test('unknown IDs and non-string entries are dropped', () => {
  const storage = createMemoryStorage({ [STORAGE_KEY]: '["a", "removed-quote", 42, null]' });
  assert.deepEqual(createFavoritesStore(storage, VALID_IDS).ids(), ['a']);
});

test('throwing storage never throws and falls back to memory', () => {
  const store = createFavoritesStore(createThrowingStorage(), VALID_IDS);
  assert.equal(store.persistent, false);
  assert.equal(store.toggle('a'), true);
  assert.equal(store.isFavorite('a'), true);
});

test('a failed write switches the store to non-persistent', () => {
  const storage = createMemoryStorage();
  storage.setItem = () => { throw new Error('QuotaExceededError'); };
  const store = createFavoritesStore(storage, VALID_IDS);
  assert.equal(store.persistent, true);
  assert.equal(store.toggle('a'), true);
  assert.equal(store.persistent, false);
  assert.equal(store.isFavorite('a'), true);
});

test('null storage works in memory only', () => {
  const store = createFavoritesStore(null, VALID_IDS);
  assert.equal(store.persistent, false);
  assert.equal(store.toggle('b'), true);
});
