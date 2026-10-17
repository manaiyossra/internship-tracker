import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './client';
import { getStats } from './stats';

vi.mock('./client', () => ({ default: { get: vi.fn() } }));
const mocked = apiClient as unknown as Record<'get', ReturnType<typeof vi.fn>>;

describe('api/stats', () => {
  beforeEach(() => mocked.get.mockReset());

  it('getStats récupère les statistiques admin', async () => {
    const stats = { nbOffres: 5, nbCandidatures: 10, repartitionParStatut: {} };
    mocked.get.mockResolvedValue({ data: stats });
    const result = await getStats();
    expect(mocked.get).toHaveBeenCalledWith('/stats/admin');
    expect(result).toEqual(stats);
  });
});