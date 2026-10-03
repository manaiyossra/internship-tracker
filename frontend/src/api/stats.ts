import apiClient from './client';

export interface Stats {
  nbOffres: number;
  nbCandidatures: number;
  repartitionParStatut: Record<string, number>;
}

export async function getStats(): Promise<Stats> {
  const response = await apiClient.get<Stats>('/stats/admin');
  return response.data;
}