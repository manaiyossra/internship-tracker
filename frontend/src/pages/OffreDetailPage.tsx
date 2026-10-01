import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { getOffre } from '../api/offres';
import { postuler } from '../api/candidatures';
import type { Offre } from '../types';

export default function OffreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [offre, setOffre] = useState<Offre | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    getOffre(id).then(setOffre).finally(() => setIsLoading(false));
  }, [id]);

  async function handlePostuler() {
    if (!id) return;
    setIsApplying(true);
    setMessage(null);
    try {
      await postuler(id);
      setMessage({ type: 'success', text: 'Candidature envoyée avec succès !' });
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setMessage({ type: 'error', text: 'Vous avez déjà postulé à cette offre.' });
      } else {
        setMessage({ type: 'error', text: 'Une erreur est survenue, réessaie plus tard.' });
      }
    } finally {
      setIsApplying(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <p className="px-8 text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <p className="px-8 text-gray-600">Offre introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="px-8">
        <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Retour aux offres</Link>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{offre.titre}</h1>
          <p className="text-gray-700 mb-1">{offre.entreprise} — {offre.ville}</p>
          <p className="text-sm text-gray-500 mb-4">{offre.type} · {offre.duree} mois</p>
          <p className="text-gray-800 whitespace-pre-line mb-6">{offre.description}</p>

          {message && (
            <div className={`px-4 py-2 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {user?.role === 'candidat' && (
            <button
              onClick={handlePostuler}
              disabled={isApplying || message?.type === 'success'}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isApplying ? 'Envoi...' : 'Postuler'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}