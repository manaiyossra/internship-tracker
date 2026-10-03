import { useState, type FormEvent, type ChangeEvent } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { updateMe, uploadCv, uploadLettreMotivation } from '../api/users';
import { API_BASE_URL } from '../api/client';

export default function ProfilPage() {
  const { user, refreshUser } = useAuth();
  const [nom, setNom] = useState(user?.nom ?? '');
  const [prenom, setPrenom] = useState(user?.prenom ?? '');
  const [telephone, setTelephone] = useState(user?.telephone ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isUploadingLettre, setIsUploadingLettre] = useState(false);

  const fileInputClass =
    'block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer';

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await updateMe({ nom, prenom, telephone });
      await refreshUser();
      setSaveMessage('Profil mis à jour avec succès.');
    } catch {
      setSaveMessage('Erreur lors de la mise à jour.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCvChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCv(true);
    try {
      await uploadCv(file);
      await refreshUser();
    } finally {
      setIsUploadingCv(false);
    }
  }

  async function handleLettreChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLettre(true);
    try {
      await uploadLettreMotivation(file);
      await refreshUser();
    } finally {
      setIsUploadingLettre(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="px-8 pb-8">
        <h1 className="text-2xl font-bold mb-6 max-w-xl mx-auto">Mon profil</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-xl mx-auto mb-6">
          <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
          <form onSubmit={handleSave}>
            {saveMessage && (
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded mb-4 text-sm">{saveMessage}</div>
            )}

            <label className="block mb-2 text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text" value={nom} onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit" disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">CV</p>
            {user?.cvUrl && (
              <a href={`${API_BASE_URL}${user.cvUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm block mb-2">
                Voir le fichier actuel
              </a>
            )}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} disabled={isUploadingCv} className={fileInputClass} />
            {isUploadingCv && <p className="text-sm text-gray-500 mt-1">Envoi en cours...</p>}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Lettre de motivation</p>
            {user?.lettreMotivationUrl && (
              <a href={`${API_BASE_URL}${user.lettreMotivationUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm block mb-2">
                Voir le fichier actuel
              </a>
            )}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleLettreChange} disabled={isUploadingLettre} className={fileInputClass} />
            {isUploadingLettre && <p className="text-sm text-gray-500 mt-1">Envoi en cours...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}