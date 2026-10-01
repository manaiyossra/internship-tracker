export type UserRole = 'candidat' | 'admin';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  nom: string;
  prenom: string;
  telephone?: string;
  cvUrl?: string;
  lettreMotivationUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type OffreType = 'presentiel' | 'hybride' | 'distanciel';

export interface Offre {
  _id: string;
  entreprise: string;
  titre: string;
  description: string;
  type: OffreType;
  duree: number;
  ville: string;
  createdAt: string;
  updatedAt: string;
}

export type StatutCandidature = 'envoyée' | 'entretien' | 'acceptée' | 'refusée';

export interface Candidature {
  _id: string;
  utilisateur: string | User;
  offre: string | Offre;
  statut: StatutCandidature;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OffresResponse {
  data: Offre[];
  total: number;
  page: number;
  totalPages: number;
}

export interface OffresFilters {
  type?: OffreType;
  duree?: string;
  ville?: string;
  page?: number;
  limit?: number;
}