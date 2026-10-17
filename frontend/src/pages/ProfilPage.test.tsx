import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfilPage from './ProfilPage';
import { updateMe, uploadCv, uploadLettreMotivation } from '../api/users';
import { useAuth } from '../context/AuthContext';

vi.mock('../api/users', () => ({ updateMe: vi.fn(), uploadCv: vi.fn(), uploadLettreMotivation: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

const baseUser = { nom: 'Dupont', prenom: 'Jean', telephone: '12345678', role: 'candidat', email: 'jean@test.com' };

describe('ProfilPage', () => {
  beforeEach(() => {
    vi.mocked(updateMe).mockReset();
    vi.mocked(uploadCv).mockReset();
    vi.mocked(useAuth).mockReset();
    vi.mocked(useAuth).mockReturnValue({ user: baseUser, refreshUser: vi.fn() } as any);
  });

  it("pré-remplit le formulaire avec les informations de l'utilisateur", () => {
    render(<ProfilPage />, { wrapper: MemoryRouter });
    expect(screen.getByLabelText('Prénom')).toHaveValue('Jean');
    expect(screen.getByLabelText('Nom')).toHaveValue('Dupont');
  });

  it('sauvegarde les informations modifiées et affiche un message de succès', async () => {
    const refreshUser = vi.fn();
    vi.mocked(useAuth).mockReturnValue({ user: baseUser, refreshUser } as any);
    vi.mocked(updateMe).mockResolvedValue({} as any);
    const user = userEvent.setup();

    render(<ProfilPage />, { wrapper: MemoryRouter });
    await user.clear(screen.getByLabelText('Prénom'));
    await user.type(screen.getByLabelText('Prénom'), 'Jean-Marc');
    await user.click(screen.getByText('Enregistrer'));

    expect(await screen.findByText('Profil mis à jour avec succès.')).toBeInTheDocument();
    expect(updateMe).toHaveBeenCalledWith({ nom: 'Dupont', prenom: 'Jean-Marc', telephone: '12345678' });
    expect(refreshUser).toHaveBeenCalled();
  });

  it('affiche un message d\'erreur si la sauvegarde échoue', async () => {
    vi.mocked(updateMe).mockRejectedValue(new Error('fail'));
    const user = userEvent.setup();

    render(<ProfilPage />, { wrapper: MemoryRouter });
    await user.click(screen.getByText('Enregistrer'));

    expect(await screen.findByText('Erreur lors de la mise à jour.')).toBeInTheDocument();
  });

  it("le bloc Documents n'apparaît que pour un candidat", () => {
    vi.mocked(useAuth).mockReturnValue({ user: { ...baseUser, role: 'admin' }, refreshUser: vi.fn() } as any);
    render(<ProfilPage />, { wrapper: MemoryRouter });
    expect(screen.queryByText('Documents')).not.toBeInTheDocument();
  });

  it('uploader un CV appelle uploadCv avec le fichier sélectionné', async () => {
    const refreshUser = vi.fn();
    vi.mocked(useAuth).mockReturnValue({ user: baseUser, refreshUser } as any);
    vi.mocked(uploadCv).mockResolvedValue({} as any);
    const file = new File(['contenu'], 'cv.pdf', { type: 'application/pdf' });
    const user = userEvent.setup();

    render(<ProfilPage />, { wrapper: MemoryRouter });
    await user.upload(screen.getByLabelText('CV'), file);

    expect(uploadCv).toHaveBeenCalledWith(file);
    expect(refreshUser).toHaveBeenCalled();
  });

  it('affiche les liens vers les fichiers existants si disponibles', () => {
  vi.mocked(useAuth).mockReturnValue({
    user: { ...baseUser, cvUrl: '/uploads/cv.pdf', lettreMotivationUrl: '/uploads/lettre.pdf' },
    refreshUser: vi.fn(),
  } as any);

  render(<ProfilPage />, { wrapper: MemoryRouter });

  const links = screen.getAllByText('Voir le fichier actuel');
  expect(links).toHaveLength(2);
  expect(links[0]).toHaveAttribute('href', 'http://localhost:3000/uploads/cv.pdf');
  expect(links[1]).toHaveAttribute('href', 'http://localhost:3000/uploads/lettre.pdf');
});

it('uploader une lettre de motivation appelle uploadLettreMotivation avec le fichier sélectionné', async () => {
  const refreshUser = vi.fn();
  vi.mocked(useAuth).mockReturnValue({ user: baseUser, refreshUser } as any);
  vi.mocked(uploadLettreMotivation).mockResolvedValue({} as any);
  const file = new File(['contenu'], 'lettre.pdf', { type: 'application/pdf' });
  const user = userEvent.setup();

  render(<ProfilPage />, { wrapper: MemoryRouter });
  await user.upload(screen.getByLabelText('Lettre de motivation'), file);

  expect(uploadLettreMotivation).toHaveBeenCalledWith(file);
  expect(refreshUser).toHaveBeenCalled();
});

});