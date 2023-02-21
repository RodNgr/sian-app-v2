import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { RolService } from '../../services/rol.service';

import { Rol } from '../../entity/rol';

import swal from 'sweetalert2';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  public title: string = 'Nuevo Rol';

  public type: string = 'V';

  public rol: Rol = new Rol();

  public rolesDisponibles: Rol[] = [];

  public rolPadreSeleccionado!: Rol;

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private rolService: RolService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;
      this.rolService.getAllRoles().subscribe(
        rolList => {
          this.rolesDisponibles = rolList;

          this.handledTitle();

          if (this.type !== "N") {
            if (sessionStorage.getItem('rol')) {
              this.loadInfoRol();
            } else {
              swal.fire('Error', 'Problemas al ingresar a la ventana de roles', 'error');
              this.type = 'V';
            }
          }
        }
      );
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de roles', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nuevo Rol';
    } else if (this.type === 'E') {
      this.title = 'Editar Rol'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Rol'; 
    }
  }

  private loadInfoRol(): void {
    this.spinner.show();
    this.rolService.getRol(sessionStorage.getItem('rol') || '').subscribe(
      rol => {
        this.spinner.hide();
        this.rol = rol;
        this.rolesDisponibles = this.rolesDisponibles.filter(r => {
          return r.id !== rol.id;
        });

        if (rol.idPadre) {
          this.rolesDisponibles.forEach(r => {
            if (r.id === rol.idPadre) {
              this.rolPadreSeleccionado = r;
            }
          })
        }
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/seguridad/lista-rol");
  }

  public save(): void {
    if (this.type === 'N') {
      this.nuevo();
    } else if (this.type === 'E') {
      this.editar();
    }
  }

  private nuevo(): void {
    this.spinner.show();
    this.rol.usuarioCreacion = this.authService.usuario.username;

    if (this.rolPadreSeleccionado) {
      this.rol.idPadre = this.rolPadreSeleccionado.id;
    } else {
      this.rol.idPadre = '';
    }

    this.rolService.create(this.rol).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Rol creado exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/seguridad/lista-rol");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

  private editar(): void {
    this.spinner.show();
    this.rol.usuarioModificacion = this.authService.usuario.username;

    if (this.rolPadreSeleccionado) {
      this.rol.idPadre = this.rolPadreSeleccionado.id;
    } else {
      this.rol.idPadre = '';
    }

    this.rolService.update(this.rol).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Rol editado exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/seguridad/lista-rol");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

}
