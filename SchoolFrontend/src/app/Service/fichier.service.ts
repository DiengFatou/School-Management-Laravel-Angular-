import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Fichier } from '../Models/fichier.model';

@Injectable({
  providedIn: 'root'
})
export class FichierService {

  private REST_API: string = 'http://127.0.0.1:8000/api/fichiers';
  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Ajouter un fichier
  addFichier(data: Fichier): Observable<any> {
    return this.httpClient.post(this.REST_API, data)
      .pipe(catchError(this.handleError));
  }

  // Recuperer tous les fichiers
  getFichiers(): Observable<any> {
    return this.httpClient.get(this.REST_API)
      .pipe(catchError(this.handleError));
  }

  // Recuperer un fichier par ID
  getFichier(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(
        map((res: any) => res || {}),
        catchError(this.handleError)
      );
  }

  // Mettre a jour un fichier
  updateFichier(id: any, data: Fichier): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.put(API_URL, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Supprimer un fichier
  deleteFichier(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.delete(API_URL, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Recuperer les fichiers par type MIME
  getFichiersByType(typeMime: string): Observable<any> {
    const API_URL = `${this.REST_API}?type_mime=${typeMime}`;
    return this.httpClient.get(API_URL)
      .pipe(catchError(this.handleError));
  }

  // Upload de fichier
  uploadFichier(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.httpClient.post(`${this.REST_API}/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  // Telecharger un fichier
  downloadFichier(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}/download`;
    return this.httpClient.get(API_URL, { responseType: 'blob' })
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