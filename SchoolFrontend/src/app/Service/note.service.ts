import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Note } from '../Models/note';

export interface NoteDetaillee {
  id: number;
  valeur_note: string; // Peut être une chaîne pour gérer les notes avec décimales
  date_evaluation: string | null;
  commentaire: string | null;
  eleve: {
    id: number;
    nom: string;
    prenom: string;
    matricule?: string;
    date_naissance?: string;
    classe: {
      id: number;
      nom: string;
      niveau: string;
    };
  };
  matiere: {
    id: number;
    nom: string;
    coefficient: number;
    enseignant?: {
      id: number;
      nom: string;
      prenom: string;
    } | null;
  };
  parent?: {
    id: number;
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private REST_API: string = 'http://127.0.0.1:8000/api/notes';
  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Ajouter une note
  addNote(data: Note): Observable<any> {
    return this.httpClient.post(this.REST_API, data)
      .pipe(catchError(this.handleError));
  }

  // Récupérer toutes les notes avec les détails
  getNotes(): Observable<NoteDetaillee[]> {
    return this.httpClient.get<NoteDetaillee[]>(this.REST_API)
      .pipe(
        map((response: any) => response as NoteDetaillee[]),
        catchError(this.handleError)
      );
  }

  // Récupérer une note par ID avec tous les détails
  getNote(id: number): Observable<NoteDetaillee> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.get<NoteDetaillee>(API_URL, { headers: this.httpHeaders })
      .pipe(
        map((res: any) => res as NoteDetaillee),
        catchError(this.handleError)
      );
  }

  // Mettre a jour une note
  updateNote(id: any, data: Note): Observable<any> {
    const API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.put(API_URL, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Supprimer une note
  deleteNote(id: any): Observable<any> {
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
