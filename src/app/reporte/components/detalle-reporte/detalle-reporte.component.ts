import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Reporte } from '../../entity/reporte';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-reporte',
  templateUrl: './detalle-reporte.component.html',
  styleUrls: ['./detalle-reporte.component.css']
})
export class DetalleReporteComponent implements OnInit {

  public reporte: Reporte = new Reporte();

  public lan: string[] = ['sql'];

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    const idReporte: number = this.config.data;

    this.spinner.show();
    this.reporteService.getReporte(idReporte).subscribe(
      reporte => {
        this.reporte = reporte;

        console.log(this.reporte);
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información del reporte', 'error');
      }
    );
  }

  public cerrar(): void {
    this.ref.close();
  }

}
