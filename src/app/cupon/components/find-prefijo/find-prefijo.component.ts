import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { PrefijoService } from '../../services/prefijo.service';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Prefijo } from '../../entity/prefijo';

import swal from 'sweetalert2'

@Component({
  selector: 'app-find-prefijo',
  templateUrl: './find-prefijo.component.html',
  styleUrls: ['./find-prefijo.component.css']
})
export class FindPrefijoComponent implements OnInit {

  public prefijoList: Prefijo[] = [];

  public prefijoSelected!: Prefijo;

  constructor(private spinner: NgxSpinnerService,
              private prefijoService: PrefijoService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.spinner.show();

    this.prefijoService.getPrefijos().subscribe(
      prefijoList => {
        this.prefijoList = prefijoList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al obtener la información de los Prefijos', icon: 'error', target: 'table', backdrop: 'false'});
      }
    );
  }

  public cancelar(): void {
    this.ref.close();
  }

  public aceptar(): void {
    if (!this.prefijoSelected) {
      swal.fire({title:'Alerta!', html: 'Debe seleccionar un prefijo', icon: 'warning', target: 'table', backdrop: 'false'});
      return;
    }

    this.ref.close(this.prefijoSelected);
  }

}
