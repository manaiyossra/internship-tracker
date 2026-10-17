import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './client';
import { updateMe, uploadCv, uploadLettreMotivation } from './users';

vi.mock('./client', () => ({ default: { patch: vi.fn(), post: vi.fn() } }));
const mocked = apiClient as unknown as Record<'patch' | 'post', ReturnType<typeof vi.fn>>;

describe('api/users', () => {
  beforeEach(() => {
    mocked.patch.mockReset();
    mocked.post.mockReset();
  });

  it('updateMe envoie un patch avec les champs modifiés', async () => {
    mocked.patch.mockResolvedValue({ data: {} });
    await updateMe({ nom: 'Dupont' });
    expect(mocked.patch).toHaveBeenCalledWith('/users/me', { nom: 'Dupont' });
  });

  it('uploadCv envoie le fichier dans un FormData', async () => {
    const file = new File(['contenu'], 'cv.pdf', { type: 'application/pdf' });
    mocked.post.mockResolvedValue({ data: {} });
    await uploadCv(file);
    expect(mocked.post).toHaveBeenCalledWith('/users/me/cv', expect.any(FormData));
    const sent = mocked.post.mock.calls[0][1] as FormData;
    expect(sent.get('file')).toBe(file);
  });

  it('uploadLettreMotivation envoie le fichier vers le bon endpoint', async () => {
    const file = new File(['contenu'], 'lettre.pdf', { type: 'application/pdf' });
    mocked.post.mockResolvedValue({ data: {} });
    await uploadLettreMotivation(file);
    expect(mocked.post).toHaveBeenCalledWith('/users/me/lettre-motivation', expect.any(FormData));
  });
});