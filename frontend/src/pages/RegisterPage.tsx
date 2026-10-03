import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAxiosError } from 'axios';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

   async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ email, password, nom, prenom, telephone: telephone || undefined });
      navigate('/');
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        const msg = err.response.data.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setError('Impossible de créer le compte.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Prénom</label>
        <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label className="block mb-2 text-sm font-medium text-gray-700">Nom</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label className="block mb-2 text-sm font-medium text-gray-700">Téléphone (optionnel)</label>
        <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label className="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {isSubmitting ? 'Création...' : 'Créer mon compte'}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Déjà un compte ? <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}