import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import apiClient from '../api/client';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApiClient = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

function TestConsumer() {
  const { user, isLoading, login, register, logout } = useAuth();
  return (
    <div>
      <p data-testid="loading">{isLoading ? 'loading' : 'done'}</p>
      <p data-testid="user">{user ? user.email : 'none'}</p>
      <button onClick={() => login('test@test.com', 'password123')}>Login</button>
      <button
        onClick={() =>
          register({ email: 'new@test.com', password: 'password123', nom: 'Doe', prenom: 'John' })
        }
      >
        Register
      </button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedApiClient.get.mockReset();
    mockedApiClient.post.mockReset();
  });

  it('sans token au démarrage : isLoading passe à false, aucun appel à /users/me', async () => {
    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('done'));

    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(mockedApiClient.get).not.toHaveBeenCalled();
  });

  it("avec un token valide en localStorage, charge automatiquement l'utilisateur via /users/me", async () => {
    localStorage.setItem('token', 'fake-token');
    mockedApiClient.get.mockResolvedValue({
      data: { email: 'test@test.com', nom: 'Test', prenom: 'User', role: 'candidat' },
    });

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('test@test.com'));
    expect(mockedApiClient.get).toHaveBeenCalledWith('/users/me');
  });

  it('si le token est invalide, il est supprimé et user reste null', async () => {
    localStorage.setItem('token', 'bad-token');
    mockedApiClient.get.mockRejectedValue(new Error('401'));

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('done'));

    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it("login : stocke le token puis charge l'utilisateur", async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: { access_token: 'abc123' } });
    mockedApiClient.get.mockResolvedValueOnce({
      data: { email: 'test@test.com', nom: 'Test', prenom: 'User', role: 'candidat' },
    });
    const user = userEvent.setup();

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('done'));

    await user.click(screen.getByText('Login'));

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('test@test.com'));
    expect(localStorage.getItem('token')).toBe('abc123');
    expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      password: 'password123',
    });
  });

  it('register : appelle /auth/register puis se connecte automatiquement', async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: {} });
    mockedApiClient.post.mockResolvedValueOnce({ data: { access_token: 'xyz789' } });
    mockedApiClient.get.mockResolvedValueOnce({
      data: { email: 'new@test.com', nom: 'Doe', prenom: 'John', role: 'candidat' },
    });
    const user = userEvent.setup();

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('done'));

    await user.click(screen.getByText('Register'));

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('new@test.com'));
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(1, '/auth/register', {
      email: 'new@test.com',
      password: 'password123',
      nom: 'Doe',
      prenom: 'John',
    });
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(2, '/auth/login', {
      email: 'new@test.com',
      password: 'password123',
    });
  });

  it('logout : supprime le token et réinitialise user à null', async () => {
    localStorage.setItem('token', 'fake-token');
    mockedApiClient.get.mockResolvedValue({
      data: { email: 'test@test.com', nom: 'Test', prenom: 'User', role: 'candidat' },
    });
    const user = userEvent.setup();

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('test@test.com'));

    await user.click(screen.getByText('Logout'));

    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it("useAuth lève une erreur si utilisé hors d'un AuthProvider", () => {
    function BrokenConsumer() {
      useAuth();
      return null;
    }
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<BrokenConsumer />)).toThrow(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );

    consoleError.mockRestore();
  });
});