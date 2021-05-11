import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHttpInterceptorService implements HttpInterceptor {

  constructor() { }

  // tslint:disable-next-line:typedef
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (sessionStorage.getItem('username') && sessionStorage.getItem('jwt')) {
      req = req.clone({ headers: req.headers.set('Authorization', sessionStorage.getItem('jwt')) });
    }
    console.log(req.url);
    return next.handle(req);

  }
}
