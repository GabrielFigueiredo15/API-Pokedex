import type { Pokemon } from '../types';

const LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Ataque Esp.',
  'special-defense': 'Defesa Esp.',
  speed: 'Velocidade',
};

const MAX_BASE_STAT = 255;

/** Gráfico de barras dos stats base (RF03). */
export function PokemonStats({ pokemon }: { pokemon: Pokemon }) {
  return (
    <section className="stats" aria-label={`Stats base de ${pokemon.name}`}>
      <h3 className="stats__title">Stats base</h3>
      <ul className="stats__list">
        {pokemon.stats.map((s) => (
          <li key={s.name} className="stats__row">
            <span className="stats__label">{LABELS[s.name] ?? s.name}</span>
            <span className="stats__value">{s.value}</span>
            <span className="stats__bar" role="presentation">
              <span
                className="stats__fill"
                style={{ width: `${Math.round((s.value / MAX_BASE_STAT) * 100)}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
