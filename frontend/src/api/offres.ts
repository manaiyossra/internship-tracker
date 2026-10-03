import apiClient from './client';
import type { OffresResponse, OffresFilters } from '../types';

export async function getOffres(filters: OffresFilters = {}): Promise<OffresResponse> {
  const response = await apiClient.get<OffresResponse>('/offres', { params: filters });
  return response.data;
}

export async function getOffre(id: string): Promise<Offre> {
  const response = await apiClient.get<Offre>(`/offres/${id}`);
  return response.data;
}

export interface OffreInput {
  entreprise: string;
  titre: string;
  description: string;
  type: OffreType;
  duree: number;
  ville: string;
}

export async function createOffre(data: OffreInput): Promise<Offre> {
  const response = await apiClient.post<Offre>('/offres', data);
  return response.data;
}

export async function updateOffre(id: string, data: Partial<OffreInput>): Promise<Offre> {
  const response = await apiClient.patch<Offre>(`/offres/${id}`, data);
  return response.data;
}

export async function deleteOffre(id: string): Promise<void> {
  await apiClient.delete(`/offres/${id}`);
}