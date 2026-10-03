import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OffresListPage from './pages/OffresListPage';
import ProtectedRoute from './components/ProtectedRoute';
import OffreDetailPage from './pages/OffreDetailPage';
import MesCandidaturesPage from './pages/MesCandidaturesPage';
import ProfilPage from './pages/ProfilPage';
import AdminStatsPage from './pages/AdminStatsPage';
import AdminOffresPage from './pages/AdminOffresPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <OffresListPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/offres/:id"
  element={
    <ProtectedRoute>
      <OffreDetailPage />
    </ProtectedRoute>
  }
/>
      <Route
  path="/mes-candidatures"
  element={
    <ProtectedRoute>
      <MesCandidaturesPage />
    </ProtectedRoute>
  }
/>
      <Route
  path="/profil"
  element={
    <ProtectedRoute>
      <ProfilPage />
    </ProtectedRoute>
  }
/>
      <Route
  path="/admin/stats"
  element={
    <ProtectedRoute requireAdmin>
      <AdminStatsPage />
    </ProtectedRoute>
  }
/>
      <Route
  path="/admin/offres"
  element={
    <ProtectedRoute requireAdmin>
      <AdminOffresPage />
    </ProtectedRoute>
  }
/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;