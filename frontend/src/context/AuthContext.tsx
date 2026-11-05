import { useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import apiClient from '../api/client';
import { AuthContext, type RegisterData } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchMe() {
    try {
      const response = await apiClient.get<User>('/users/me');
      setUser(response.data);
    } catch {
      setUser(null);
      localStorage.removeItem('token');
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    /* eslint-disable react-hooks/set-state-in-effect -- pattern classique de chargement initial au montage ; une vraie conformité nécessiterait une librairie de data-fetching (ex. TanStack Query), jugée hors scope pour ce projet */
    if (token) {
      fetchMe().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  async function login(email: string, password: string) {
    const response = await apiClient.post<{ access_token: string }>('/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    await fetchMe();
  }

  async function register(data: RegisterData) {
    await apiClient.post('/auth/register', data);
    await login(data.email, data.password);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}