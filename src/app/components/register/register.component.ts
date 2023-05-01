import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { User } from 'src/app/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private dataService: DataService) {}

  user = new User();

  createNewUser() {
    this.dataService.createUser(this.user).subscribe((res) => {
      console.log(res);
    });
  }
}
