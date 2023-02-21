import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../../auth/services/auth.service';
import { EmpresaService } from '../../../shared/services/empresa.service';

import { ObjectUtils } from 'primeng/utils';
import { Solicitud } from '../../entity/solicitud';
import { SolicitudService } from '../../services/solicitud.service';
import { SolicitudDetalle } from '../../entity/solicitud-detalle';
import { SolicitudDetallePk } from '../../entity/solicitud-detalle-pk';
import { Table } from 'primeng/table';

import swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-diem',
  templateUrl: './solicitud-diem.component.html',
  styleUrls: ['./solicitud-diem.component.css']
})
export class SolicitudDiemComponent implements OnInit {

  public title: string = 'Nueva Solicitud';

  public type: string = 'V';

  public solicitud: Solicitud = new Solicitud();

  public detalleList: SolicitudDetalle[] = [];

  public detalleSeleccionado!: SolicitudDetalle;

  @ViewChild('dt') table!: Table;

  public agregando: boolean = false;

  private clonedDetalle: { [s: number]: SolicitudDetalle; } = {};

  public first: boolean = true;

  private contador: number = 1;

  constructor(private spinner: NgxSpinnerService,
              private router: Router,
              private authService: AuthService,
              private empresaService: EmpresaService,
              private solicitudService: SolicitudService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;

      this.handledTitle();

      if (this.type !== 'N') {
        if (sessionStorage.getItem('solicitud')) {
          this.loadInfoSolicitud();
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de solicitudes', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de solicitudes', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nueva Solicitud';
    } else if (this.type === 'V') {
      this.title = 'Ver Solicitud'; 
    }
  }

  private loadInfoSolicitud(): void {
    this.spinner.show();
    this.solicitudService.getSolicitud(Number(sessionStorage.getItem('solicitud')!)).subscribe(
      solicitud => {
        this.spinner.hide();
        this.solicitud = solicitud;
        this.detalleList = [... this.solicitud.detalleList];
      }, 
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public addDetalle() {
    let pk: SolicitudDetallePk = new SolicitudDetallePk();
    pk.idDetalle = this.contador;

    let detalle: SolicitudDetalle = new SolicitudDetalle();
    detalle.id = pk;
    detalle.first = this.first;

    this.detalleList.push(detalle);
    this.table.initRowEdit(detalle);

    this.clonedDetalle[detalle.id.idDetalle] = {...detalle};

    this.agregando = true;
    this.contador = this.contador + 1;
    
    if (this.first) {
      this.first = false;
    }
  }

  onRowEditSave(detalle: SolicitudDetalle) {
    if (this.disableSaveButton(detalle)) {
      swal.fire('Advertencia!', 'Todos los campos son requeridos', 'warning');
      return;
    }

    this.detalleList = [... this.detalleList];
    this.agregando = false;
    delete this.clonedDetalle[detalle.id.idDetalle];
    
    let dataKeyValue = String(ObjectUtils.resolveFieldData(detalle, this.table.dataKey));
    delete this.table.editingRowKeys[dataKeyValue];
  }

  onRowEditCancel(detalle: SolicitudDetalle) {
      this.first = detalle.first;

      this.detalleList.pop();
      
      this.agregando = false;
      delete this.clonedDetalle[detalle.id.idDetalle];

      let dataKeyValue = String(ObjectUtils.resolveFieldData(detalle, this.table.dataKey));
      delete this.table.editingRowKeys[dataKeyValue];
  }

  public disableSaveButton(detalle: SolicitudDetalle): boolean {
    if (detalle.first) {
      if (this.isEmptyString(detalle.copixel)) {
        return true;
      }

      if (this.isEmptyString(detalle.codsap)) {
        return true;
      }

      if (this.isEmptyNumber(detalle.monto)) {
        return true;
      }
    }

    if (!detalle.first) {
      if (this.isEmptyNumber(detalle.cantidad)) {
        return true;
      }
    }

    if (this.isEmptyDescripcion(detalle.descripcion)) {
      return true;
    }

    return false;
  }

  public isEmptyString(value: string): boolean {
    return (value === undefined || value === null || Number(value) === 0)
  }

  public isEmptyNumber(value: number): boolean {
    return (value === undefined || value === null || value === 0);
  }

  public isEmptyDescripcion(value: string): boolean {
    return (value === undefined || value === null)
  }

  public removeDetalle() {
    if (!this.detalleSeleccionado) {
      swal.fire('Advertencia!', 'Debe seleccionar un detalle', 'warning');
      return;
    }

    if (this.detalleSeleccionado.first) {
      swal.fire({
        title: '¿Si elimina este elemento se quitará toda la información de la tabla?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.detalleList = [];
          this.first = true;
        }
      })
    } else {
      this.detalleList = this.detalleList.filter((detalle: SolicitudDetalle) => {
        return detalle.id.idDetalle !== this.detalleSeleccionado.id.idDetalle; 
      });
    }
  }

  public save() {
    if (!this.detalleList) {
      swal.fire('Advertencia!', 'Debe ingresar por lo menos un detalle', 'warning');
      return;
    }

    if (this.detalleList.length === 0) {
      swal.fire('Advertencia!', 'Debe ingresar por lo menos un detalle', 'warning');
      return;
    }

    this.solicitud.detalleList = [... this.detalleList];
    this.solicitud.descripcion = this.solicitud.detalleList[0].descripcion;
    this.solicitud.estado = 'P';
    this.solicitud.usuarioCreacion = this.authService.usuario.username;
    this.solicitud.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    this.solicitud.idEmpresaSap = this.empresaService.getEmpresaSeleccionada().codSap;

    this.spinner.show();
    this.solicitudService.createSolicitud(this.solicitud).subscribe(
      _response => {
        sessionStorage.setItem('message', 'Solicitud creada exitosamente!');
        this.spinner.hide();
        this.router.navigateByUrl("/home/cupon/lista-solicitud-diem");
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
      }
    );
  }

  public cancelar() {
    sessionStorage.removeItem('solicitud');
    this.router.navigateByUrl('/home/cupon/lista-solicitud-diem');
  }

}
