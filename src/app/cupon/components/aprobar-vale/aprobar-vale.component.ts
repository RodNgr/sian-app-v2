import { Component, OnInit, ViewChild } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CabValeVerde } from '../../entity/cabValeVerde';

import swal from 'sweetalert2';

interface Tipo {
  id: number;
  name: string;
}

@Component({
  selector: 'app-aprobar-vale',
  templateUrl: './aprobar-vale.component.html',
  styleUrls: ['./aprobar-vale.component.css']
})
export class AprobarValeComponent implements OnInit {

  @ViewChild('data') form!: any;

  public vale!: CabValeVerde;

  public tipos: Tipo[] = [{id: 1, name: 'Final'}, {id: 2, name: 'Provisional'}];

  public tipoSelected!: Tipo;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.vale = this.config.data;
  }

  public cancelar(): void {
    this.ref.close();
  }

  public aceptar(): void {
    if (!this.tipoSelected) {
      swal.fire({title:'Alerta!', html: 'Debe seleccionar el tipo', icon: 'warning', target: 'container', backdrop: 'false'});
      return;
    }

    this.ref.close(this.tipoSelected.id);
  }

}
