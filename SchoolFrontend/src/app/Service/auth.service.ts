import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(map(response => {
        if (response && response.user) {
          // Stocker l'utilisateur et le token
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token || '');
          this.currentUserSubject.next(response.user);
        }
        return response;
      }));
  }

  logout(): void {
    // Supprimer les données de session
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.role?.toLowerCase() === role.toLowerCase() : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isTeacher(): boolean {
    return this.hasRole('enseignant');
  }

  isParent(): boolean {
    return this.hasRole('parent');
  }

  isStudent(): boolean {
    return this.hasRole('eleve');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {});
  }

  updateProfile(userData: Partial<User>): Observable<any> {
    const user = this.currentUserValue;
    if (!user?.id) {
      throw new Error('Utilisateur non connecté');
    }
    
    return this.http.put<any>(`${this.apiUrl}/users/${user.id}`, userData)
      .pipe(map(response => {
        if (response) {
          const updatedUser = { ...user, ...response };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
        return response;
      }));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {
      token,
      password
    });
  }
} 