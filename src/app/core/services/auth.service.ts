import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'spikerz_auth';

  isAuthenticated = signal(this.checkAuth());
  currentUser = signal<User | null>(this.getStoredUser());

  constructor(private router: Router) {}

  private checkAuth(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        const user: User = {
          firstName: 'Patel',
          lastName: 'Tanaka',
          email: email || 'pateltanaka22@gmail.com',
          role: 'Security Analyst',
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        this.isAuthenticated.set(true);
        this.currentUser.set(user);
        resolve(true);
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getUser(): User | null {
    return this.currentUser();
  }
}
