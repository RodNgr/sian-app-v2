import { Component, HostListener, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NgxSpinnerService } from 'ngx-spinner';

import { ValeService } from '../../services/vale.service';

import { DocumentoSAP } from '../../dto/documento-sap';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import swal from 'sweetalert2';

@Component({
  selector: 'app-find-documento-cobranza',
  templateUrl: './find-documento-cobranza.component.html',
  styleUrls: ['./find-documento-cobranza.component.css']
})
export class FindDocumentoCobranzaComponent implements OnInit {

  public documentoList: DocumentoSAP[] = [];

  public documentoSelected: DocumentoSAP = new DocumentoSAP();

  public descripcion: string = '';

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  private pipe: DatePipe = new DatePipe('en-US');

  public cantidadMap = {
    '=0': 'No existen registros',
    '=1': 'En total hay 1 registro',
    'other': 'En total hay # registros'
  }

  public isMobile: boolean = window.innerWidth < 641

  constructor(private spinner: NgxSpinnerService,
              private valeService: ValeService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.feInicio.setDate(this.feInicio.getDate() - 7);
    this.buscar()
  }

  public buscar() {
    this.spinner.show();

    const inicio = this.pipe.transform(this.feInicio, 'yyyMMdd') || '';
    const fin = this.pipe.transform(this.feFin, 'yyyMMdd') || '';

    this.valeService.findDocumentosContables(this.descripcion, inicio, fin).subscribe(
      json => {
        this.documentoList = json.data;

        let secuencial: number = 1;
        this.documentoList.forEach(d => {
          d.id = secuencial;
          secuencial = secuencial + 1;
        })

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al obtener la información de los Documentos de Cobranza', icon: 'error', target: 'table', backdrop: 'false'});
      }
    );
  }

  public cancelar(): void {
    this.ref.close();
  }

  public aceptar(): void {
    if (!this.documentoSelected) {
      swal.fire({title:'Alerta!', html: 'Debe seleccionar un documento de cobranza', icon: 'warning', target: 'table', backdrop: 'false'});
      return;
    }

    this.ref.close(this.documentoSelected);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
