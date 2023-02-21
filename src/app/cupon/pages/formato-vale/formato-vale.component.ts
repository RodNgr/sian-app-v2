import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { FormatoValeService } from '../../services/formato-vale.service';

import { FormatoVale } from '../../entity/formato-vale';

import swal from 'sweetalert2';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-formato-vale',
  templateUrl: './formato-vale.component.html',
  styleUrls: ['./formato-vale.component.css']
})
export class FormatoValeComponent implements OnInit {

  public title: string = 'Nuevo Formato de Vale';

  public type: string = 'V';

  public formatoVale: FormatoVale = new FormatoVale();

  public uploadedFile!: File;
  
  public url!: string;

  private newImageName!: string;

  constructor(private spiner: NgxSpinnerService,
              private formatoValeService: FormatoValeService,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    this.url = environment.urlCupones;
    
    if (sessionStorage.getItem('tipoOperacion')) {
      this.type = sessionStorage.getItem('tipoOperacion')!;

      this.handledTitle();

      if (this.type !== "N") {
        if (sessionStorage.getItem('formato-vale')) {
          this.loadInfoFormato();
        } else {
          swal.fire('Error', 'Problemas al ingresar a la ventana de formatos de vales', 'error');
          this.type = 'V';
        }
      }
    } else {
      swal.fire('Error', 'Problemas al ingresar a la ventana de formatos de vales', 'error');
      this.type = 'V';
    }
  }

  private handledTitle(): void {
    if (this.type === 'N') {
      this.title = 'Nuevo Formato de Vales';
    } else if (this.type === 'E') {
      this.title = 'Editar Formato de Vales'; 
    } else if (this.type === 'V') {
      this.title = 'Ver Formato de Vales'; 
    }
  }

  private loadInfoFormato(): void {
    this.spiner.show();

    this.formatoValeService.getFormatovale(Number(sessionStorage.getItem('formato-vale')!)).subscribe(
      formatoVale => {
        this.spiner.hide();
        this.formatoVale = formatoVale;
      }, 
      err => {
        this.spiner.hide();
        swal.fire('Error', err.error.mensaje === undefined ? err.error.message : err.error.mensaje, 'error');
        this.type = 'V';
      }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl("/home/cupon/lista-formato-vale");
  }

  public save(): void {
    if (this.type === 'N') {
      this.nuevo();
    } else if (this.type === 'E') {
      this.editar();
    }
  }

  private nuevo(): void {
    if (!this.uploadedFile) {
      swal.fire('Advertencia!', 'Debe seleccionar una imagen', 'warning');
      return;
    }

    this.spiner.show();
    this.formatoVale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    this.formatoVale.imagen = this.uploadedFile.name;
    
    this.formatoValeService.subirFormatoVale(this.uploadedFile).subscribe(
      data => {
        this.newImageName = data.nombreArchivo;
        this.formatoVale.nombreAlmacenado = this.newImageName;
        
        this.formatoValeService.createFormatoVale(this.formatoVale).subscribe(
          _data => {
            sessionStorage.setItem('message', 'Formato de vale creado exitosamente!');
            this.spiner.hide();
    
            this.router.navigateByUrl("/home/cupon/lista-formato-vale");
          },
          err => {
            this.spiner.hide();
            swal.fire('Error', err.error.mensaje, 'error');
          }
        );
      },
      err => {
        this.spiner.hide();
        swal.fire('Error', err.error.mensaje, 'error');
      }
    );

  }

  private editar(): void {
    this.spiner.show();
    this.formatoVale.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;

    if (this.uploadedFile) {
      this.formatoVale.imagen = this.uploadedFile.name;

      this.formatoValeService.subirFormatoVale(this.uploadedFile).subscribe(
        data => {
          this.newImageName = data.nombreArchivo;
          this.formatoVale.nombreAlmacenado = this.newImageName;
          
          this.formatoValeService.editFormatoVale(this.formatoVale).subscribe(
            _data => {
              sessionStorage.setItem('message', 'Formato de vale editado exitosamente!');
              this.spiner.hide();
      
              this.router.navigateByUrl("/home/cupon/lista-formato-vale");
            },
            err => {
              this.spiner.hide();
              swal.fire('Error', err.error.mensaje, 'error');
            }
          );
        },
        err => {
          this.spiner.hide();
          swal.fire('Error', err.error.mensaje, 'error');
        }
      );
    } else {
      this.formatoValeService.editFormatoVale(this.formatoVale).subscribe(
        _data => {
          sessionStorage.setItem('message', 'Formato de vale editado exitosamente!');
          this.spiner.hide();
  
          this.router.navigateByUrl("/home/cupon/lista-formato-vale");
        },
        err => {
          this.spiner.hide();
          swal.fire('Error', err.error.mensaje, 'error');
        }
      );
    }
  }

  public onUpload(event: any) {
    this.uploadedFile = event.files[0];
  }

}
