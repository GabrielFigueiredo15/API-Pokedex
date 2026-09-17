import { useCallback, useEffect, useState } from 'react';
import { getPokemon } from '../api/pokeApi';
import type { Pokemon } from '../types';

/** Estados de busca do recurso único (RF03): dados, loading, erro, reload. */
export function usePokemon(idOrName: string | number) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getPokemon(idOrName)
      .then((data) => {
        if (active) setPokemon(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Erro inesperado.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [idOrName]);

  useEffect(load, [load]);

  const reload = useCallback(load, [load]);

  return { pokemon, loading, error, reload };
}
