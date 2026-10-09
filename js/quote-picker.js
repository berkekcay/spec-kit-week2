// Pure quote selection logic; the RNG is injected so tests can be deterministic.

export function pickRandomQuote(quotes, rng = Math.random) {
  if (quotes.length === 0) {
    throw new Error('Cannot pick a quote from an empty collection');
  }
  const index = Math.floor(rng() * quotes.length);
  return quotes[index];
}
