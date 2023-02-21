import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../../auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { FamiliaService } from '../../services/familia.service';

import { Familia } from '../../entity/familia';

import swal from 'sweetalert2';

@Component({
  selector: 'app-familia',
  templateUrl: './familia.component.html',
  styleUrls: ['./familia.component.css']
})
export class FamiliaComponent implements OnInit {

  public title: string = 'Nuevo Prefijo';

  public type: string = 'V';

  public familia: Familia = new Familia();

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private familiaService: FamiliaService,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;

      this.handledTitle();

      if (this.type !== "N") {
        if (sessionStorage.getItem('familia')) {
          this.loadInfoFamilia();
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de familias', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de familias', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nueva Familia';
    } else if (this.type === 'E') {
      this.title = 'Editar Familia'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Familia'; 
    }
  }

  private loadInfoFamilia(): void {
    this.spinner.show();
    this.familiaService.get(Number(sessionStorage.getItem('familia'))).subscribe(
      familia => {
        this.spinner.hide();
        this.familia = familia;
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/interfaz/lista-familia");
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
    this.familia.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    this.familia.estado = 'A';
    this.familia.usuarioCreacion = this.authService.usuario.username;

    this.familiaService.create(this.familia).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Familia creada exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/interfaz/lista-familia");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

  private editar(): void {
    this.spinner.show();
    this.familiaService.edit(this.familia).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Familia editada exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/interfaz/lista-familia");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

}
