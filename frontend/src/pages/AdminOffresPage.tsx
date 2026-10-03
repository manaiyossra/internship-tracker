import { useState, useEffect, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import Navbar from '../components/Navbar';
import { getOffres, createOffre, updateOffre, deleteOffre, type OffreInput } from '../api/offres';
import type { Offre, OffreType } from '../types';

const emptyForm: OffreInput = {
  entreprise: '',
  titre: '',
  description: '',
  type: 'presentiel',
  duree: 1,
  ville: '',
};

export default function AdminOffresPage() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<OffreInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadOffres();
  }, []);

  async function loadOffres() {
    setIsLoading(true);
    try {
      const response = await getOffres({ limit: 100 });
      setOffres(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
    setShowForm(true);
  }

  function startEdit(offre: Offre) {
    setForm({
      entreprise: offre.entreprise,
      titre: offre.titre,
      description: offre.description,
      type: offre.type,
      duree: offre.duree,
      ville: offre.ville,
    });
    setEditingId(offre._id);
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await updateOffre(editingId, form);
      } else {
        await createOffre(form);
      }
      setShowForm(false);
      await loadOffres();
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        const msg = err.response.data.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setError('Une erreur est survenue.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette offre ? Cette action est irréversible.')) return;
    await deleteOffre(id);
    await loadOffres();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="px-8 pb-8">
        <div className="flex justify-between items-center mb-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Gérer les offres</h1>
          <button onClick={startCreate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Nouvelle offre
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingId ? "Modifier l'offre" : 'Nouvelle offre'}</h2>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Entreprise</label>
                <input type="text" required value={form.entreprise}
                  onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Titre</label>
                <input type="text" required value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>

            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea required value={form.description} rows={4}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                <select value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as OffreType })}
                  className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="presentiel">Présentiel</option>
                  <option value="hybride">Hybride</option>
                  <option value="distanciel">Distanciel</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Durée (mois)</label>
                <select value={form.duree}
                  onChange={(e) => setForm({ ...form, duree: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value={1}>1 mois</option>
                  <option value={2}>2 mois</option>
                  <option value={6}>6 mois</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Ville</label>
                <input type="text" required value={form.ville}
                  onChange={(e) => setForm({ ...form, ville: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {isSubmitting ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                Annuler
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <p className="text-gray-600">Chargement...</p>
        ) : (
          <div className="grid gap-4 max-w-3xl mx-auto">
            {offres.map((offre) => (
              <div key={offre._id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{offre.titre}</h2>
                  <p className="text-gray-700">{offre.entreprise} — {offre.ville}</p>
                  <p className="text-sm text-gray-500">{offre.type} · {offre.duree} mois</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(offre)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(offre._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}