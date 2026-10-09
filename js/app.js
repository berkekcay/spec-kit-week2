// DOM wiring: renders the current quote and connects the buttons to the logic modules.

import { QUOTES } from './quotes.js';
import { pickRandomQuote } from './quote-picker.js';
import { createFavoritesStore } from './favorites.js';

function getLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null; // Accessing localStorage itself can throw when site data is blocked.
  }
}

function init() {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const newQuoteButton = document.getElementById('new-quote');
  const favoriteButton = document.getElementById('favorite');
  const notice = document.getElementById('notice');

  const store = createFavoritesStore(getLocalStorage(), new Set(QUOTES.map((quote) => quote.id)));
  let currentQuote = pickRandomQuote(QUOTES);

  function renderFavorite() {
    const isFavorite = store.isFavorite(currentQuote.id);
    favoriteButton.textContent = isFavorite ? '★' : '☆';
    favoriteButton.setAttribute('aria-pressed', String(isFavorite));
    favoriteButton.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
  }

  function renderQuote() {
    quoteText.textContent = currentQuote.text;
    quoteAuthor.textContent = `— ${currentQuote.author}`;
    renderFavorite();
  }

  newQuoteButton.addEventListener('click', () => {
    currentQuote = pickRandomQuote(QUOTES);
    renderQuote();
  });

  favoriteButton.addEventListener('click', () => {
    store.toggle(currentQuote.id);
    renderFavorite();
    if (!store.persistent) {
      notice.textContent = "Favorites won't be saved in this browser.";
      notice.hidden = false;
    }
  });

  renderQuote();
}

document.addEventListener('DOMContentLoaded', init);
