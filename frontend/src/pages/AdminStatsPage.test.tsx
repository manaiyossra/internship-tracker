import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminStatsPage from './AdminStatsPage';
import { getStats } from '../api/stats';

vi.mock('../api/stats', () => ({ getStats: vi.fn() }));
vi.mock('../components/Navbar', () => ({ default: () => null }));

describe('AdminStatsPage', () => {
  it('affiche les statistiques après chargement', async () => {
    vi.mocked(getStats).mockResolvedValue({
      nbOffres: 8,
      nbCandidatures: 12,
      repartitionParStatut: { 'envoyée': 7, 'acceptée': 5 },
    });

    render(<AdminStatsPage />);

    expect(await screen.findByText('8')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('envoyée')).toBeInTheDocument();
  });

  it('affiche un message si aucune candidature ne compose la répartition', async () => {
    vi.mocked(getStats).mockResolvedValue({ nbOffres: 0, nbCandidatures: 0, repartitionParStatut: {} });

    render(<AdminStatsPage />);

    expect(await screen.findByText('Aucune candidature pour l\'instant.')).toBeInTheDocument();
  });

  it('affiche un message si les statistiques ne se chargent pas', async () => {
    vi.mocked(getStats).mockResolvedValue(null as any);

    render(<AdminStatsPage />);

    expect(await screen.findByText('Impossible de charger les statistiques.')).toBeInTheDocument();
  });
});