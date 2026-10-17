import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OffreDetailPage from './OffreDetailPage';
import { getOffre } from '../api/offres';
import { postuler } from '../api/candidatures';
import { useAuth } from '../context/AuthContext';

vi.mock('../api/offres', () => ({ getOffre: vi.fn() }));
vi.mock('../api/candidatures', () => ({ postuler: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useParams: () => ({ id: 'offre1' }) };
});

const sampleOffre = {
  _id: 'offre1', titre: 'Dev Fullstack', entreprise: 'Acme', ville: 'Tunis',
  type: 'hybride', duree: 6, description: 'Mission passionnante.',
} as any;

describe('OffreDetailPage', () => {
  beforeEach(() => {
    vi.mocked(getOffre).mockReset();
    vi.mocked(postuler).mockReset();
    vi.mocked(useAuth).mockReset();
  });

  it("affiche les détails de l'offre après chargement", async () => {
    vi.mocked(getOffre).mockResolvedValue(sampleOffre);
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'candidat' } } as any);

    render(<OffreDetailPage />, { wrapper: MemoryRouter });

    expect(await screen.findByText('Dev Fullstack')).toBeInTheDocument();
  });

  it('affiche un message si l\'offre est introuvable', async () => {
    vi.mocked(getOffre).mockResolvedValue(undefined as any);
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'candidat' } } as any);

    render(<OffreDetailPage />, { wrapper: MemoryRouter });

    expect(await screen.findByText('Offre introuvable.')).toBeInTheDocument();
  });

  it("le bouton Postuler n'est pas affiché pour un admin", async () => {
    vi.mocked(getOffre).mockResolvedValue(sampleOffre);
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'admin' } } as any);

    render(<OffreDetailPage />, { wrapper: MemoryRouter });

    await screen.findByText('Dev Fullstack');
    expect(screen.queryByText('Postuler')).not.toBeInTheDocument();
  });

  it('postuler envoie la candidature et désactive le bouton après succès', async () => {
    vi.mocked(getOffre).mockResolvedValue(sampleOffre);
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'candidat' } } as any);
    vi.mocked(postuler).mockResolvedValue({} as any);
    const user = userEvent.setup();

    render(<OffreDetailPage />, { wrapper: MemoryRouter });
    await user.click(await screen.findByText('Postuler'));

    expect(await screen.findByText('Candidature envoyée avec succès !')).toBeInTheDocument();
    expect(screen.getByText('Postuler')).toBeDisabled();
  });

  it('affiche le message d\'erreur backend (ex: CV manquant) si la candidature échoue', async () => {
    vi.mocked(getOffre).mockResolvedValue(sampleOffre);
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'candidat' } } as any);
    vi.mocked(postuler).mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'Vous devez uploader un CV avant de postuler' } },
    });
    const user = userEvent.setup();

    render(<OffreDetailPage />, { wrapper: MemoryRouter });
    await user.click(await screen.findByText('Postuler'));

    expect(await screen.findByText('Vous devez uploader un CV avant de postuler')).toBeInTheDocument();
  });
});