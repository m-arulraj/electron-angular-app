import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    // Dummy validation (replace this with real API call if needed)
    if (username === 'admin' && password === 'admin123') {
      const token = btoa(`${username}:${password}`);  // base64 encode
      localStorage.setItem('authToken', token);
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') {
      // localStorage is not available (e.g., server-side rendering)
      return false;
    }
    console.log('Auth Token:', localStorage.getItem('authToken'));
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
