import apiClient from './client';
import type { Candidature, Offre } from '../types';

export type CandidatureWithOffre = Omit<Candidature, 'offre'> & { offre: Offre };

export async function postuler(offre: string, notes?: string): Promise<Candidature> {
  const response = await apiClient.post<Candidature>('/candidatures', { offre, notes });
  return response.data;
}

export async function getMesCandidatures(): Promise<CandidatureWithOffre[]> {
  const response = await apiClient.get<CandidatureWithOffre[]>('/candidatures/mes-candidatures');
  return response.data;
}