export interface Eleve {
  id: number;
  user_id: number;
  nom: string;
  prenom: string;
  date_naissance: Date;
  classe_id: number;
  parent_id: number;
  visible: boolean;
}
