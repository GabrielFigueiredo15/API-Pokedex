import { useParams, Link } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import { useFavorites } from '../hooks/useFavorites';
import { FavoriteButton } from '../components/FavoriteButton';
import { PokemonStats } from '../components/PokemonStats';
import { Loading, ErrorState, EmptyState } from '../components/States';

/** Página de detalhes (RF03): rota `/pokemon/:id`. */
export function PokemonDetailsPage() {
  const { id = '' } = useParams();
  const { pokemon, loading, error, reload } = usePokemon(id);
  const { favorites, toggle } = useFavorites();

  if (loading) return <Loading label="Carregando Pokémon…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!pokemon) return <EmptyState message="Pokémon não encontrado." />;

  return (
    <div className="page details">
      <Link to="/" className="details__back">← Voltar</Link>

      <header className="details__header">
        <img
          className="details__sprite"
          src={pokemon.sprite}
          alt={`Sprite de ${pokemon.name}`}
        />
        <div className="details__title">
          <span className="details__number">#{String(pokemon.id).padStart(4, '0')}</span>
          <h1 className="details__name">{pokemon.name}</h1>
          <div className="details__types">
            {pokemon.types.map((t) => (
              <span key={t} className={`badge badge--${t}`}>{t}</span>
            ))}
          </div>
        </div>
        <FavoriteButton
          active={favorites.includes(pokemon.id)}
          onToggle={() => toggle(pokemon.id)}
          label={`Favoritar ${pokemon.name}`}
        />
      </header>

      <dl className="details__facts">
        <div><dt>Altura</dt><dd>{(pokemon.height / 10).toFixed(1)} m</dd></div>
        <div><dt>Peso</dt><dd>{(pokemon.weight / 10).toFixed(1)} kg</dd></div>
      </dl>

      <section className="details__abilities">
        <h2>Habilidades</h2>
        <ul>{pokemon.abilities.map((a) => <li key={a}>{a}</li>)}</ul>
      </section>

      <PokemonStats pokemon={pokemon} />
    </div>
  );
}
