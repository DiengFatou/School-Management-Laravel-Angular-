import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LogConnexion } from '../Models/log-connexion.model';

@Injectable({
  providedIn: 'root'
})
export class LogConnexionService {

  private REST_API: string = 'http://127.0.0.1:8000/api/log-connexions';
  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Ajouter un log de connexion
  addLogConnexion(data: LogConnexion): Observable<any> {
    return this.httpClient.post(this.REST_API, data)
      .pipe(catchError(this.handleError));
  }

  // Recuperer tous les logs de connexion
  getLogConnexions(): Observable<any> {
    return this.httpClient.get(this.REST_API)
      .pipe(catchError(this.handleError));
  }

  // Recuperer un log de connexion par ID
  getLogConnexion(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(
        map((res: any) => res || {}),
        catchError(this.handleError)
      );
  }

  // Mettre a jour un log de connexion
  updateLogConnexion(id: any, data: LogConnexion): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.put(API_URL, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Supprimer un log de connexion
  deleteLogConnexion(id: any): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.delete(API_URL, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Recuperer les logs de connexion par utilisateur
  getLogConnexionsByUser(userId: any): Observable<any> {
    const API_URL = `${this.REST_API}?user_id=${userId}`;
    return this.httpClient.get(API_URL)
      .pipe(catchError(this.handleError));
  }

  // Recuperer les logs de connexion par date
  getLogConnexionsByDate(date: string): Observable<any> {
    const API_URL = `${this.REST_API}?date=${date}`;
    return this.httpClient.get(API_URL)
      .pipe(catchError(this.handleError));
  }

  // Recuperer les connexions actives (sans logout_at)
  getActiveConnexions(): Observable<any> {
    const API_URL = `${this.REST_API}?active=true`;
    return this.httpClient.get(API_URL)
      .pipe(catchError(this.handleError));
  }

  // Enregistrer une connexion
  logLogin(userId: number, ipAddress: string, userAgent: string): Observable<any> {
    const loginData = {
      user_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
      login_at: new Date().toISOString()
    };
    return this.httpClient.post(this.REST_API, loginData)
      .pipe(catchError(this.handleError));
  }

  // Enregistrer une déconnexion
  logLogout(logId: any): Observable<any> {
    const API_URL = `${this.REST_API}/${logId}`;
    const logoutData = {
      logout_at: new Date().toISOString()
    };
    return this.httpClient.put(API_URL, logoutData, { headers: this.httpHeaders })
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