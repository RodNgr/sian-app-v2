import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import swal from 'sweetalert2';

@Component({
  selector: 'app-registra-diem',
  templateUrl: './registra-diem.component.html',
  styleUrls: ['./registra-diem.component.css']
})
export class RegistraDiemComponent implements OnInit {

  public dien!: string;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.dien = this.config.data;
  }

  public registrar(): void {
    if (!this.dien) {
      swal.fire({title:'Alerta!', html: 'Debe ingresar el código DIEN', icon: 'warning', target: 'container', backdrop: 'false'});
      return;
    }

    if (this.dien.trim().length === 0) {
      swal.fire({title:'Alerta!', html: 'Debe ingresar el código DIEN', icon: 'warning', target: 'container', backdrop: 'false'});
      return;
    }

    this.ref.close(this.dien);
  }

  public cancelar(): void {
    this.ref.close();
  }

}
