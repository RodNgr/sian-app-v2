import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../../auth/services/auth.service';

import swal from 'sweetalert2';

@Injectable({
     providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

     constructor(private router: Router,
                private authService: AuthService) { }

     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
          return next.handle(req).pipe(
               catchError(e => {
                    console.log('En auth')
                    if (e.status === 401) {
                         console.log('Sesión caduca')
                         swal.fire('La sesión ha caducado', 'Por favor vuelva a loguearse', 'info');
                         if (this.authService.isAuthenticated()) {
                              this.authService.logout();
                         }

                         this.router.navigate(['/login']);
                    }

                    if (e.status === 403) {
                         console.log('acceso denegado')
                         swal.fire('Acceso Denegado', 'No tienes acceso al recurso', 'warning');
                         this.router.navigate(['/home']);
                    }

                    return throwError(e);
               })
          );
     }

}