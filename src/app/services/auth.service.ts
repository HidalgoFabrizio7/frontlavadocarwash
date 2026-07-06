import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

interface JwtResponse {
  jwttoken: string;
}

const TOKEN_KEY = 'carwash_token';
const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${base_url}/login`, { username, password }).pipe(
      tap(res => this.setToken(res.jwttoken))
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return this.jwtHelper.decodeToken(token)?.role ?? null;
    } catch {
      return null;
    }
  }

  hasRole(rol: string): boolean {
    return this.getRole() === rol;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }
}
