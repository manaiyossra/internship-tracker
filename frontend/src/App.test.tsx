import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import App from './App';

vi.mock('./pages/LoginPage', () => ({ default: () => <div>Page: Login</div> }));
vi.mock('./pages/RegisterPage', () => ({ default: () => <div>Page: Register</div> }));
vi.mock('./pages/OffresListPage', () => ({ default: () => <div>Page: OffresList</div> }));
vi.mock('./pages/OffreDetailPage', () => ({ default: () => <div>Page: OffreDetail</div> }));
vi.mock('./pages/MesCandidaturesPage', () => ({ default: () => <div>Page: MesCandidatures</div> }));
vi.mock('./pages/ProfilPage', () => ({ default: () => <div>Page: Profil</div> }));
vi.mock('./pages/AdminStatsPage', () => ({ default: () => <div>Page: AdminStats</div> }));
vi.mock('./pages/AdminOffresPage', () => ({ default: () => <div>Page: AdminOffres</div> }));
vi.mock('./components/ProtectedRoute', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('App', () => {
  it('/login affiche LoginPage', () => {
    renderAt('/login');
    expect(screen.getByText('Page: Login')).toBeInTheDocument();
  });

  it('/register affiche RegisterPage', () => {
    renderAt('/register');
    expect(screen.getByText('Page: Register')).toBeInTheDocument();
  });

  it('/ affiche OffresListPage (protégée)', () => {
    renderAt('/');
    expect(screen.getByText('Page: OffresList')).toBeInTheDocument();
  });

  it('/offres/:id affiche OffreDetailPage', () => {
    renderAt('/offres/123');
    expect(screen.getByText('Page: OffreDetail')).toBeInTheDocument();
  });

  it('/mes-candidatures affiche MesCandidaturesPage', () => {
    renderAt('/mes-candidatures');
    expect(screen.getByText('Page: MesCandidatures')).toBeInTheDocument();
  });

  it('/profil affiche ProfilPage', () => {
    renderAt('/profil');
    expect(screen.getByText('Page: Profil')).toBeInTheDocument();
  });

  it('/admin/stats affiche AdminStatsPage', () => {
    renderAt('/admin/stats');
    expect(screen.getByText('Page: AdminStats')).toBeInTheDocument();
  });

  it('/admin/offres affiche AdminOffresPage', () => {
    renderAt('/admin/offres');
    expect(screen.getByText('Page: AdminOffres')).toBeInTheDocument();
  });

  it('une route inconnue redirige vers /', () => {
    renderAt('/ceci-nexiste-pas');
    expect(screen.getByText('Page: OffresList')).toBeInTheDocument();
  });
});