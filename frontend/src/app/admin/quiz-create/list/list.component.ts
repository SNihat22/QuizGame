import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IQuiz} from "../../../shared/quiz.model";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  http = inject(HttpClient);
  toast = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  quizzes: IQuiz[] = [];


  ngOnInit() {
    this.getQuizzes();
  }

  getQuizzes(): void {
    this.http.get<IQuiz[]>('/quizzes')
      .subscribe(res => {
        this.quizzes = res;
      })
  }

  deleteQuiz(_id: string) {

    const shouldDelete = confirm("Are you sure you want to delete your quiz?");

    if (shouldDelete) {
      this.http.delete<IQuiz[]>(`quizzes/${_id}`)
        .subscribe(res => {
          const itemIndex = this.quizzes.findIndex((value) => value._id === _id);
          this.quizzes.splice(itemIndex, 1);
          this.toast.success('Quiz game deleted');
        });
    }
  }

  editQuiz(id: string) {
    this.router.navigate([`${id}`], {
      relativeTo: this.route
    });
  }
}
