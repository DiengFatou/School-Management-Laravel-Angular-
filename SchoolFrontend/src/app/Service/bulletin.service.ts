import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Bulletin } from '../Models/bulletin';

export interface GenerationBulletinData {
  annee_scolaire_id: number;
  trimestre: number;
  classe_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  private REST_API: string = 'http://127.0.0.1:8000/api/bulletins';
  private httpHeaders = new HttpHeaders().set('Accept', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Ajouter un bulletin
  addBulletin(data: Bulletin): Observable<any> {
    return this.httpClient.post(this.REST_API, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Récupérer tous les bulletins
  getBulletins(): Observable<any> {
    return this.httpClient.get(this.REST_API, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Récupérer un bulletin par ID
  getBulletin(id: number): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(
        map((res: any) => res || {}),
        catchError(this.handleError)
      );
  }

  // Mettre à jour un bulletin
  updateBulletin(id: number, data: Bulletin): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.put(API_URL, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Supprimer un bulletin
  deleteBulletin(id: number): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.delete(API_URL, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  /**
   * Génère les bulletins pour une classe, un trimestre et une année scolaire donnés
   * @param data Données de génération (classe_id, trimestre, annee_scolaire_id)
   */
  genererBulletins(data: GenerationBulletinData): Observable<any> {
    const API_URL = `${this.REST_API}/generer`;
    return this.httpClient.post(API_URL, data, { 
      headers: this.httpHeaders,
      responseType: 'json'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Télécharge un bulletin au format PDF
   * @param id ID du bulletin à télécharger
   */
  downloadBulletinPdf(id: number): Observable<Blob> {
    const API_URL = `${this.REST_API}/${id}/telecharger`;
    return this.httpClient.get(API_URL, { 
      responseType: 'blob',
      headers: this.httpHeaders 
    }).pipe(catchError(this.handleError));
  }

  /**
   * Télécharge tous les bulletins d'une classe pour un trimestre et une année scolaire donnés
   * @param data Données de génération (classe_id, trimestre, annee_scolaire_id)
   */
  downloadAllBulletinsPdf(data: GenerationBulletinData): Observable<Blob> {
    const API_URL = `${this.REST_API}/telecharger-tous`;
    
    // Convertir l'objet data en HttpParams
    let httpParams = new HttpParams();
    Object.keys(data).forEach(key => {
      if (data[key as keyof GenerationBulletinData] !== undefined) {
        httpParams = httpParams.append(key, data[key as keyof GenerationBulletinData].toString());
      }
    });
    
    return this.httpClient.post(API_URL, data, { 
      params: httpParams,
      responseType: 'blob',
      headers: this.httpHeaders
    }).pipe(catchError(this.handleError));
  }

  /**
   * Envoie les bulletins à tous les élèves d'une classe par email
   * @param data Données d'envoi (classe_id, trimestre, annee_scolaire_id)
   */
  envoyerTousEmails(data: GenerationBulletinData): Observable<any> {
    const API_URL = `${this.REST_API}/envoyer-emails`;
    return this.httpClient.post(API_URL, data, { 
      headers: this.httpHeaders,
      responseType: 'json'
    }).pipe(catchError(this.handleError));
  }

  // Télécharger un bulletin PDF
  downloadBulletin(id: number): Observable<Blob> {
    const API_URL = `${this.REST_API}/${id}/telecharger`;
    return this.httpClient.get(API_URL, { 
      responseType: 'blob',
      headers: this.httpHeaders 
    }).pipe(catchError(this.handleError));
  }

  // Télécharger tous les bulletins d'une classe/trimestre
  downloadAllBulletins(params: GenerationBulletinData): Observable<Blob> {
    const API_URL = `${this.REST_API}/telecharger-tous`;
    
    // Convertir l'objet params en HttpParams
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key as keyof GenerationBulletinData] !== undefined) {
        httpParams = httpParams.append(key, params[key as keyof GenerationBulletinData].toString());
      }
    });
    
    return this.httpClient.get(API_URL, { 
      params: httpParams,
      responseType: 'blob',
      headers: this.httpHeaders
    }).pipe(catchError(this.handleError));
  }

  // Envoyer un bulletin par email
  envoyerEmailBulletin(bulletinId: number): Observable<any> {
    const API_URL = `${this.REST_API}/${bulletinId}/envoyer-email`;
    return this.httpClient.post(API_URL, {}, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Récupérer les bulletins avec filtres
  getBulletinsByFilters(anneeId: number, trimestre: number, classeId: number): Observable<any> {
    const params = new HttpParams()
      .set('annee_scolaire_id', anneeId.toString())
      .set('trimestre', trimestre.toString())
      .set('classe_id', classeId.toString());

    return this.httpClient.get(this.REST_API, { 
      params,
      headers: this.httpHeaders 
    }).pipe(catchError(this.handleError));
  }

  // Récupérer l'historique des bulletins avec pagination
  getBulletinHistory(classeId: number, page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('classe_id', classeId.toString())
      .set('page', page.toString())
      .set('page_size', pageSize.toString())
      .set('historique', 'true');

    return this.httpClient.get(this.REST_API, { 
      params,
      headers: this.httpHeaders 
    }).pipe(catchError(this.handleError));
  }

  // Envoyer les bulletins de tous les élèves d'une classe/trimestre
  envoyerEmailsBulletins(params: GenerationBulletinData): Observable<any> {
    const API_URL = `${this.REST_API}/envoyer-emails`;
    return this.httpClient.post(API_URL, params, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
      
      // Essayer d'extraire le message d'erreur de la réponse
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      }
    }
    console.error('BulletinService error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
