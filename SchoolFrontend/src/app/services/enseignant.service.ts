import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Enseignant {
  id?: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  specialite?: string;
  date_embauche?: string;
  salaire?: number;
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private apiUrl = 'http://localhost:8000/api/enseignants';

  constructor(private http: HttpClient) { }

  // Récupérer tous les enseignants
  getAll(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.apiUrl);
  }

  // Récupérer un enseignant par ID
  getById(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouvel enseignant
  create(enseignant: Enseignant): Observable<Enseignant> {
    return this.http.post<Enseignant>(this.apiUrl, enseignant);
  }

  // Mettre à jour un enseignant
  update(id: number, enseignant: Enseignant): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.apiUrl}/${id}`, enseignant);
  }

  // Supprimer un enseignant
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Compter le nombre total d'enseignants
  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
} 