import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Classe {
  id?: number;
  nom: string;
  niveau?: string;
  capacite?: number;
  annee_scolaire_id?: number;
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:8000/api/classes';

  constructor(private http: HttpClient) { }

  // Récupérer une classe par ID
  getById(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/${id}`);
  }

  // Récupérer toutes les classes
  getAll(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl);
  }

  // Créer une nouvelle classe
  create(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe);
  }

  // Mettre à jour une classe
  update(id: number, classe: Classe): Observable<Classe> {
    return this.http.put<Classe>(`${this.apiUrl}/${id}`, classe);
  }

  // Supprimer une classe
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Compter le nombre total de classes
  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
} 