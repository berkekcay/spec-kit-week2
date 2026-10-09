# Data Model: Quote of the Day

## Quote

A single entry of the built-in collection (`js/quotes.js`).

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Required, unique within the collection, stable across releases (kebab-case slug) |
| `text` | string | Required, non-empty after trimming |
| `author` | string | Required, non-empty after trimming |

Validation (enforced by `tests/quotes.test.js`): collection length ≥ 10 (FR-001), all IDs
unique, all fields non-empty strings.

## Favorites

The set of quote IDs the visitor has marked as favorite.

- **In memory**: a `Set<string>` of quote IDs.
- **Persisted** (`localStorage`):
  - Key: `qotd.favorites.v1`
  - Value: JSON array of strings, e.g. `["wilde-be-yourself","lao-tzu-journey"]`
- **Load rules**:
  - Key missing → empty set.
  - Value is not valid JSON, or not an array → empty set (edge case: corrupted data).
  - Non-string items, and IDs not present in the current collection → dropped (edge case:
    removed quotes).
  - Storage access throws → empty set, store switches to in-memory mode
    (`persistent: false`).
- **Save rules**: after every toggle, the full set is written back as a JSON array. If writing
  throws, the in-memory change is kept and the store switches to `persistent: false`.

### State transitions (per quote)

```text
not favorite --toggle--> favorite --toggle--> not favorite
```

## Display state (UI only, not persisted)

- `currentQuote`: the Quote currently on screen.
