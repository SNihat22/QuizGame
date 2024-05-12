import {
  ActivatedRouteSnapshot,
  CanActivateFn, Router,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {inject} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./auth/register/register.component";
import {QuizzesListComponent} from "./home/quizzes-list/quizzes-list.component";
import {QuizGameComponent} from "./home/quizzes-list/quiz-game/quiz-game.component";
import {IUser} from "./shared/user.model";
import {QuizCreateComponent} from "./admin/quiz-create/quiz-create.component";
import {LeaderboardsComponent} from "./home/leaderboards/leaderboards.component";
import {CreateEditComponent} from "./admin/quiz-create/create/create-edit.component";
import {ListComponent} from "./admin/quiz-create/list/list.component";
import {EditComponent} from "./admin/quiz-create/edit/edit.component";


export const redirectAuthorizedUser: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) return true;

  return router.parseUrl('/games');
}
export const redirectUnAuthorizedUser: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) return true;

  return router.parseUrl('/auth/login');
}
export const redirectAdminToCreatePage: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') ?? '{}') as IUser;


  return !!(token && !user?.isAdmin);


}

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [
      redirectAuthorizedUser
    ],
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: '',
    canActivate: [
      redirectUnAuthorizedUser
    ],
    children: [
      {
        path: 'games',
        component: HomeComponent,
        canMatch: [redirectAdminToCreatePage],
        children: [
          {
            path: '',
            component: QuizzesListComponent,
          },
          {
            path: 'leaderboards',
            component: LeaderboardsComponent
          },
          {
            path: ':id',
            component: QuizGameComponent
          }
        ]
      },
      {
        path: 'games',
        component: QuizCreateComponent,
        children: [

          {
            path: '',
            component: ListComponent
          },
          {
            path: 'create',
            component: CreateEditComponent,
          },
          {
            path: 'leaderboards',
            component: LeaderboardsComponent
          },
          {
            path: ':id',
            component: CreateEditComponent
          }
        ]
      },
      {
        path: "**",
        redirectTo: 'games'
      }
    ]
  }
];
