import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, tap, map } from 'rxjs';
import { Matiere } from '../Models/matiere.model';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  private REST_API: string = 'http://127.0.0.1:8000/api/matieres';
  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Récupérer toutes les matières
  getMatieres(): Observable<Matiere[]> {
    console.log('Appel API vers:', this.REST_API);
    return this.httpClient.get<Matiere[]>(this.REST_API, { 
      headers: this.httpHeaders
    }).pipe(
      tap((matieres: Matiere[]) => {
        console.log('Réponse de l\'API matieres:', matieres);
        if (Array.isArray(matieres)) {
          console.log('Nombre de matières reçues:', matieres.length);
          if (matieres.length > 0) {
            console.log('Première matière reçue:', matieres[0]);
            console.log('Propriétés de la première matière:', Object.keys(matieres[0]));
          }
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau:', matieres);
        }
      }),
        catchError(error => {
          console.error('Erreur dans matiereService.getMatieres():', error);
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
}
