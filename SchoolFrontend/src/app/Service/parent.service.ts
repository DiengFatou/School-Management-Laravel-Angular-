import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private apiUrl = 'http://127.0.0.1:8000/api/parents';

  constructor(private http: HttpClient) {}

  getParents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getParent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createParent(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateParent(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteParent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
