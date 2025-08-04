import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Enseignement } from '../Models/enseignant.model';

@Injectable({
  providedIn: 'root'
})
export class EnseignementService {
  private REST_API: string = 'http://127.0.0.1:8000/api/enseignements';
  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Créer un nouvel enseignement (lien enseignant-matiere-classe)
  createEnseignement(enseignement: Omit<Enseignement, 'id' | 'created_at' | 'updated_at' | 'classe' | 'matiere'>): Observable<Enseignement> {
    return this.httpClient.post<Enseignement>(this.REST_API, enseignement, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Récupérer les enseignements d'un enseignant
  getEnseignementsByEnseignant(enseignantId: number): Observable<Enseignement[]> {
    return this.httpClient.get<Enseignement[]>(`${this.REST_API}?enseignant_id=${enseignantId}`)
      .pipe(catchError(this.handleError));
  }

  // Supprimer un enseignement
  deleteEnseignement(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.REST_API}/${id}`, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
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
}
