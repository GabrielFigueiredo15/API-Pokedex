import { useMemo, useState } from 'react';
import { usePokemonList } from '../hooks/usePokemonList';
import { useDebounce } from '../hooks/useDebounce';
import { usePokemonTypes } from '../hooks/usePokemonTypes';
import { useFavorites } from '../hooks/useFavorites';
import { PokemonCard } from '../components/PokemonCard';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { Loading, ErrorState, EmptyState } from '../components/States';

/** Página inicial (RF01/RF02): grade paginada + busca + filtro por tipo. */
export function HomePage() {
  const { pokemons, total, initialLoading, loadingMore, error, loadMore, reload } =
    usePokemonList();
  const { types } = usePokemonTypes();
  const { favorites, toggle } = useFavorites();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query.trim().toLowerCase(), 300)/**só busca por nome (RF02) */;
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return pokemons.filter((p) => {
      const matchesName = debouncedQuery === '' || p.name.toLowerCase().includes(debouncedQuery);
      const matchesType = selectedType === null || p.types.includes(selectedType);
      return matchesName && matchesType;
    });
  }, [pokemons, debouncedQuery, selectedType]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const p of pokemons) for (const t of p.types) acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, [pokemons]);

  if (initialLoading) return <Loading label="Carregando Pokémons…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="page">
      <SearchBar value={query} onChange={setQuery} />
      <FilterBar types={types} selected={selectedType} counts={counts} onSelect={setSelectedType} />

      {filtered.length === 0 ? (
        <EmptyState message="Nenhum Pokémon encontrado." />
      ) : (
        <>
          <p className="page__meta" role="status">
            Mostrando {filtered.length} de {total} Pokémon.
          </p>
          <section className="grid" aria-label="Lista de Pokémons">
            {filtered.map((p) => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                isFavorite={favorites.includes(p.id)}
                onToggleFavorite={toggle}
              />
            ))}
          </section>
        </>
      )}

      {pokemons.length < total && (
        <div className="page__actions">
          <button type="button" className="btn" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Carregando…' : 'Carregar mais'}
          </button>
        </div>
      )}
    </div>
  );
}
