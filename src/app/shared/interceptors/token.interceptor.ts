import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = sessionStorage.getItem('token')!;

    let request = req;

    if (!request.headers.has('Authorization')) {
        if (token) {
          request = req.clone({
            setHeaders: {
              authorization: `Bearer ${token}`,
            },
          });
        }
    }

    return next.handle(request);
  }
}
