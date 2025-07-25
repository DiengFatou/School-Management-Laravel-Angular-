import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parent } from '../Models/parent.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParentService {
  private apiUrl = 'http://localhost:8000/api/parents';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Parent[]> {
    return this.http.get<Parent[]>(this.apiUrl);
  }

  create(parent: Parent): Observable<Parent> {
    return this.http.post<Parent>(this.apiUrl, parent);
  }

  update(id: number, parent: Parent): Observable<Parent> {
    return this.http.put<Parent>(`${this.apiUrl}/${id}`, parent);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
