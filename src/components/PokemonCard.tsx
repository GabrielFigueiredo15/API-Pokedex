import { Link } from 'react-router-dom';
import { FavoriteButton } from './FavoriteButton';
import type { Pokemon } from '../types';

interface Props {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

/** Cartão da grade (RF01): sprite + nome + tipos + favoritar. */
export function PokemonCard({ pokemon, isFavorite, onToggleFavorite }: Props) {
  return (
    <article className={`card${isFavorite ? ' card--fav' : ''}`}>
      <Link to={`/pokemon/${pokemon.id}`} className="card__link" aria-label={`Ver detalhes de ${pokemon.name}`}>
        <div className="card__sprite">
          <img src={pokemon.sprite} alt={`Sprite de ${pokemon.name}`} loading="lazy" />
        </div>
        <div className="card__info">
          <span className="card__number">#{String(pokemon.id).padStart(3, '0')}</span>
          <h2 className="card__name">{pokemon.name}</h2>
          <div className="card__types">
            {pokemon.types.map((t) => (
              <span key={t} className={`badge badge--${t}`}>{t}</span>
            ))}
          </div>
        </div>
      </Link>
      <div className="card__fav">
        <FavoriteButton
          active={isFavorite}
          onToggle={() => onToggleFavorite(pokemon.id)}
          label={`Favoritar ${pokemon.name}`}
        />
      </div>
    </article>
  );
}
