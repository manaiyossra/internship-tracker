import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './client';
import { postuler, getMesCandidatures } from './candidatures';

vi.mock('./client', () => ({ default: { get: vi.fn(), post: vi.fn() } }));
const mocked = apiClient as unknown as Record<'get' | 'post', ReturnType<typeof vi.fn>>;

describe('api/candidatures', () => {
  beforeEach(() => {
    mocked.get.mockReset();
    mocked.post.mockReset();
  });

  it('postuler envoie offre et notes', async () => {
    mocked.post.mockResolvedValue({ data: { _id: '1' } });
    await postuler('offre1', 'motivée');
    expect(mocked.post).toHaveBeenCalledWith('/candidatures', { offre: 'offre1', notes: 'motivée' });
  });

  it('postuler fonctionne sans notes', async () => {
    mocked.post.mockResolvedValue({ data: { _id: '1' } });
    await postuler('offre1');
    expect(mocked.post).toHaveBeenCalledWith('/candidatures', { offre: 'offre1', notes: undefined });
  });

  it('getMesCandidatures récupère la liste', async () => {
    mocked.get.mockResolvedValue({ data: [] });
    await getMesCandidatures();
    expect(mocked.get).toHaveBeenCalledWith('/candidatures/mes-candidatures');
  });
});