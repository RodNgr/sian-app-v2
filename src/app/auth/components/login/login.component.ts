import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../services/auth.service';

import { Login } from '../../entity/login';

import swal from 'sweetalert2'

import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    public login: Login;

    private urlResetPassword!: string;

    constructor(private loginService: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService) {
        this.login = new Login();
        this.urlResetPassword = environment.urlSecurityShared + '/reset-password/9';
    }

    ngOnInit(): void {
        if (this.loginService.isAuthenticated()) {
            swal.fire('Login', `Usuario ${this.loginService.usuario.username} ya está autenticado`, 'info');
            this.router.navigate(['/home']);
        }
    }

    public logIn(): void {
        this.spinner.show();        

        this.loginService.execLogin(this.login).subscribe(
            (response: any) => {
                this.handledToken(response.access_token);
                const usuario = this.loginService.usuario;

                this.spinner.hide();
                this.router.navigate(['/home']);
                swal.fire('Login exitoso', `Usuario ${usuario.user.fullName}`, 'success')                
            }, err => {
                this.spinner.hide();

                if (err.status == 400) {
                    swal.fire('Error Login', 'Usuario o Clave incorrecta', 'error');
                }
            }
        );
    }

    private handledToken(access_token: string) {
        this.loginService.guardarUsuario(access_token);
        this.loginService.guardarToken(access_token);
    }

    public resetPassword(): void {
        window.location.href = this.urlResetPassword;
    }

}
