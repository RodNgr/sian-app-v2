import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { InterfazProductoService } from '../../services/interfaz-producto.service';

import { CategoriaSap } from '../../entity/categoria-sap';

import swal from 'sweetalert2';

@Component({
  selector: 'app-find-categoria-sap',
  templateUrl: './find-categoria-sap.component.html',
  styleUrls: ['./find-categoria-sap.component.css']
})
export class FindCategoriaSapComponent implements OnInit {

  public categoriaSalList: CategoriaSap[] = [];

  public categoriaSapSeleccionada!: CategoriaSap;

  constructor(public spinner: NgxSpinnerService,
              private interfazProductoService: InterfazProductoService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.spinner.show();

    this.interfazProductoService.getCategoriasSap().subscribe(
      categorias => {
        this.categoriaSalList = categorias;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener las Categorías desde SAP', 'error');
      }
    )
  }

  public seleccionar(): void {
    if (!this.categoriaSapSeleccionada) {
      swal.fire({title:'Alerta!', html: 'Debe seleccionar una categoría', icon: 'warning', target: 'table', backdrop: 'false'});
      return;
    }

    this.ref.close(this.categoriaSapSeleccionada);
  }

  public cancelar(): void {
    this.ref.close();
  }

}
