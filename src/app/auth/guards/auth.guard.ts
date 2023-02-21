import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private loginService: AuthService,
              private router: Router)
    {}

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        /*
        if (this.loginService.isAuthenticated()) {
            if (this.isTokenExpirado()) {
                swal.fire('Información', 'Su sesión ha caducado', 'warning');
                this.loginService.logout();
                this.router.navigate(['/login']);
                return false;
            }

            return true;
        } else {
            swal.fire('Error', 'Debe loguearse', 'error');
        }

        this.router.navigate(['/login']);
        */
        return true;
    }

    isTokenExpirado(): boolean {
        let token = this.loginService.token;
        let payload = this.loginService.obtenerDatosToken(token);
        let now = new Date().getTime() / 1000;

        if (payload.exp < now) {
            return true;
        }

        return false;
    }

}
