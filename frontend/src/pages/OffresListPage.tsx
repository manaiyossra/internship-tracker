import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOffres } from '../api/offres';
import type { Offre, OffreType } from '../types';

export default function OffresListPage() {
  const { user, logout } = useAuth();
  const [offres, setOffres] = useState<Offre[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [type, setType] = useState<OffreType | ''>('');
  const [duree, setDuree] = useState('');
  const [villeInput, setVilleInput] = useState('');
  const [ville, setVille] = useState('');

  useEffect(() => {
    async function fetchOffres() {
      setIsLoading(true);
      try {
        const response = await getOffres({
          type: type || undefined,
          duree: duree || undefined,
          ville: ville || undefined,
          page,
          limit: 10,
        });
        setOffres(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOffres();
  }, [page, type, duree, ville]);

  function handleFilterSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setVille(villeInput);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offres de stage</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            Connecté·e en tant que {user?.prenom} {user?.nom} ({user?.role})
          </span>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Déconnexion
          </button>
        </div>
      </div>

      <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <select
          value={type}
          onChange={(e) => { setType(e.target.value as OffreType | ''); setPage(1); }}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Tous les types</option>
          <option value="presentiel">Présentiel</option>
          <option value="hybride">Hybride</option>
          <option value="distanciel">Distanciel</option>
        </select>

        <select
          value={duree}
          onChange={(e) => { setDuree(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Toutes les durées</option>
          <option value="1">1 mois</option>
          <option value="2">2 mois</option>
          <option value="6">6 mois</option>
        </select>

        <input
          type="text"
          placeholder="Ville"
          value={villeInput}
          onChange={(e) => setVilleInput(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1 min-w-[150px]"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Rechercher
        </button>
      </form>

      {isLoading ? (
        <p className="text-gray-600">Chargement...</p>
      ) : offres.length === 0 ? (
        <p className="text-gray-600">Aucune offre trouvée.</p>
      ) : (
        <div className="grid gap-4">
          {offres.map((offre) => (
            <div key={offre._id} className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">{offre.titre}</h2>
              <p className="text-gray-700">{offre.entreprise} — {offre.ville}</p>
              <p className="text-sm text-gray-500">{offre.type} · {offre.duree} mois</p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white rounded shadow-sm disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-gray-700">Page {page} / {totalPages} ({total} offres)</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white rounded shadow-sm disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}