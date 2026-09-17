import { useCallback, useEffect, useRef, useState } from 'react';
import { getPokemonsByPage, PAGE_SIZE } from '../api/pokeApi';
import type { Pokemon } from '../types';

/**
 * Carrega a lista paginada (RF01/RF02). Guarda todos os itens já buscados
 * e mantém paginação incremental via "Carregar mais" (RF02).
 */
export function usePokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadPage = useCallback(async (offset: number) => {
    setError(null);
    if (offset === 0) setInitialLoading(true);
    else setLoadingMore(true);
    try {
      const page = await getPokemonsByPage(offset, PAGE_SIZE);
      setTotal(page.total);
      setPokemons((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...page.results.filter((p) => !seen.has(p.id))];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    void loadPage(0);
  }, [loadPage]);

  const reload = useCallback(() => {
    hasLoaded.current = true;
    setPokemons([]);
    setTotal(0);
    void loadPage(0);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || initialLoading) return;
    void loadPage(pokemons.length);
  }, [loadPage, pokemons.length, loadingMore, initialLoading]);

  const hasMore = pokemons.length < total;

  return { pokemons, total, hasMore, initialLoading, loadingMore, error, loadMore, reload };
}
