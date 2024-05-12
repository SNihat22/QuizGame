import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AbstractControl, FormsModule, ValidationErrors} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {IUser} from "../../shared/user.model";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  http = inject(HttpClient);
  toastr = inject(ToastrService);
  router = inject(Router);

  username: string = 'admin@gmail.com';
  password: string = 'admin@123';


  onSignIn(): void {
    const payload: Partial<IUser> = {
      username: this.username,
      password: this.password
    }
    this.http.post<{ token: string, user: IUser }>('user/login', payload)
      .subscribe({
        next: ({token, user}) => {
          this.toastr.success('Login successful!');
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          this.router.navigate(['../games']);
        },
        error: () => {
          this.toastr.error('Login failed!');
        }
      });
  }

}
