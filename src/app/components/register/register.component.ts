import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { User } from 'src/app/user';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}
  errorMessage: any = null;
  user = new User();

  async createNewUser() {
    try {
      await this.dataService.createUser(this.user);
      const response = await this.dataService.login(
        this.user.username,
        this.user.password
      );
      sessionStorage.setItem('userId', response.data.id);
      sessionStorage.setItem('userJWT', response.data.jwt);
      this.authService.setIsAuthenticated(true);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = 'Email already exists';
    }
  }
}
