export interface Fichier {
  id?: number;
  nom: string;
  chemin: string;
  taille?: number;
  type_mime?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
} 