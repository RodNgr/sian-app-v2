import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { TipoConsumoService } from '../../services/tipo-consumo.service';

import { TipoConsumo } from '../../entity/tipo-consumo';

import swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-consumo',
  templateUrl: './tipo-consumo.component.html',
  styleUrls: ['./tipo-consumo.component.css']
})
export class TipoConsumoComponent implements OnInit {

  public title: string = 'Nuevo Prefijo';

  public type: string = 'V';

  public tipoConsumo: TipoConsumo = new TipoConsumo();

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private tipoConsumoService: TipoConsumoService,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;

      this.handledTitle();

      if (this.type !== "N") {
        if (sessionStorage.getItem('tipoConsumo')) {
          this.loadInfoTipoConsumo();
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de tipos de consumo', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de tipos de consumo', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nuevo Tipo de Consumo';
    } else if (this.type === 'E') {
      this.title = 'Editar Tipo de Consumo'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Tipo de Consumo'; 
    }
  }

  private loadInfoTipoConsumo(): void {
    this.spinner.show();
    this.tipoConsumoService.get(Number(sessionStorage.getItem('tipoConsumo'))).subscribe(
      tipoConsumo => {
        this.spinner.hide();
        this.tipoConsumo = tipoConsumo;
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/interfaz/lista-tipo-consumo");
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
    this.tipoConsumo.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    this.tipoConsumo.estado = 'A';
    this.tipoConsumo.usuarioCreacion = this.authService.usuario.username;

    this.tipoConsumoService.create(this.tipoConsumo).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Tipo de Consumo creado exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/interfaz/lista-tipo-consumo");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

  private editar(): void {
    this.spinner.show();
    this.tipoConsumoService.edit(this.tipoConsumo).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Tipo de Consumo editado exitosamente!');
        this.spinner.hide();

        this.router.navigateByUrl("/home/interfaz/lista-tipo-consumo");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

}
