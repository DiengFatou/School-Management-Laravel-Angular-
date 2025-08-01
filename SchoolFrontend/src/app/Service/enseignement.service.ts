import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Enseignement } from '../Models/enseignement';

@Injectable({
  providedIn: 'root'
})
export class EnseignementService {

  private REST_API: string = 'http://127.0.0.1:8000/api/enseignements';
  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Ajouter un enseignement
  addEnseignement(data: Enseignement): Observable<any> {
    return this.httpClient.post(this.REST_API, data)
      .pipe(catchError(this.handleError));
  }

  // Recuperer tous les enseignements
  getEnseignements(): Observable<any> {
    return this.httpClient.get(this.REST_API)
      .pipe(catchError(this.handleError));
  }

  // Recuperer un enseignement par ID
  getEnseignement(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(
        map((res: any) => res || {}),
        catchError(this.handleError)
      );
  }

  // Mettre a jour un enseignement
  updateEnseignement(id: any, data: Enseignement): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.put(API_URL, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Supprimer un enseignement
  deleteEnseignement(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.delete(API_URL, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
