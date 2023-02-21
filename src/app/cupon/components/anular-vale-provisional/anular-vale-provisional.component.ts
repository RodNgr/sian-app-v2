import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { ValeService } from '../../services/vale.service';

import { DatePipe } from '@angular/common';

import { AnulacionProvisional } from '../../dto/anulacion-provisional';
import { CabValeVerde } from '../../entity/cabValeVerde';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentoSAP } from '../../dto/documento-sap';
import { FileUpload } from 'primeng/fileupload';

import swal from 'sweetalert2';

@Component({
  selector: 'app-anular-vale-provisional',
  templateUrl: './anular-vale-provisional.component.html',
  styleUrls: ['./anular-vale-provisional.component.css']
})
export class AnularValeProvisionalComponent implements OnInit {

  public documentosCobranza: DocumentoSAP[] = [];

  public documentoSeleccionado: DocumentoSAP = new DocumentoSAP();

  private vale!: CabValeVerde;

  public vales: string[] = [];

  private pipe: DatePipe = new DatePipe('en-US');

  constructor(private spinner: NgxSpinnerService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig,
              private valeService: ValeService) { }

  ngOnInit(): void {
    this.vale = this.config.data;
    this.spinner.show();

    this.valeService.findDocumentosContablesReemplazo(this.vale.id).subscribe(
      json => {
        this.documentosCobranza = json.data;

        this.documentosCobranza.forEach(doc => {
          doc.descripcion = doc.facturaFull + ' -> ' + doc.razonSocial + '. Fecha: ' + this.pipe.transform(doc.fechaEmision, 'dd/MM/yyyy') + '. Monto: ' + doc.vaMontoTotal;
        })

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire({title:'Error', html: 'Problemas al obtener la información de los Documentos de Cobranza', icon: 'error', target: 'table', backdrop: 'false'});
      }
    );
  }

  public uploadFile(event: any, fileUpload: FileUpload): void {
    if (event.files) {
      const file: File = event.files[0];
      this.vales = [];

      const readUploadedFileAsText = (inputFile: File) => {
        const temporaryFileReader = new FileReader();
      
        return new Promise((resolve: any, reject) => {
          temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject('No se pudo leer el archivo');
          };
      
          temporaryFileReader.onload = () => {
            let data: string[] | undefined;
            data = temporaryFileReader.result?.toString().split(/\r\n|\r|\n/);
            resolve(data);
          };

          temporaryFileReader.readAsText(inputFile);
        });
      };

      const observable = from(readUploadedFileAsText(file));

      this.spinner.show();
      observable.subscribe(
        (data: any) => {
          if (data) {
            this.vales = data;
          }

          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire({title:'Error', html: 'Problemas al leer el archivo', icon: 'error', target: 'container', backdrop: 'false'});
        }
      )
    }

    fileUpload.clear();
  }

  public aceptar(): void {
    console.log(this.documentoSeleccionado);

    if (!this.documentoSeleccionado) {
      swal.fire('Advertencia!', 'Debe seleccionar un documento', 'warning');
      return;
    }

    if (!this.documentoSeleccionado.serie) {
      swal.fire('Advertencia!', 'Debe seleccionar un documento', 'warning');
      return;
    }

    if (!this.vales) {
      this.vales = [];
    }

    let anulacionDto: AnulacionProvisional = new AnulacionProvisional();
    anulacionDto.documento = this.documentoSeleccionado;
    anulacionDto.vales = this.vales;

    this.ref.close(anulacionDto);
  }

  public cancelar(): void {
    this.ref.close();
  }

}
