import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import apiClient from '../api/client';

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    if (token) {
      fetchMe().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}