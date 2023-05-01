import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: any = sessionStorage.getItem('userId');

  setIsAuthenticated(value: boolean) {
    this.isAuthenticated = value;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
