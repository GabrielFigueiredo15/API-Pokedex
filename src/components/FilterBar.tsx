import { useMemo } from 'react';

interface Props {
  types: string[];
  selected: string | null;
  counts: Record<string, number>;
  onSelect: (type: string | null) => void;
}

/** Filtro por tipo (RF02): chips clicáveis, com contagem e estado ativo. */
export function FilterBar({ types, selected, counts, onSelect }: Props) {
  const chips = useMemo(
    () =>
      types.map((type) => (
        <button
          key={type}
          type="button"
          className={`badge badge--${type} filter-chip${selected === type ? ' filter-chip--active' : ''}`}
          onClick={() => onSelect(selected === type ? null : type)}
          aria-pressed={selected === type}
        >
          {type}
          {counts[type] !== undefined && (
            <span className="filter-chip__count">{counts[type]}</span>
          )}
        </button>
      )),
    [types, selected, counts, onSelect],
  );

  return (
    <div className="filters" role="group" aria-label="Filtrar por tipo">
      <button
        type="button"
        className={`filter-chip${selected === null ? ' filter-chip--active' : ''}`}
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
      >
        Todos
      </button>
      {chips}
    </div>
  );
}
