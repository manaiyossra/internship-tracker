import apiClient from './client';
import type { User } from '../types';

export interface UpdateMeData {
  nom?: string;
  prenom?: string;
  telephone?: string;
}

export async function updateMe(data: UpdateMeData): Promise<User> {
  const response = await apiClient.patch<User>('/users/me', data);
  return response.data;
}

export async function uploadCv(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<User>('/users/me/cv', formData);
  return response.data;
}

export async function uploadLettreMotivation(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<User>('/users/me/lettre-motivation', formData);
  return response.data;
}