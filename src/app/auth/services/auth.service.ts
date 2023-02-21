import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';

import { Login } from '../entity/login';

import swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _usuario!: Login;

    private _token!: string;

    private urlEndPoint: string

    constructor(private http: HttpClient,
        private router: Router,
        private spinner: NgxSpinnerService) {
        this.urlEndPoint = environment.urlSecurity;
    }

    execLogin(login: Login): Observable<any> {
        const urlEndPoint: string = `${this.urlEndPoint}/oauth/token`;

        const credenciales = btoa('NGRApplication' + ':' + 'ngr4dm1n');
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + credenciales
        });

        let params = new URLSearchParams();
        params.set('grant_type', 'password');
        params.set('username', login.username);
        params.set('password', login.password);
        params.set('application', '9');

        return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders }).pipe(
            catchError(e => {
                if (e.status == 400) {
                    return throwError(e);
                }

                if (e.status == 401) {
                    if (e.error.error_description == "User credentials have expired") {
                        this.changePasswordCaduco(login.username).subscribe(
                            _err => {
                            }
                        );

                        swal.fire('Su contraseña ha caducado', 'Se ha enviado un correo para que proceda con el cambio de contraseña', 'warning');
                        //swal.fire('Su contraseña ha caducado', 'Seleccione la opción olvidé mi contraseña para poder resetearla', 'warning');
                        this.router.navigate(['/login']);
                        return throwError(e);
                    }
                }

                this.router.navigate(['/login']);
                swal.fire('Error en el logueo', e.error.error_description, 'error');
                return throwError(e);
            })
        );
    }

    public get usuario(): Login {
        if (this._usuario !== undefined) {
            return this._usuario;
        } else if (sessionStorage.getItem('usuario') !== null) {
            this._usuario = JSON.parse(sessionStorage.getItem('usuario')!) as Login;
            return this._usuario;
        } else {
            return new Login();
        }
    }

    public get token(): string {
        if (this._token !== undefined) {
            return this._token;
        } else if (sessionStorage.getItem('token') !== null) {
            this._token = sessionStorage.getItem('token')!;
            return this._token;
        }

        return '';
    }

    guardarUsuario(accesToken: string): void {
        const payload = this.obtenerDatosToken(accesToken);

        this._usuario = new Login();
        this._usuario.username = payload.user_name;
        this._usuario.password = payload.password;
        this._usuario.roles = payload.authorities;
        this._usuario.user = payload.user;

        sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    }

    guardarToken(accesToken: string): void {
        this._token = accesToken;
        sessionStorage.setItem('token', accesToken);
    }

    obtenerDatosToken(accesToken: string): any {
        if (accesToken.length > 0) {
            return JSON.parse(atob(accesToken.split(".")[1]));
        }

        return null;
    }

    isAuthenticated(): boolean {
        let payload = this.obtenerDatosToken(this.token);

        if (payload !== null && payload.user_name !== null && payload.user_name.length > 0) {
            return true;
        }

        return false;
    }

    logout(): void {
        this.spinner.show();
        this._token = '';
        this._usuario = new Login();
        sessionStorage.clear();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');
        this.spinner.hide();
        this.router.navigate(['/login']);
    }

    hasRole(role: string): boolean {
        if (this.usuario.roles.includes(role)) {
            return true;
        }

        return false;
    }

    changePassword(username: string): Observable<any> {
        const urlEndPoint: string = `${this.urlEndPoint}/api/users/change/N/9/${username}`;
        return this.http.get<any>(urlEndPoint);
    }

    changePasswordCaduco(username: string): Observable<any> {
        const urlEndPoint: string = `${this.urlEndPoint}/api/users/change/S/9/${username}`;
        return this.http.get<any>(urlEndPoint);
    }

    getUsuarioInterface(): string {
        if (this.usuario.user.estienda === 'S') {
            if (this.usuario.user.usuariointerface !== undefined || this.usuario.user.usuariointerface !== null) {
                return this.usuario.user.usuariointerface;
            } else {
                return 'NINGUNO';
            }
        }

        return 'TODOS';
    }

}
