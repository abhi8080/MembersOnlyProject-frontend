import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: any = null;

  constructor(
    private router: Router,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  /**
   * Method to handle the login functionality
   */
  async login() {
    try {
      const response = await this.dataService.login(
        this.username,
        this.password
      );
      sessionStorage.setItem('userId', response.data.id);
      sessionStorage.setItem('userJWT', response.data.jwt);
      this.authService.setIsAuthenticated(true);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.response.data.message;
    }
  }
}
