import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ReporteLibreComponent } from '../../components/reporte-libre/reporte-libre.component';
import { Reporte } from '../../entity/reporte';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { DetalleReporteComponent } from '../../components/detalle-reporte/detalle-reporte.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-transaccion',
  templateUrl: './lista-transaccion.component.html',
  styleUrls: ['./lista-transaccion.component.css']
})
export class ListaTransaccionComponent implements OnInit, OnDestroy {

  public reporteList: Reporte[] = [];

  public reporteSelected!: Reporte;

  public cantidadMap = {
    '=0': 'No existen transacciones',
    '=1': 'En total hay 1 transacción',
    'other': 'En total hay # transacciones'
  }

  private ref!: DynamicDialogRef;
  
  constructor(public spinner: NgxSpinnerService,
              private reporteService: ReporteService,
              private authService: AuthService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
    this.listaReportes();
  }

  private listaReportes(): void {
    this.spinner.show();

    this.reporteService.getListaReportes(this.authService.usuario.username).subscribe(
      reporteList => {
        this.reporteList = reporteList;
        console.log(this.reporteList);
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al listar las transacciones', 'error');
      }
    )
  }

  public ejecutarReporte() {
    this.ref = this.dialogService.open(ReporteLibreComponent, {
      header: 'Ejecutar Transacción',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"}
    });

    this.ref.onClose.subscribe((reporte: Reporte) => {
      if (reporte) {
        this.spinner.show();

        this.reporteService.addTransaccion(reporte).subscribe(
          _response => {
            this.listaReportes();
            swal.fire('Éxito!', 'La operación se realizó satisfactoriamente', 'success');
          },
          _err => {
            this.spinner.hide();
            swal.fire('Error', 'Problemas al realizar la operación', 'error');
          }
        )
      }
    });
  }

  public detalleReporte(): void {
    this.ref = this.dialogService.open(DetalleReporteComponent, {
      header: 'Detalle',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      data: this.reporteSelected.idReporte
    });
  }

  public downloadReporte() {
    console.log(this.reporteSelected);
    if (!this.reporteSelected) {
      swal.fire('Advertencia', 'Debe seleccionar un reporte', 'warning');
      return;
    }

    if (this.reporteSelected.tiReporte === 'T') {
      swal.fire('Advertencia', 'El reporte debe ser de tipo Consulta', 'warning');
      return;
    }

    this.spinner.show();
    try {
      window.location.href = environment.urlReporte + '/api/reporte/download/' + this.reporteSelected.idReporte;
      this.spinner.hide()
    } catch {
      this.spinner.hide()
      swal.fire('Error', 'Problemas al descargar el reporte', 'error');
    }
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.destroy();
    }
  }

}
