import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Parent {
  id?: number;
  user_id: number;
  telephone?: string;
  adresse?: string;
  created_at?: string;
  updated_at?: string;
  // Relations
  user?: {
    id: number;
    nom: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private apiUrl = 'http://localhost:8000/api/parents';

  constructor(private http: HttpClient) { }

  // Récupérer tous les parents
  getAll(): Observable<Parent[]> {
    return this.http.get<Parent[]>(this.apiUrl);
  }

  // Récupérer un parent par ID
  getById(id: number): Observable<Parent> {
    return this.http.get<Parent>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau parent
  create(parent: Parent): Observable<Parent> {
    return this.http.post<Parent>(this.apiUrl, parent);
  }

  // Mettre à jour un parent
  update(id: number, parent: Parent): Observable<Parent> {
    return this.http.put<Parent>(`${this.apiUrl}/${id}`, parent);
  }

  // Supprimer un parent
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Compter le nombre total de parents
  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
} 