import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AnneeScolaire } from '../Models/annee-scolaire';

@Injectable({
  providedIn: 'root'
})
export class AnneeScolaireService {

  private REST_API: string = 'http://127.0.0.1:8000/api/annee-scolaires';
  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Ajouter une annee scolaire
  addAnneeScolaire(data: AnneeScolaire): Observable<any> {
    return this.httpClient.post(this.REST_API, data)
      .pipe(catchError(this.handleError));
  }

  // Recuperer toutes les années scolaires
  getAnneesScolaires(): Observable<any> {
    return this.httpClient.get(this.REST_API)
      .pipe(catchError(this.handleError));
  }

  // Recuperer une annee scolaire par son ID
  getAnneeScolaire(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(
        map((res: any) => res || {}),
        catchError(this.handleError)
      );
  }

  // Mettre a jour une annee scolaire
  updateAnneeScolaire(id: any, data: AnneeScolaire): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.put(API_URL, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Supprimer une annee scolaire
  deleteAnneeScolaire(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.delete(API_URL, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erreur cote client
      errorMessage = error.error.message;
    } else {
      // Erreur cote serveur
      errorMessage = `Error code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
