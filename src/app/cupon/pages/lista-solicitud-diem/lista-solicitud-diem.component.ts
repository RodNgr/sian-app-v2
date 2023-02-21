import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../../auth/services/auth.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SolicitudService } from '../../services/solicitud.service';

import { AsignarPrefijoComponent } from '../../components/asignar-prefijo/asignar-prefijo.component';
import { RegistraDiemComponent } from '../../components/registra-diem/registra-diem.component';

import { DatePipe } from '@angular/common';

import { Solicitud } from '../../entity/solicitud';

import swal from 'sweetalert2';

@Component({
  selector: 'app-lista-solicitud-diem',
  templateUrl: './lista-solicitud-diem.component.html',
  styleUrls: ['./lista-solicitud-diem.component.css']
})
export class ListaSolicitudDiemComponent implements OnInit, OnDestroy {

  public solicitudList: Solicitud[] = [];

  public solicitudSelected!: Solicitud;

  public rangeDates: Date[] = [];

  public cantidadMap = {
    '=0': 'No existen solicitudes',
    '=1': 'En total hay 1 solicitud',
    'other': 'En total hay # solicitudes'
  }

  private ref!: DynamicDialogRef;
  
  private pipe = new DatePipe("en-US");

  public isMobile: boolean = window.innerWidth < 641

  constructor(private spinner: NgxSpinnerService,
              public authService: AuthService,
              public solicitudService: SolicitudService,
              private dialogService: DialogService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');

    const feInicio = new Date();
    const feFin = new Date();

    feInicio.setDate(1);

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.buscar();
  }

  public buscar(): void {
    this.spinner.show();
    const desde = this.pipe.transform(this.rangeDates[0], "yyyyMMdd") || '';
    const hasta = this.pipe.transform(this.rangeDates[1], "yyyyMMdd") || '';

    this.solicitudService.getSolicitudes(desde, hasta).subscribe (
      solicitudList => {
        this.solicitudList = solicitudList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener las solicitudes', 'error');
      }
    )
  }

  public newSolicitud(): void {
    sessionStorage.setItem('tipoOperacion', 'N');
    this.router.navigateByUrl('/home/cupon/solicitud-diem');
  }

  public viewSolicitud(): void {
    if (!this.solicitudSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar una solicitud', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('solicitud', this.solicitudSelected.id.toString());
    this.router.navigateByUrl('/home/cupon/solicitud-diem');
  }

  public reenviar(): void {
    if (!this.solicitudList) {
      swal.fire('Alerta!', 'Debe seleccionar una solicitud', 'warning');
      return;
    }

    if (this.solicitudSelected.estado === 'P') {
      this.spinner.show();
      this.solicitudService.reenviar(this.solicitudSelected.id).subscribe(
        _response => {
          this.spinner.hide();
          swal.fire('Éxito', 'Correo enviado con éxito', 'success');
        },
        err => {
          this.spinner.hide();
          swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        }
      )
    } else {
      swal.fire('Alerta!', 'Sólo se puede reenviar el correo cuando la solicitud se encuentra como En Proceso', 'warning');
    }
  }

  public anularSolicitud(): void {
    if (!this.solicitudList) {
      swal.fire('Alerta!', 'Debe seleccionar una solicitud', 'warning');
      return;
    }

    if (this.solicitudSelected.estado !== 'P') {
      swal.fire('Alerta!', 'Sólo se pueden anular solicitudes que se encuentran como En Proceso', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de anular la solicitud?',
      html: 'Esta acción no se puede deshacer',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudSelected.usuarioModificacion = this.authService.usuario.username;

        this.spinner.show();
        this.solicitudService.anular(this.solicitudSelected).subscribe(
          _data => {
            this.spinner.hide();
            this.buscar();
            swal.fire('Éxito!', 'Solicitud anulada exitosamente!', 'success');
          },
          err => {
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
      }
    })
  }

  public registrarDien(): void {
    if (!this.solicitudSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una solicitud', 'warning');
      return;
    }

    if (this.solicitudSelected.estado !== 'P') {
      swal.fire('Alerta!', 'Sólo se puede asignar el Código DIEN a solicitudes En Proceso', 'warning');
      return;
    }

    this.ref = this.dialogService.open(RegistraDiemComponent, {
      header: 'Registrar DIEN',
      width: '20%',
      data: this.solicitudSelected.diem
    });

    this.ref.onClose.subscribe((dien: string) => {
        if (!dien) {
          return;
        }

        this.spinner.show();
        this.solicitudSelected.usuarioDiem = this.authService.usuario.username;
        this.solicitudSelected.diem = dien;

        this.solicitudService.assignDiem(this.solicitudSelected).subscribe(
          _data => {
            this.spinner.hide();
            this.buscar();
            swal.fire('Éxito!', 'DIEN asignado exitosamente!', 'success');            
          },
          err => {
            this.solicitudSelected.diem = '';
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
    });
  }

  public asignarPrefijo(): void {
    if (!this.solicitudSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una solicitud', 'warning');
      return;
    }

    if (this.solicitudSelected.estado !== 'X') {
      swal.fire('Alerta!', 'Sólo se puede asignar el Prefijo a Solicitudes en Proceso', 'warning');
      return;
    }

    this.ref = this.dialogService.open(AsignarPrefijoComponent, {
      header: 'Asignar Prefijo',
      width: '20%',
      data: this.solicitudSelected.prefijo
    });

    this.ref.onClose.subscribe((prefijo: string) => {
        if (!prefijo) {
          return;
        }

        this.spinner.show();
        this.solicitudSelected.usuarioPrefijo = this.authService.usuario.username;
        this.solicitudSelected.prefijo = prefijo.toUpperCase();

        this.solicitudService.assignPrefijo(this.solicitudSelected).subscribe(
          _data => {
            this.spinner.hide();
            this.buscar();
            swal.fire('Éxito!', 'Prefijo asignado exitosamente!', 'success');            
          },
          err => {
            this.solicitudSelected.prefijo = '';
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
    });
  }

  public exportXLS(): void {
    /*
    if (!this.solicitudSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una solicitud', 'warning');
      return;
    }

    this.spinner.show();

    this.valeEntelService.getDetalleValesEntel(this.valeSelected.id).subscribe(
      data => {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Vales Entel');
    
        worksheet.addRow(["Cod. Barra", "Usado", "Anulado"]);
        worksheet.columns = [{ width: 20 }, { width: 10 }, { width: 10 }];
        
        worksheet.getRow(1).eachCell(function(cell: Cell, _colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8, bold: true,  name: 'Arial' };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
        });
        
        // Contenido del archivo
        let contador: number = 2;
        data.forEach(vale => {
            worksheet.addRow([vale.codbarra, vale.usado, vale.anulado]);
    
            worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });
    
            contador++;
          })
        
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Vale_ENTEL_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
        });

        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );
    */
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.destroy();
    }
  }

}
