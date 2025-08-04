import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Classe } from '../Models/classe.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:8000/api/classes';

  constructor(private http: HttpClient) { }

  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  // Récupérer toutes les classes
  getClasses(): Observable<Classe[]> {
    console.log('Appel API vers:', this.apiUrl);
    return this.http.get<Classe[]>(this.apiUrl, { headers: this.httpHeaders })
      .pipe(
        catchError(error => {
          console.error('Erreur dans classeService.getClasses():', error);
          return this.handleError(error);
        })
      );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
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
