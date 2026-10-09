// Favorites store: keeps favorite quote IDs in memory and persists them when storage works.

export const STORAGE_KEY = 'qotd.favorites.v1';

function parseIds(raw, validIds) {
  if (raw === null) {
    return [];
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter((id) => typeof id === 'string' && validIds.has(id));
}

// Returns the saved IDs and whether storage is usable; never throws.
function readFavorites(storage, validIds) {
  if (storage === null) {
    return { ids: [], persistent: false };
  }
  try {
    return { ids: parseIds(storage.getItem(STORAGE_KEY), validIds), persistent: true };
  } catch {
    return { ids: [], persistent: false };
  }
}

// Returns true when the write succeeded.
function writeFavorites(storage, favorites) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
    return true;
  } catch {
    return false;
  }
}

export function createFavoritesStore(storage, validIds) {
  const initial = readFavorites(storage, validIds);
  const favorites = new Set(initial.ids);
  let persistent = initial.persistent;

  return {
    isFavorite: (id) => favorites.has(id),
    toggle(id) {
      if (!favorites.delete(id)) {
        favorites.add(id);
      }
      persistent = persistent && writeFavorites(storage, favorites);
      return favorites.has(id);
    },
    ids: () => [...favorites],
    get persistent() {
      return persistent;
    },
  };
}
