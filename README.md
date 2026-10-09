# Quote of the Day

A small static page that shows a random quote, a **New quote** button that always shows a
different quote, and a ☆/★ favorite toggle that persists across reloads in the same browser.

Built for Week 2 of *AI-Augmented Software Engineering* using
[GitHub Spec Kit](https://github.com/github/spec-kit) (spec-driven development):
constitution → specify → plan → tasks → implement → converge. See [writeup.md](writeup.md).

## Run

Requires Node.js 18+ (tests) and any static server (the page uses ES modules, which don't
load from `file://`).

```bash
npm test                     # 21 tests, no installs needed
python -m http.server 8000   # then open http://localhost:8000
```

Full validation scenarios: [specs/001-quote-of-the-day/quickstart.md](specs/001-quote-of-the-day/quickstart.md).

## Layout

```text
index.html, css/styles.css   page and styles (light/dark)
js/quotes.js                 built-in collection (12 quotes)
js/quote-picker.js           random pick / pick a different quote (pure)
js/favorites.js              favorites store over injected storage (pure)
js/app.js                    DOM wiring
tests/                       node:test suites
.specify/memory/             constitution
specs/001-quote-of-the-day/  spec, plan, research, data model, contracts, tasks
```
