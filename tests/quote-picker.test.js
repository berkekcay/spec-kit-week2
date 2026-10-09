import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickRandomQuote, pickNextQuote } from '../js/quote-picker.js';

const SAMPLE = [
  { id: 'a', text: 'A', author: 'X' },
  { id: 'b', text: 'B', author: 'Y' },
  { id: 'c', text: 'C', author: 'Z' },
];

test('rng 0 picks the first quote', () => {
  assert.equal(pickRandomQuote(SAMPLE, () => 0).id, 'a');
});

test('rng just below 1 picks the last quote', () => {
  assert.equal(pickRandomQuote(SAMPLE, () => 0.999).id, 'c');
});

test('default rng always returns an element of the input', () => {
  for (let i = 0; i < 100; i += 1) {
    assert.ok(SAMPLE.includes(pickRandomQuote(SAMPLE)));
  }
});

test('empty collection throws', () => {
  assert.throws(() => pickRandomQuote([]), /empty/);
});

test('pickNextQuote skips the current quote', () => {
  assert.equal(pickNextQuote(SAMPLE, 'a', () => 0).id, 'b');
});

test('pickNextQuote never returns the current quote', () => {
  for (let i = 0; i < 200; i += 1) {
    assert.notEqual(pickNextQuote(SAMPLE, 'b').id, 'b');
  }
});

test('pickNextQuote with a single quote returns that quote', () => {
  const only = [SAMPLE[0]];
  assert.equal(pickNextQuote(only, 'a').id, 'a');
});

test('pickNextQuote on an empty collection throws', () => {
  assert.throws(() => pickNextQuote([], 'a'), /empty/);
});
