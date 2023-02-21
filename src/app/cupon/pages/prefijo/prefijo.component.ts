import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { PrefijoService } from '../../services/prefijo.service';

import { Prefijo } from '../../entity/prefijo';

import swal from 'sweetalert2'

@Component({
  selector: 'app-prefijo',
  templateUrl: './prefijo.component.html',
  styleUrls: ['./prefijo.component.css']
})
export class PrefijoComponent implements OnInit {

  public title: string = 'Nuevo Prefijo';

  public type: string = 'V';

  public prefijo: Prefijo = new Prefijo();

  constructor(private spiner: NgxSpinnerService,
              private prefijoService: PrefijoService,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;

      this.handledTitle();

      if (this.type !== "N") {
        if (sessionStorage.getItem('prefijo')) {
          this.loadInfoPrefijo();
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de prefijos', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de prefijos', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nuevo Prefijo';
    } else if (this.type === 'E') {
      this.title = 'Editar Prefijo'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Prefijo'; 
    }
  }

  private loadInfoPrefijo(): void {
    this.spiner.show();
    this.prefijoService.getPrefijo(sessionStorage.getItem('prefijo')!).subscribe(
      prefijo => {
        this.spiner.hide();
        this.prefijo = prefijo;
      }, 
      err => {
        this.spiner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/cupon/lista-prefijos");
  }

  public save(): void {
    if (this.type === 'N') {
      this.nuevo();
    } else if (this.type === 'E') {
      this.editar();
    }
  }

  private nuevo(): void {
    this.spiner.show();
    this.prefijo.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    this.prefijoService.createPrefijo(this.prefijo).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Prefijo creado exitosamente!');
        this.spiner.hide();

        this.router.navigateByUrl("/home/cupon/lista-prefijos");
      },
      err => {
        this.spiner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

  private editar(): void {
    this.spiner.show();
    this.prefijoService.editPrefijo(this.prefijo).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Prefijo editado exitosamente!');
        this.spiner.hide();
        this.router.navigateByUrl("/home/cupon/lista-prefijos");
      },
      err => {
        this.spiner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

}
