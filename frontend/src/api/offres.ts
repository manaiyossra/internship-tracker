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