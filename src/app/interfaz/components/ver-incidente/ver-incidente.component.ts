import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InterfaceEjecucionLog } from '../../entity/interface-ejecucion-log';
import { InterfazStatus } from '../../entity/interfaz-status';
import { InterfazStatusService } from '../../services/interfaz-status.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ver-incidente',
  templateUrl: './ver-incidente.component.html',
  styleUrls: ['./ver-incidente.component.css']
})
export class VerIncidenteComponent implements OnInit {

  public logList: InterfaceEjecucionLog[] = [];

  public incidente!: InterfazStatus;

  constructor(private spinner: NgxSpinnerService,
              private incidenteService: InterfazStatusService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.incidente = this.config.data;

    this.spinner.show();
    this.incidenteService.getIncidentesDetalle(this.incidente.idCorrelativo).subscribe(
      logList => {
        this.logList = logList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener el detalle', 'error');
      }
    )
  }

  cerrar(): void {
    this.ref.close();
  }


}
