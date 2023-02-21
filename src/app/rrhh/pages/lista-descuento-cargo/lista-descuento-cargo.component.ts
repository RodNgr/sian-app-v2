import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import { DescuentoCargo } from '../../entity/descuento-cargo';
import { DescuentoCargoService } from '../../services/descuento-cargo.service';
import swal from 'sweetalert2';
import { stringify } from 'querystring';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-lista-descuento-cargo',
  templateUrl: './lista-descuento-cargo.component.html',
  styleUrls: ['./lista-descuento-cargo.component.css']
})
export class ListaDescuentoCargoComponent implements OnInit {

  @ViewChild('dt') table!: Table;

  public descuentoList: DescuentoCargo[] = [];

  public descuentoSelected!: DescuentoCargo;

  public cantidadMap = {
    '=0': 'No existen descuentos',
    '=1': 'En total hay 1 descuento',
    'other': 'En total hay # descuentos'
  }

  public isMobile: boolean = window.innerWidth < 641;

  constructor(private spinner: NgxSpinnerService,
              private descuentoService: DescuentoCargoService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('descuento');

    this.list();
  }

  private list(): void {
    this.spinner.show();
    this.descuentoService.getDescuentosCargo().subscribe(
      descuentoList => {
        this.descuentoList = descuentoList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los Descuentos', 'error');
      }
    );
  }

  public newDescuento() {
    sessionStorage.setItem('tipoOperacion', 'N');

    this.router.navigateByUrl("/home/rrhh/descuento-cargo");
  } 

  public editDescuento() {
    if (!this.descuentoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un Descuento', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'E');
    sessionStorage.setItem('descuento', JSON.stringify(this.descuentoSelected));

    this.router.navigateByUrl("/home/rrhh/descuento-cargo");
  }

  public applyFilterGlobal($event:any , stringVal: any) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  public inactivar(): void {
    if (!this.descuentoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un descuento', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de inactivar el descuento seleccionado?',
      html: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        this.descuentoSelected.idModificacion = this.authService.usuario.username;
        this.descuentoService.removeDescuentoCargo(this.descuentoSelected).subscribe(
          _data => {
            this.spinner.hide();
            swal.fire('Éxito!', 'Descuento por Cargo eliminado exitosamente!', 'success');
            this.list();
            
          },
          err => {
            this.spinner.hide();
            swal.fire('Error', err.error.mensaje, 'error');
          }
        );  
      }
    })
  }

}
