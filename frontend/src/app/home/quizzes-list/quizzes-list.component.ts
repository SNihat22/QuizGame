import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IQuiz} from "../../shared/quiz.model";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-quizzes-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './quizzes-list.component.html',
  styleUrl: './quizzes-list.component.css'
})
export class QuizzesListComponent implements OnInit {

  http = inject(HttpClient);
  quizzes: IQuiz[] = [];


  ngOnInit() {
    this.getQuizzes();
  }

  getQuizzes(): void {
    this.http.get<IQuiz[]>('/quizzes')
      .subscribe(res => {
        console.log(res);
        this.quizzes = res;
      })
  }

}
