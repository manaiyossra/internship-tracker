import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
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

describe('LoginPage', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
    vi.mocked(useAuth).mockReturnValue({ login: mockLogin } as any);
  });

  it('appelle login avec les valeurs saisies et redirige vers / en cas de succès', async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse123');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'motdepasse123');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('affiche le message d\'erreur renvoyé par le backend en cas d\'échec', async () => {
    mockLogin.mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'Email ou mot de passe incorrect' } },
    });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'mauvais');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByText('Email ou mot de passe incorrect')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});