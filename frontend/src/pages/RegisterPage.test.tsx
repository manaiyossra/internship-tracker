import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterPage from './RegisterPage';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterPage', () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    mockRegister.mockReset();
    mockNavigate.mockReset();
    vi.mocked(useAuth).mockReturnValue({ register: mockRegister } as any);
  });

  it('appelle register avec les valeurs saisies et redirige vers / en cas de succès', async () => {
    mockRegister.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Prénom'), 'Yossra');
    await user.type(screen.getByLabelText('Nom'), 'Manai');
    await user.type(screen.getByLabelText('Email'), 'yossra@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse123');
    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    expect(mockRegister).toHaveBeenCalledWith({
      email: 'yossra@test.com',
      password: 'motdepasse123',
      nom: 'Manai',
      prenom: 'Yossra',
      telephone: undefined,
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('affiche le message d\'erreur réel du backend (ex: mot de passe trop court), pas un message générique', async () => {
    mockRegister.mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'password must be longer than or equal to 8 characters' } },
    });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Prénom'), 'Yossra');
    await user.type(screen.getByLabelText('Nom'), 'Manai');
    await user.type(screen.getByLabelText('Email'), 'yossra@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'court');
    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    expect(
      await screen.findByText('password must be longer than or equal to 8 characters'),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});