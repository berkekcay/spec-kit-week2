// Pure quote selection logic; the RNG is injected so tests can be deterministic.

export function pickRandomQuote(quotes, rng = Math.random) {
  if (quotes.length === 0) {
    throw new Error('Cannot pick a quote from an empty collection');
  }
  const index = Math.floor(rng() * quotes.length);
  return quotes[index];
}

// Used by "New quote": excludes the displayed quote so the button always changes it (FR-003).
export function pickNextQuote(quotes, currentId, rng = Math.random) {
  const others = quotes.filter((quote) => quote.id !== currentId);
  return pickRandomQuote(others.length > 0 ? others : quotes, rng);
}
