import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OffresListPage from './OffresListPage';
import { getOffres } from '../api/offres';

vi.mock('../api/offres', () => ({ getOffres: vi.fn() }));
vi.mock('../components/Navbar', () => ({ default: () => null }));

const sampleOffre = { _id: '1', titre: 'Dev Fullstack', entreprise: 'Acme', ville: 'Tunis', type: 'hybride', duree: 6 } as any;

describe('OffresListPage', () => {
  beforeEach(() => {
    vi.mocked(getOffres).mockReset();
    vi.mocked(getOffres).mockResolvedValue({ data: [sampleOffre], total: 1, totalPages: 1 } as any);
  });

  it('affiche la liste des offres après chargement', async () => {
    render(<OffresListPage />, { wrapper: MemoryRouter });
    expect(await screen.findByText('Dev Fullstack')).toBeInTheDocument();
  });

  it("affiche un message si aucune offre ne correspond", async () => {
    vi.mocked(getOffres).mockResolvedValue({ data: [], total: 0, totalPages: 1 } as any);
    render(<OffresListPage />, { wrapper: MemoryRouter });
    expect(await screen.findByText('Aucune offre trouvée.')).toBeInTheDocument();
  });

  it('relance la recherche quand un filtre de type est sélectionné', async () => {
    const user = userEvent.setup();
    render(<OffresListPage />, { wrapper: MemoryRouter });
    await screen.findByText('Dev Fullstack');

    await user.selectOptions(screen.getByLabelText('Filtrer par type de stage'), 'hybride');

    await waitFor(() =>
      expect(getOffres).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'hybride', page: 1 }))
    );
  });

  it('relance la recherche par ville via le formulaire', async () => {
    const user = userEvent.setup();
    render(<OffresListPage />, { wrapper: MemoryRouter });
    await screen.findByText('Dev Fullstack');

    await user.type(screen.getByPlaceholderText('Ville'), 'Sousse');
    await user.click(screen.getByText('Rechercher'));

    await waitFor(() =>
      expect(getOffres).toHaveBeenLastCalledWith(expect.objectContaining({ ville: 'Sousse', page: 1 }))
    );
  });

  it('la pagination change de page et désactive les boutons aux bornes', async () => {
    vi.mocked(getOffres).mockResolvedValue({ data: [sampleOffre], total: 25, totalPages: 3 } as any);
    const user = userEvent.setup();
    render(<OffresListPage />, { wrapper: MemoryRouter });
    await screen.findByText('Dev Fullstack');

    expect(screen.getByText('Précédent')).toBeDisabled();
    expect(screen.getByText('Suivant')).not.toBeDisabled();

    await user.click(screen.getByText('Suivant'));

    await waitFor(() => expect(getOffres).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })));
  });
});