import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";
@Component({
  selector: 'app-quiz-create',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    JsonPipe,
    NgIf,
    RouterLink
  ],
  templateUrl: './quiz-create.component.html',
  styleUrl: './quiz-create.component.css'
})
export class QuizCreateComponent {


  router = inject(Router);
  toastr = inject(ToastrService);

  logout() {
    localStorage.clear();
    this.router.navigate(['auth/login']).then(() => {
      this.toastr.success('User logged out')
    });
  }
}
