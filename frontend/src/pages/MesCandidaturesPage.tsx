import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getMesCandidatures, type CandidatureWithOffre } from '../api/candidatures';
import type { StatutCandidature } from '../types';

const statutStyles: Record<StatutCandidature, string> = {
  'envoyée': 'bg-gray-200 text-gray-800',
  'entretien': 'bg-yellow-100 text-yellow-800',
  'acceptée': 'bg-green-100 text-green-800',
  'refusée': 'bg-red-100 text-red-800',
};

export default function MesCandidaturesPage() {
  const [candidatures, setCandidatures] = useState<CandidatureWithOffre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMesCandidatures().then(setCandidatures).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="px-8">
        <h1 className="text-2xl font-bold mb-6">Mes candidatures</h1>

        {isLoading ? (
          <p className="text-gray-600">Chargement...</p>
        ) : candidatures.length === 0 ? (
          <p className="text-gray-600">Tu n'as encore postulé à aucune offre.</p>
        ) : (
          <div className="grid gap-4">
            {candidatures.map((candidature) => (
              <div key={candidature._id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{candidature.offre.titre}</h2>
                  <p className="text-gray-700">{candidature.offre.entreprise} — {candidature.offre.ville}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statutStyles[candidature.statut]}`}>
                  {candidature.statut}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}