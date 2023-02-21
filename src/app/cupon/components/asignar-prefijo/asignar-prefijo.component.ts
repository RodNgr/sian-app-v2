import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-prefijo',
  templateUrl: './asignar-prefijo.component.html',
  styleUrls: ['./asignar-prefijo.component.css']
})
export class AsignarPrefijoComponent implements OnInit {

  public prefijo!: string;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.prefijo = this.config.data;
  }

  public registrar(): void {
    if (!this.prefijo) {
      swal.fire({title:'Alerta!', html: 'Debe ingresar el Prefijo', icon: 'warning', target: 'container', backdrop: 'false'});
      return;
    }

    if (this.prefijo.trim().length !== 8) {
      swal.fire({title:'Alerta!', html: 'El Prefijo debe tener 8 caracteres', icon: 'warning', target: 'container', backdrop: 'false'});
      return;
    }

    this.ref.close(this.prefijo);
  }

  public cancelar(): void {
    this.ref.close();
  }

}
