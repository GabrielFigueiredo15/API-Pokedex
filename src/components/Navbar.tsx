import { NavLink, Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

function linkClass({ isActive }: { isActive: boolean }) {
  return `navbar__link${isActive ? ' navbar__link--active' : ''}`;
}

/** Barra de navegação (RF05) com contagem de favoritos. */
export function Navbar() {
  const { favorites } = useFavorites();

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand" aria-label="Pokedex Web — início">
        <img src="/pokedex.svg" alt="" className="navbar__logo" aria-hidden="true" />
        <span>Pokedex</span>
      </Link>
      <nav className="navbar__nav" aria-label="Navegação principal">
        <NavLink to="/" end className={linkClass}>
          Pokémons
        </NavLink>
        <NavLink to="/favoritos" className={linkClass}>
          Favoritos
          {favorites.length > 0 && (
            <span className="navbar__badge">{favorites.length}</span>
          )}
        </NavLink>
      </nav>
    </header>
  );
}
