import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  nom: string;
  email: string;
  mot_de_passe: string;
  role: 'admin' | 'enseignant' | 'parent' | 'eleve';
  photo_profil?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Eleve {
  id?: number;
  user_id: number;
  nom: string;
  prenom: string;
  date_naissance?: string;
  classe_id?: number | null;
  parent_id?: number | null;
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    email: string;
    role: string;
    is_active: boolean;
  };
}

export interface CreateEleveRequest {
  user: User;
  eleve: Omit<Eleve, 'user_id'>;
}

@Injectable({
  providedIn: 'root'
})
export class EleveService {
  private apiUrl = 'http://localhost:8000/api/eleves';
  private usersApiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) { }

  // Récupérer tous les élèves
  getAll(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(this.apiUrl);
  }

  // Récupérer un élève par ID
  getById(id: number): Observable<Eleve> {
    return this.http.get<Eleve>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouvel élève (avec utilisateur)
  create(createRequest: CreateEleveRequest): Observable<Eleve> {
    return this.http.post<Eleve>(`${this.apiUrl}/with-user`, createRequest);
  }

  // Mettre à jour un élève
  update(id: number, eleve: Eleve): Observable<Eleve> {
    return this.http.put<Eleve>(`${this.apiUrl}/${id}`, eleve);
  }

  // Supprimer un élève
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Récupérer tous les utilisateurs avec rôle 'eleve'
  getUsersWithRoleEleve(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersApiUrl}?role=eleve`);
  }

  // Compter le nombre total d'élèves
  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
} 