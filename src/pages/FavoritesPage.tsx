import { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { getPokemon } from '../api/pokeApi';
import { PokemonCard } from '../components/PokemonCard';
import { Loading, ErrorState, EmptyState } from '../components/States';
import type { Pokemon } from '../types';

/** Página "Meus Favoritos" (RF04): lê os ids salvos e resolve os detalhes. */
export function FavoritesPage() {
  const { favorites, toggle } = useFavorites();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all(favorites.map((id) => getPokemon(id)))
      .then((list) => { if (active) setPokemons(list); })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : 'Erro.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [favorites]);

  if (loading) return <Loading label="Carregando favoritos…" />;
  if (error) return <ErrorState message={error} />;
  if (pokemons.length === 0) return <EmptyState message="Você ainda não favoritou nenhum Pokémon." />;

  return (
    <div className="page">
      <h1 className="page__title">Meus Favoritos</h1>
      <section className="grid" aria-label="Pokémons favoritos">
        {pokemons.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            isFavorite
            onToggleFavorite={toggle}
          />
        ))}
      </section>
    </div>
  );
}
