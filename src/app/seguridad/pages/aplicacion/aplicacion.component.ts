import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AplicacionService } from '../../services/aplicacion.service';
import { AuthService } from 'src/app/auth/services/auth.service';

import { Aplicacion } from '../../entity/aplicacion';

import swal from 'sweetalert2';

@Component({
  selector: 'app-aplicacion',
  templateUrl: './aplicacion.component.html',
  styleUrls: ['./aplicacion.component.css']
})
export class AplicacionComponent implements OnInit {

  public title: string = 'Nueva Aplicación';

  public type: string = 'V';

  public aplicacion: Aplicacion = new Aplicacion();

  public incluirInactivos: boolean = false;

  public informarUbicacion: boolean = false;

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private aplicacionService: AplicacionService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;

      this.handledTitle();

      if (this.type !== "N") {
        if (sessionStorage.getItem('aplicacion')) {
          this.loadInfoAplicacion();
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de aplicaciones', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de aplicaciones', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nueva Aplicación';
    } else if (this.type === 'E') {
      this.title = 'Editar Aplicación'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Aplicación'; 
    }
  }

  private loadInfoAplicacion(): void {
    this.spinner.show();
    this.aplicacionService.getAplicacion(Number(sessionStorage.getItem('aplicacion'))).subscribe(
      aplicacion => {
        this.spinner.hide();
        this.aplicacion = aplicacion;

        this.incluirInactivos = aplicacion.includeInactive === 'S';
        this.informarUbicacion = aplicacion.sendNotificationUnfamiliarLogin === 'S';
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/seguridad/lista-aplicacion");
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
    this.aplicacion.usuarioCreacion = this.authService.usuario.username;
    this.aplicacion.includeInactive = this.incluirInactivos ? 'S' : 'N'
    this.aplicacion.sendNotificationUnfamiliarLogin = this.informarUbicacion ? 'S' : 'N'

    this.aplicacionService.create(this.aplicacion).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Aplicación creada exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/seguridad/lista-aplicacion");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

  private editar(): void {
    this.spinner.show();

    this.aplicacion.usuarioModificacion = this.authService.usuario.username;
    this.aplicacion.includeInactive = this.incluirInactivos ? 'S' : 'N'
    this.aplicacion.sendNotificationUnfamiliarLogin = this.informarUbicacion ? 'S' : 'N'

    this.aplicacionService.update(this.aplicacion).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Aplicación editada exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/seguridad/lista-aplicacion");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }
  
}
