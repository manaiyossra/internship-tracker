import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getStats, type Stats } from '../api/stats';

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStats().then(setStats).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="px-8 pb-8">
        <h1 className="text-2xl font-bold mb-6">Statistiques</h1>

        {isLoading ? (
          <p className="text-gray-600">Chargement...</p>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-2xl">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-1">Offres publiées</p>
                <p className="text-3xl font-bold text-blue-600">{stats.nbOffres}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-1">Candidatures reçues</p>
                <p className="text-3xl font-bold text-blue-600">{stats.nbCandidatures}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
              <h2 className="text-lg font-semibold mb-4">Répartition par statut</h2>
              <div className="space-y-2">
                {Object.entries(stats.repartitionParStatut).map(([statut, count]) => (
                  <div key={statut} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{statut}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.repartitionParStatut).length === 0 && (
                  <p className="text-gray-500 text-sm">Aucune candidature pour l'instant.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Impossible de charger les statistiques.</p>
        )}
      </div>
    </div>
  );
}