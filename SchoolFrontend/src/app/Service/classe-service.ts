import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe } from '../Models/classe.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:8000/api/classes';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les classes
  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl);
  }

  // Récupérer une classe par ID
  getClasse(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle classe
  createClasse(classe: Omit<Classe, 'id'>): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe);
  }

  // Mettre à jour une classe
  updateClasse(id: number, classe: Partial<Classe>): Observable<Classe> {
    return this.http.put<Classe>(`${this.apiUrl}/${id}`, classe);
  }

  // Supprimer une classe
  deleteClasse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les classes par année scolaire
  getClassesByAnnee(anneeId: number): Observable<Classe[]> {
    return this.http.get<Classe[]>(`${this.apiUrl}?annee_scolaire_id=${anneeId}`);
  }
}
