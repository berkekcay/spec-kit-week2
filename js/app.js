// DOM wiring: renders the current quote and connects the buttons to the logic modules.

import { QUOTES } from './quotes.js';
import { pickRandomQuote, pickNextQuote } from './quote-picker.js';
import { createFavoritesStore } from './favorites.js';

const NOT_SAVED_MESSAGE = 'Favorites won\'t be saved in this browser.';

function getLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null; // Accessing localStorage itself can throw when site data is blocked.
  }
}

function getElements() {
  return {
    quoteText: document.getElementById('quote-text'),
    quoteAuthor: document.getElementById('quote-author'),
    newQuoteButton: document.getElementById('new-quote'),
    favoriteButton: document.getElementById('favorite'),
    notice: document.getElementById('notice'),
  };
}

function renderFavorite(elements, isFavorite) {
  const button = elements.favoriteButton;
  button.textContent = isFavorite ? '★' : '☆';
  button.setAttribute('aria-pressed', String(isFavorite));
  button.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
}

function renderQuote(elements, quote, store) {
  elements.quoteText.textContent = quote.text;
  elements.quoteAuthor.textContent = `— ${quote.author}`;
  renderFavorite(elements, store.isFavorite(quote.id));
}

function renderNotice(elements, store) {
  if (!store.persistent) {
    elements.notice.textContent = NOT_SAVED_MESSAGE;
    elements.notice.hidden = false;
  }
}

function init() {
  const elements = getElements();
  const store = createFavoritesStore(getLocalStorage(), new Set(QUOTES.map((quote) => quote.id)));
  let currentQuote = pickRandomQuote(QUOTES);

  elements.newQuoteButton.addEventListener('click', () => {
    currentQuote = pickNextQuote(QUOTES, currentQuote.id);
    renderQuote(elements, currentQuote, store);
  });

  elements.favoriteButton.addEventListener('click', () => {
    renderFavorite(elements, store.toggle(currentQuote.id));
    renderNotice(elements, store);
  });

  renderQuote(elements, currentQuote, store);
  renderNotice(elements, store);
}

document.addEventListener('DOMContentLoaded', init);
