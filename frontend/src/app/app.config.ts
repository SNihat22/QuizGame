import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr} from "ngx-toastr";
import {
  HttpHandlerFn, HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors
} from "@angular/common/http";


const intercept: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

  let clonedRequest = req.clone({url: `http://localhost:4200/api/v1/${req.url}`});

  if (clonedRequest.url.includes('login') || clonedRequest.url.includes('register')) {
    return next(clonedRequest);
  }

  const token = localStorage.getItem('token') as string;
  clonedRequest = req.clone({
    url: `http://localhost:4200/api/v1/${req.url}`, headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  });


  return next(clonedRequest);
}
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), provideToastr(), provideHttpClient(withInterceptors([intercept]))],
};
