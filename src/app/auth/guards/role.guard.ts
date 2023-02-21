import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';

import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private loginService: AuthService,
                private router: Router)
    {}

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let roles: string[] = next.data['roles'] as string[];

        let valido: boolean = false;
        roles.forEach(role => {
            if (this.loginService.hasRole(role)) {
                valido = true;
            }
        });

        if (valido) {
            return true;
        }

        swal.fire('Acceso Denegado', 'No tienes acceso a este recurso', 'error');

        this.loginService.logout();
        this.router.navigate(['/login']);

        return false;
    }

}
