import { describe, it, expect, beforeEach } from 'vitest';
import apiClient, { API_BASE_URL } from './client';

describe('api/client', () => {
  beforeEach(() => localStorage.clear());

  it("expose l'URL de base correcte", () => {
    expect(API_BASE_URL).toBe('http://localhost:3000');
    expect(apiClient.defaults.baseURL).toBe('http://localhost:3000');
  });

  it("ajoute l'en-tête Authorization si un token est présent", () => {
    localStorage.setItem('token', 'mon-token');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (apiClient.interceptors.request as any).handlers[0].fulfilled;
    const config = handler({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer mon-token');
  });

  it("n'ajoute pas l'en-tête Authorization si aucun token n'est présent", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (apiClient.interceptors.request as any).handlers[0].fulfilled;
    const config = handler({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });
});