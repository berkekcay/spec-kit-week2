// Favorites store: keeps favorite quote IDs in memory and persists them when storage works.

export const STORAGE_KEY = 'qotd.favorites.v1';

function loadIds(storage, validIds) {
  const raw = storage.getItem(STORAGE_KEY);
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

export function createFavoritesStore(storage, validIds) {
  const favorites = new Set();
  let persistent = storage !== null;

  if (persistent) {
    try {
      loadIds(storage, validIds).forEach((id) => favorites.add(id));
    } catch {
      persistent = false;
    }
  }

  function save() {
    if (!persistent) {
      return;
    }
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
    } catch {
      persistent = false;
    }
  }

  return {
    isFavorite: (id) => favorites.has(id),
    toggle(id) {
      if (favorites.has(id)) {
        favorites.delete(id);
      } else {
        favorites.add(id);
      }
      save();
      return favorites.has(id);
    },
    ids: () => [...favorites],
    get persistent() {
      return persistent;
    },
  };
}
