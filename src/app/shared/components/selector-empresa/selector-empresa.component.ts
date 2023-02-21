import { Component, OnInit } from '@angular/core';

import { EmpresaService } from '../../services/empresa.service';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Empresa } from '../../entity/empresa';

import swal from 'sweetalert2';

@Component({
  selector: 'app-selector-empresa',
  templateUrl: './selector-empresa.component.html',
  styleUrls: ['./selector-empresa.component.css']
})
export class SelectorEmpresaComponent implements OnInit {

  public empresas: Empresa[] = [];

  public empresaSeleccionada!: Empresa;

  constructor(private empresaService: EmpresaService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.empresas = this.empresaService.getEmpresas();
    this.empresaSeleccionada = this.empresaService.getEmpresaSeleccionada();
  }

  public cancelar(): void {
    this.ref.close();
  }

  public seleccionar(): void {
    if (!this.empresaSeleccionada) {
      swal.fire({title:'Alerta!', html: 'Debe seleccionar una empresa', icon: 'warning', target: 'table', backdrop: 'false'});
      return;
    }

    this.ref.close(this.empresaSeleccionada);
  }

}
