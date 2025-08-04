import { Classe } from './classe.model';
import { Matiere } from './matiere.model';

export interface Enseignement {
  id: number;
  enseignant_id: number;
  classe_id: number;
  matiere_id: number;
  created_at: string;
  updated_at: string;
  classe?: Classe;
  matiere?: Matiere;
}

export interface Enseignant {
  id: number;
  user_id: number | null;
  nom_complet: string;
  enseignements?: Enseignement[];
}
