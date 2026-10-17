import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext');

describe('Navbar', () => {
  it('affiche le lien "Mes candidatures" pour un candidat, pas les liens admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { _id: 'u1', nom: 'Test', prenom: 'Test', role: 'candidat', email: 'a@test.com' },
      logout: vi.fn(),
    } as any);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Mes candidatures')).toBeInTheDocument();
    expect(screen.queryByText('Gérer les offres')).not.toBeInTheDocument();
  });

  it('affiche les liens admin pour un admin, pas "Mes candidatures"', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { _id: 'u2', nom: 'Admin', prenom: 'Test', role: 'admin', email: 'admin@test.com' },
      logout: vi.fn(),
    } as any);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Gérer les offres')).toBeInTheDocument();
    expect(screen.queryByText('Mes candidatures')).not.toBeInTheDocument();
  });
});