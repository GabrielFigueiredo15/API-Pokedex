import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PokemonDetailsPage } from './pages/PokemonDetailsPage';
import { FavoritesPage } from './pages/FavoritesPage';

/** Rotas (RF05): Home, Detalhes e Favoritos; fallback para "/". */
export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
