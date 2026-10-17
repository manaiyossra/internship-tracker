import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext');

function renderWithRoute(ui: ReactNode) {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/login" element={<div>Page de connexion</div>} />
        <Route path="/" element={<div>Page d'accueil</div>} />
        <Route path="/protected" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('affiche "Chargement..." pendant le chargement', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: true } as any);

    renderWithRoute(<ProtectedRoute><div>Contenu protégé</div></ProtectedRoute>);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('redirige vers /login si aucun utilisateur n\'est connecté', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, isLoading: false } as any);

    renderWithRoute(<ProtectedRoute><div>Contenu protégé</div></ProtectedRoute>);

    expect(screen.getByText('Page de connexion')).toBeInTheDocument();
  });

  it('redirige vers / si un candidat accède à une route admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'candidat' },
      isLoading: false,
    } as any);

    renderWithRoute(
      <ProtectedRoute requireAdmin>
        <div>Contenu admin</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Page d'accueil")).toBeInTheDocument();
  });

  it('affiche le contenu si l\'utilisateur est autorisé', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'candidat' },
      isLoading: false,
    } as any);

    renderWithRoute(<ProtectedRoute><div>Contenu protégé</div></ProtectedRoute>);

    expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
  });
});