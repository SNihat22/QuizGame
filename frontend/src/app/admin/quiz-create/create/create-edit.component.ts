import {Component, inject, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {NgIf} from "@angular/common";
import {IQuestion, IQuiz} from "../../../shared/quiz.model";

type QuizForm = {
  title: FormControl<string>;
  description: FormControl<string>;
  questions: FormArray;
}

type QuestionForm = {
  question: FormControl<string>;
  options: FormArray<FormControl<string>>;
  answer: FormControl<string>;
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './create-edit.component.html',
  styleUrl: './create-edit.component.css'
})
export class CreateEditComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  quiz?: IQuiz;

  faQuestions = new FormArray<FormGroup<QuestionForm>>([this.getQuestionForm()]);
  fcQuizTitle = new FormControl<string>('', {
    asyncValidators: [],
    validators: [Validators.required],
    nonNullable: true,
  })
  fcQuizDescription = new FormControl<string>('', {
    asyncValidators: [],
    validators: [Validators.required],
    nonNullable: true,
  })
  fgQuiz = new FormGroup<QuizForm>({
    title: this.fcQuizTitle,
    description: this.fcQuizDescription,
    questions: this.faQuestions
  })

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.http.get<IQuiz>(`quizzes/${this.route.snapshot.params['id']}`)
        .subscribe(res => {
          this.quiz = res;
          this.populateForm(this.quiz);
          console.log(this.quiz);
        }, error => {
          this.router.navigate(['../'], {
            relativeTo: this.route
          });
          this.toastr.error('Failed to fetch quiz');

        })
    }
  }

  getQuestionForm(): FormGroup<QuestionForm> {
    return new FormGroup({
      question: new FormControl<string>('', {
        asyncValidators: [],
        validators: [Validators.required],
        nonNullable: true,
      }),
      answer: new FormControl<string>('', {
        asyncValidators: [],
        validators: [Validators.required, this.answerValidator],
        nonNullable: true,
      }),
      options: new FormArray<FormControl<string>>([
        new FormControl<string>('', {
          asyncValidators: [],
          validators: [Validators.required],
          nonNullable: true,
        }),
        new FormControl<string>('', {
          asyncValidators: [],
          validators: [Validators.required],
          nonNullable: true,
        }),
      ])
    })
  }

  addQuestion() {
    this.faQuestions.push(this.getQuestionForm());
  }

  removeQuestionAt(i: number) {
    this.faQuestions.removeAt(i);
  }

  addOptionToQuestion(i: number) {
    this.faQuestions.at(i).controls.options.push(new FormControl<string>('', {
      asyncValidators: [],
      validators: [Validators.required],
      nonNullable: true,
    }));
  }

  removeOptionFromQuestionAt(i: number, optionIndex: number) {
    this.faQuestions.at(i).controls.options.removeAt(optionIndex);
  }

  createQuiz() {
    const payload = this.fgQuiz.value;
    if (this.route.snapshot.params['id']) {
      this.http.put(`quizzes/${this.route.snapshot.params['id']}`, payload)
        .subscribe(res => {
            this.toastr.success('Quiz updated');
            this.router.navigate(['../'], {
              relativeTo: this.route
            })
          },
          error => {
            this.toastr.error('Failed to update quiz');
          })
    } else {
      this.http.post('quizzes/create', payload)
        .subscribe(res => {
            this.toastr.success('Quiz created');
            this.router.navigate(['../'], {
              relativeTo: this.route
            })
            this.fgQuiz.reset();
          },
          error => {
            this.toastr.error('Failed to create quiz');
          })
    }
  }

  populateForm(data: IQuiz) {
    this.fcQuizTitle.setValue(data.title);
    this.fcQuizDescription.setValue(data.description);

    // Clear existing questions
    this.faQuestions.clear();

    // Populate questions
    data.questions.forEach((q: IQuestion) => {
      const questionGroup = this.getQuestionForm();

      questionGroup.controls.question.setValue(q.question);
      questionGroup.controls.answer.setValue(q.answer);

      // Clear existing options and add new ones
      const optionsArray = questionGroup.controls.options;
      optionsArray.clear();
      q.options.forEach((option: string) => {
        optionsArray.push(new FormControl<string>(option, {
          asyncValidators: [],
          validators: [Validators.required],
          nonNullable: true,
        }));
      });
      questionGroup.controls.answer.setValue(q.answer)

      this.faQuestions.push(questionGroup);

    });
  }

  answerValidator(control: FormControl): ValidationErrors | null {
    const formGroup = control.parent as FormGroup<QuestionForm>;
    if (!formGroup) {
      return null;
    }
    const optionsArray = formGroup.controls.options.value;
    if (!optionsArray.includes(control.value)) {
      return { invalid: true };
    }
    return null;
  }
}
