import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './client';
import { getOffres, getOffre, createOffre, updateOffre, deleteOffre } from './offres';

vi.mock('./client', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const mocked = apiClient as unknown as Record<'get' | 'post' | 'patch' | 'delete', ReturnType<typeof vi.fn>>;

describe('api/offres', () => {
  beforeEach(() => {
    mocked.get.mockReset();
    mocked.post.mockReset();
    mocked.patch.mockReset();
    mocked.delete.mockReset();
  });

  it('getOffres transmet les filtres en paramètres', async () => {
    mocked.get.mockResolvedValue({ data: { data: [], total: 0, totalPages: 1 } });
    await getOffres({ type: 'hybride', page: 2 });
    expect(mocked.get).toHaveBeenCalledWith('/offres', { params: { type: 'hybride', page: 2 } });
  });

  it('getOffre récupère une offre par id', async () => {
    mocked.get.mockResolvedValue({ data: { _id: '1' } });
    const result = await getOffre('1');
    expect(mocked.get).toHaveBeenCalledWith('/offres/1');
    expect(result).toEqual({ _id: '1' });
  });

  it('createOffre poste les données', async () => {
    const input = { entreprise: 'A', titre: 'B', description: 'C', type: 'presentiel' as const, duree: 1, ville: 'Tunis' };
    mocked.post.mockResolvedValue({ data: { _id: '1', ...input } });
    await createOffre(input);
    expect(mocked.post).toHaveBeenCalledWith('/offres', input);
  });

  it('updateOffre envoie un patch', async () => {
    mocked.patch.mockResolvedValue({ data: { _id: '1' } });
    await updateOffre('1', { titre: 'Nouveau' });
    expect(mocked.patch).toHaveBeenCalledWith('/offres/1', { titre: 'Nouveau' });
  });

  it('deleteOffre appelle delete avec le bon id', async () => {
    mocked.delete.mockResolvedValue({});
    await deleteOffre('1');
    expect(mocked.delete).toHaveBeenCalledWith('/offres/1');
  });
});