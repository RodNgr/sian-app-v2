import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { DescuentoCargo } from '../../entity/descuento-cargo';
import { DescuentoCargoService } from '../../services/descuento-cargo.service';
import { AuthService } from '../../../auth/services/auth.service';

interface Empresa {
  idEmpresa: number,
  deEmpresa: string
}

@Component({
  selector: 'app-descuento-cargo',
  templateUrl: './descuento-cargo.component.html',
  styleUrls: ['./descuento-cargo.component.css']
})
export class DescuentoCargoComponent implements OnInit {

  public title = 'Nuevo Descuento por Cargo';

  public type: string = 'V';

  public descuento: DescuentoCargo = new DescuentoCargo();

  public empresaList: Empresa[] = [
    { idEmpresa: 2, deEmpresa: 'Bembos' },
    { idEmpresa: 5, deEmpresa: 'Chinawok' },
    { idEmpresa: 3, deEmpresa: 'Don Belisario' },
    { idEmpresa: 8, deEmpresa: 'Dunkins Donuts' },
    { idEmpresa: 7, deEmpresa: 'Papa Johns' },
    { idEmpresa: 4, deEmpresa: 'Popeyes' },
    { idEmpresa: 1, deEmpresa: 'Servicios Compartidos' },
  ]

  public empresaSelected!: Empresa;

  constructor(private spiner: NgxSpinnerService,
              private descuentoService: DescuentoCargoService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;

      this.handledTitle();

      if (this.type !== "N") {
        if (sessionStorage.getItem('descuento')) {
          this.descuento = JSON.parse(sessionStorage.getItem('descuento'));

          this.empresaList.forEach(e => {
            if (e.idEmpresa === this.descuento.idEmpresa) {
              this.empresaSelected = e;
            }
          })
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de descuento por cargo', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de descuento por cargo', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nuevo Descuento por Cargo';
    } else if (this.type === 'E') {
      this.title = 'Editar Descuento por Cargo'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Descuento por Cargo'; 
    }
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/rrhh/lista-descuento-cargo");
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

    this.descuento.idCreacion = this.authService.usuario.username;
    this.descuentoService.createDescuentoCargo(this.descuento).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Descuento por Cargo creado exitosamente!');
        this.spiner.hide();

        this.router.navigateByUrl("/home/rrhh/lista-descuento-cargo");
      },
      err => {
        this.spiner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

  private editar(): void {
    this.spiner.show();
    this.descuento.idModificacion = this.authService.usuario.username;

    this.descuentoService.editDescuentoCargo(this.descuento).subscribe(
      _data => {
        sessionStorage.setItem('message', 'Descuento por Cargo editado exitosamente!');
        this.spiner.hide();
        this.router.navigateByUrl("/home/rrhh/lista-descuento-cargo");
      },
      err => {
        this.spiner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );
  }

}
