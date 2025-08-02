import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Eleve } from '../Models/eleve.model';

@Injectable({
  providedIn: 'root'
})
export class EleveService {

  private REST_API: string = 'http://127.0.0.1:8000/api/eleves';
  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Ajouter un eleve
  addEleve(data: Eleve): Observable<any> {
    return this.httpClient.post(this.REST_API, data)
      .pipe(catchError(this.handleError));
  }

  // Recuperer tous les eleves
  getEleves(): Observable<any> {
    return this.httpClient.get(this.REST_API)
      .pipe(catchError(this.handleError));
  }

  // Recuperer un eleve par ID
  getEleve(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(
        map((res: any) => res || {}),
        catchError(this.handleError)
      );
  }

  // Mettre a jour un eleve
  updateEleve(id: any, data: Eleve): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.put(API_URL, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Supprimer un eleve
  deleteEleve(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.delete(API_URL, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Recuperer les eleves par classe
  getElevesByClasse(classeId: any): Observable<any> {
    const API_URL = `${this.REST_API}?classe_id=${classeId}`;
    return this.httpClient.get(API_URL)
      .pipe(catchError(this.handleError));
  }

  // Recuperer les eleves par parent
  getElevesByParent(parentId: any): Observable<any> {
    const API_URL = `${this.REST_API}?parent_id=${parentId}`;
    return this.httpClient.get(API_URL)
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
