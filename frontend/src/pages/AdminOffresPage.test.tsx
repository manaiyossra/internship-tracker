import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AdminOffresPage from './AdminOffresPage';
import { getOffres, createOffre, updateOffre, deleteOffre } from '../api/offres';

vi.mock('../api/offres', () => ({
  getOffres: vi.fn(), createOffre: vi.fn(), updateOffre: vi.fn(), deleteOffre: vi.fn(),
}));
vi.mock('../components/Navbar', () => ({ default: () => null }));

const sampleOffre = {
  _id: '1', titre: 'Dev Fullstack', entreprise: 'Acme', ville: 'Tunis',
  type: 'hybride', duree: 6, description: 'Mission.',
} as any;

describe('AdminOffresPage', () => {
  beforeEach(() => {
    vi.mocked(getOffres).mockReset();
    vi.mocked(createOffre).mockReset();
    vi.mocked(updateOffre).mockReset();
    vi.mocked(deleteOffre).mockReset();
    vi.mocked(getOffres).mockResolvedValue({ data: [sampleOffre], total: 1, totalPages: 1 } as any);
  });

  afterEach(() => vi.restoreAllMocks());

  it('affiche la liste des offres après chargement', async () => {
    render(<AdminOffresPage />);
    expect(await screen.findByText('Dev Fullstack')).toBeInTheDocument();
  });

  it('crée une nouvelle offre via le formulaire', async () => {
    vi.mocked(createOffre).mockResolvedValue({} as any);
    const user = userEvent.setup();
    render(<AdminOffresPage />);
    await screen.findByText('Dev Fullstack');

    await user.click(screen.getByText('+ Nouvelle offre'));
    await user.type(screen.getByLabelText('Entreprise'), 'NewCo');
    await user.type(screen.getByLabelText('Titre'), 'Stagiaire DevOps');
    await user.type(screen.getByLabelText('Description'), 'Description complète.');
    await user.type(screen.getByLabelText('Ville'), 'Sfax');
    await user.click(screen.getByText('Créer'));

    await waitFor(() =>
      expect(createOffre).toHaveBeenCalledWith({
        entreprise: 'NewCo', titre: 'Stagiaire DevOps', description: 'Description complète.',
        type: 'presentiel', duree: 1, ville: 'Sfax',
      })
    );
    expect(getOffres).toHaveBeenCalledTimes(2);
  });

  it("pré-remplit le formulaire en mode édition et appelle updateOffre", async () => {
    vi.mocked(updateOffre).mockResolvedValue({} as any);
    const user = userEvent.setup();
    render(<AdminOffresPage />);
    await screen.findByText('Dev Fullstack');

    await user.click(screen.getByText('Modifier'));
    expect(screen.getByLabelText('Entreprise')).toHaveValue('Acme');

    await user.clear(screen.getByLabelText('Titre'));
    await user.type(screen.getByLabelText('Titre'), 'Titre modifié');
    await user.click(screen.getByText('Modifier', { selector: 'button[type="submit"]' }));

    await waitFor(() =>
      expect(updateOffre).toHaveBeenCalledWith('1', expect.objectContaining({ titre: 'Titre modifié' }))
    );
  });

  it('demande confirmation puis appelle deleteOffre si confirmé', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(deleteOffre).mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminOffresPage />);
    await screen.findByText('Dev Fullstack');

    await user.click(screen.getByText('Supprimer'));

    await waitFor(() => expect(deleteOffre).toHaveBeenCalledWith('1'));
  });

  it("n'appelle pas deleteOffre si la confirmation est annulée", async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();
    render(<AdminOffresPage />);
    await screen.findByText('Dev Fullstack');

    await user.click(screen.getByText('Supprimer'));

    expect(deleteOffre).not.toHaveBeenCalled();
  });

  it('affiche une erreur si la création échoue', async () => {
    vi.mocked(createOffre).mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'Entreprise déjà utilisée' } },
    });
    const user = userEvent.setup();
    render(<AdminOffresPage />);
    await screen.findByText('Dev Fullstack');

    await user.click(screen.getByText('+ Nouvelle offre'));
    await user.type(screen.getByLabelText('Entreprise'), 'NewCo');
    await user.type(screen.getByLabelText('Titre'), 'Titre');
    await user.type(screen.getByLabelText('Description'), 'Desc');
    await user.type(screen.getByLabelText('Ville'), 'Sfax');
    await user.click(screen.getByText('Créer'));

    expect(await screen.findByText('Entreprise déjà utilisée')).toBeInTheDocument();
  });
});