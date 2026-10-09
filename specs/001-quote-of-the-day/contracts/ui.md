# UI Contract

Elements `js/app.js` relies on in `index.html`. Tests and manual checks refer to these IDs.

| Element | Selector | Contract |
|---------|----------|----------|
| Quote region | `#quote` (`<figure>`, `aria-live="polite"`) | Contains the current quote |
| Quote text | `#quote-text` (`<blockquote>`) | Text of the current quote |
| Author | `#quote-author` (`<figcaption>`) | "— Author" |
| New quote | `#new-quote` (`<button type="button">`) | Shows another quote (FR-003) |
| Favorite | `#favorite` (`<button type="button">`) | `aria-pressed="true\|false"`; label "Add to favorites" / "Remove from favorites"; visual ☆ / ★ (FR-004, FR-005) |
| Notice | `#notice` (`role="status"`, `hidden` by default) | Shown when favorites cannot be saved (FR-007) |

Keyboard: both buttons are reachable with Tab and activate with Enter/Space; focus is always
visible (FR-008).
