import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MesCandidaturesPage from './MesCandidaturesPage';
import { getMesCandidatures } from '../api/candidatures';

vi.mock('../api/candidatures', () => ({ getMesCandidatures: vi.fn() }));
vi.mock('../components/Navbar', () => ({ default: () => null }));

describe('MesCandidaturesPage', () => {
  it('affiche la liste des candidatures avec leur statut', async () => {
    vi.mocked(getMesCandidatures).mockResolvedValue([
      { _id: '1', statut: 'entretien', offre: { _id: 'o1', titre: 'Dev Fullstack', entreprise: 'Acme', ville: 'Tunis' } } as any,
    ]);

    render(<MesCandidaturesPage />);

    expect(await screen.findByText('Dev Fullstack')).toBeInTheDocument();
    expect(screen.getByText('entretien')).toBeInTheDocument();
  });

  it("affiche un message si aucune candidature n'existe", async () => {
    vi.mocked(getMesCandidatures).mockResolvedValue([]);

    render(<MesCandidaturesPage />);

    expect(await screen.findByText("Tu n'as encore postulé à aucune offre.")).toBeInTheDocument();
  });
});