import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded hover:bg-gray-100 ${location.pathname === path ? 'font-semibold text-blue-600' : 'text-gray-700'}`;

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-bold text-blue-600 mr-4">Tracker Stages</Link>
        <Link to="/" className={linkClass('/')}>Offres</Link>
        {user?.role === 'candidat' && (
          <Link to="/mes-candidatures" className={linkClass('/mes-candidatures')}>Mes candidatures</Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 text-sm">
          {user?.prenom} {user?.nom} ({user?.role})
        </span>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}