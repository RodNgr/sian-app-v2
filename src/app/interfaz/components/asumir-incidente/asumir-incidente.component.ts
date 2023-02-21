import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InterfazStatus } from '../../entity/interfaz-status';
import swal from 'sweetalert2';

@Component({
  selector: 'app-asumir-incidente',
  templateUrl: './asumir-incidente.component.html',
  styleUrls: ['./asumir-incidente.component.css']
})
export class AsumirIncidenteComponent implements OnInit {

  public incidente: InterfazStatus = new InterfazStatus();

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.incidente = this.config.data;
  }

  public aceptar() {
    if (!this.incidente.mensaje && this.incidente.mensaje) {
      swal.fire({title:'Alerta!', html: 'Debe ingresar el motivo', icon: 'warning', target: 'msg', backdrop: 'false'});
      return;
    }

    this.ref.close(this.incidente.mensaje);
  }

  public cancelar() {
    this.ref.close();
  }

}
