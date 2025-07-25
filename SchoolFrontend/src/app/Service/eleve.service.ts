import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Eleve } from '../Models/eleve.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EleveService {
  private apiUrl = 'http://localhost:8000/api/eleves';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(this.apiUrl);
  }

  getById(id: number): Observable<Eleve> {
    return this.http.get<Eleve>(`${this.apiUrl}/${id}`);
  }

  create(eleve: Eleve): Observable<Eleve> {
    return this.http.post<Eleve>(this.apiUrl, eleve);
  }

  update(id: number, eleve: Eleve): Observable<Eleve> {
    return this.http.put<Eleve>(`${this.apiUrl}/${id}`, eleve);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
