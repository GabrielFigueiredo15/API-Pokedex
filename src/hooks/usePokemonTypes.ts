import { useCallback, useEffect, useState } from 'react';
import { getTypeNames } from '../api/pokeApi';

/** Estados do catálogo de tipos (RF02): dados, loading, erro, reload. */
export function usePokemonTypes() {
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getTypeNames()
      .then((names) => {
        if (active) setTypes(names);
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
  }, []);

  useEffect(load, [load]);

  return { types, loading, error, reload: load };
}
