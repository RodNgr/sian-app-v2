import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { GrupoService } from '../../services/grupo.service';

import { Grupo } from '../../entity/grupo';

import swal from 'sweetalert2';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {

  public title: string = 'Nuevo Grupo';

  public type: string = 'V';

  public grupo: Grupo = new Grupo();

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private grupoService: GrupoService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;

      this.handledTitle();

      if (this.type !== "N") {
        if (sessionStorage.getItem('grupo')) {
          this.loadInfoGrupo();
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de grupos', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de grupos', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nuevo Grupo';
    } else if (this.type === 'E') {
      this.title = 'Editar Grupo'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Grupo'; 
    }
  }

  private loadInfoGrupo(): void {
    this.spinner.show();
    this.grupoService.getGrupo(Number(sessionStorage.getItem('grupo'))).subscribe(
      grupo => {
        this.spinner.hide();
        this.grupo = grupo;
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/seguridad/lista-grupo");
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
    this.grupo.usuarioCreacion = this.authService.usuario.username;

    this.grupoService.create(this.grupo).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Grupo creado exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/seguridad/lista-grupo");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

  private editar(): void {
    this.spinner.show();

    this.grupo.usuarioModificacion = this.authService.usuario.username;
    
    this.grupoService.update(this.grupo).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Grupo editado exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/seguridad/lista-grupo");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

}
