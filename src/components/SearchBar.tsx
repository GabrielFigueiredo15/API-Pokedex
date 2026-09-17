interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Campo de busca por nome (RF02), controlado + botão limpar. */
export function SearchBar({ value, onChange, placeholder = 'Buscar por nome…' }: Props) {
  return (
    <div className="search">
      <span className="search__icon" aria-hidden="true">&#128269;</span>
      <input
        type="search"
        className="search__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar Pokémon por nome"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
      />
      {value && (
        <button
          type="button"
          className="search__clear"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
        >
          &times;
        </button>
      )}
    </div>
  );
}
