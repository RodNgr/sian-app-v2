import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ValeCorporativo } from '../../dto/vale-corporativo';

import swal from 'sweetalert2';

@Component({
  selector: 'app-reimprimir-vale',
  templateUrl: './reimprimir-vale.component.html',
  styleUrls: ['./reimprimir-vale.component.css']
})
export class ReimprimirValeComponent implements OnInit {

  public valeCorporativo: ValeCorporativo = new ValeCorporativo();

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.valeCorporativo.vale = this.config.data;
  }

  public cancelar() {
    this.ref.close();
  }

  public imprimir() {
    if (!this.valeCorporativo.motivo) {
      swal.fire({title:'Alerta!', html: 'Debe ingresar el motivo', icon: 'warning', target: 'container', backdrop: 'false'});
      return;
    }

    this.ref.close(this.valeCorporativo);
  }

}
