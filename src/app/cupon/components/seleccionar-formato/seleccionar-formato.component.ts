import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from '../../../shared/services/empresa.service';
import { FormatoValeService } from '../../services/formato-vale.service';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { FormatoVale } from '../../entity/formato-vale';

import swal from 'sweetalert2';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seleccionar-formato',
  templateUrl: './seleccionar-formato.component.html',
  styleUrls: ['./seleccionar-formato.component.css']
})
export class SeleccionarFormatoComponent implements OnInit {

  public formatos: FormatoVale[] = [];

  public url!: string;

  constructor(private spinner: NgxSpinnerService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private formatoService: FormatoValeService,
              private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.url = environment.urlCupones;

    this.loadInfo();
  }

  onCustomUpload(event: any, fileUpload: FileUpload): void {
    this.spinner.show();

    const formatoVale: FormatoVale = new FormatoVale();

    formatoVale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    formatoVale.imagen = event.files[0].name;
    formatoVale.origen = '2';
    
    this.formatoService.subirFormatoVale(event.files[0]).subscribe(
      data => {
        formatoVale.nombreAlmacenado = data.nombreArchivo;
        
        this.formatoService.createFormatoVale(formatoVale).subscribe(
          _data => {
            this.spinner.hide();
            this.loadInfo();
          },
          err => {
            this.spinner.hide();
            swal.fire({title:'Error', html: err.error.mensaje, icon: 'error', target: 'container', backdrop: 'false'});
          }
        );
      },
      err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: err.error.mensaje, icon: 'error', target: 'container', backdrop: 'false'});
      }
    );

    fileUpload.clear();
  }

  private loadInfo() {
    this.spinner.show();
    this.formatoService.getFormatosValesCortesia().subscribe(
      formatos => {
        this.formatos = formatos;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: err.error.mensaje, icon: 'error', target: 'container', backdrop: 'false'});
      }
    );
  }

  public seleccionarImagen(formatoVale: FormatoVale) {
    if (!formatoVale) {
      swal.fire({title:'Alerta!', html: 'Debe seleccionar un formato', icon: 'warning', target: 'container', backdrop: 'false'});
      return;
    }

    this.ref.close(formatoVale);
  }

}
