import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'pokedex:favorites';

let favorites: number[] = readStorage();
const listeners = new Set<() => void>();

function readStorage(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v): v is number => typeof v === 'number')
      : [];
  } catch {
    return [];
  }
}

function writeStorage(list: number[]): void {
  try {
    if (list.length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* localStorage indisponível (modo privado) — segue sem persistir */
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): number[] {
  return favorites;
}

/**
 * Favoritos persistidos no localStorage (RF04), compartilhados entre todos
 * os componentes via useSyncExternalStore — qualquer toggle reflete na
 * grade, nos detalhes e em "Meus Favoritos" simultaneamente.
 */
export function useFavorites() {
  const list = useSyncExternalStore(subscribe, getSnapshot);

  const isFavorite = useCallback((id: number) => list.includes(id), [list]);

  const toggle = useCallback((id: number) => {
    favorites = list.includes(id)
      ? list.filter((f) => f !== id)
      : [...list, id];
    writeStorage(favorites);
    emit();
  }, [list]);

  return { favorites: list, isFavorite, toggle };
}
