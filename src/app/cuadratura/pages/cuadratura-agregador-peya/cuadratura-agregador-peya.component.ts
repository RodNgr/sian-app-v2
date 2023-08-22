import { Component, HostListener, OnInit, Pipe } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../../auth/services/auth.service';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { ProcesoService } from '../../services/proceso.service';

import { Empresa } from '../../../shared/entity/empresa';
import { DetalleArchivo } from '../../entity/detalle-archivo';
import { Proceso } from '../../entity/proceso';

import { DatePipe } from '@angular/common';

import swal from 'sweetalert2';

import { environment } from 'src/environments/environment';

interface Formato {
  id: number;
  nombre: string
}

@Component({
  selector: 'app-cuadratura-agregador-peya',
  templateUrl: './cuadratura-agregador-peya.component.html',
  styleUrls: ['./cuadratura-agregador-peya.component.css']
})

export class CuadraturaAgregadorPeyaComponent implements OnInit {

  public proceso: Proceso = new Proceso();

  public marcas: Empresa[] = [];

  public marcaSelected!: Empresa;

  public formatos: Formato[] = [{id: 1, nombre: 'Antiguo'}, {id: 2, nombre: 'Nuevo (Octubre 2021)'}];

  public formatoSelected: Formato = {id: 2, nombre: 'Nuevo (Octubre 2021)'};

  public fileResumen: File[] = [];

  // public fileComprobante: File[] = [];

  public isMobile: boolean = window.innerWidth < 641

  public urlUpload!: string;

  private pipe: DatePipe = new DatePipe("en-US");

  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private authService: AuthService,
              private empresaService: EmpresaService,
              private procesoService: ProcesoService) { }

  ngOnInit(): void {
    this.marcas = this.empresaService.getEmpresas();
    this.urlUpload = environment.urlCuadratura + '/api/cuadratura/upload';
  }

  public cancelar(): void {
    this.router.navigateByUrl('/home/cuadratura/lista-cuadratura-peya');
  }

  public save(): void {
    if (this.fileResumen.length == 0) {
      swal.fire('Advertencia!', 'Debe seleccionar el Archivo de Resumen', 'warning');
      return;
    }  
    
    // if (this.fileComprobante.length == 0) {
    //   swal.fire('Advertencia!', 'Debe seleccionar por lo menos un Archivo de Comprobante', 'warning');
    //   return;
    // }

    if (this.proceso.pcComision === undefined) {
      swal.fire('Advertencia!', 'Debe ingresar el % de Comisión', 'warning');
      return;
    }

    this.spinner.show();
    this.proceso.idCreacion = this.authService.usuario.username;
    this.proceso.idEmpresa = this.marcaSelected.idEmpresa;
    this.proceso.inFormato = this.formatoSelected.id;
    this.proceso.esProceso = 'P';
    this.proceso.tiProceso = 4
    this.proceso.archivos = [];
    
    const filesToSend: File[] = [];
    const promiseList:Observable<any>[] = [];

    filesToSend.push(...this.fileResumen);
    // filesToSend.push(...this.fileComprobante);

    filesToSend.forEach(file => {
      promiseList.push(this.procesoService.uploadFile(file));
    });

    if (promiseList.length) {
      forkJoin(promiseList).subscribe(
        files => {
          files.forEach(file=>{
            let archivo: DetalleArchivo = new DetalleArchivo();
            archivo.noArchivo = file.nombreUpload;
            archivo.noRealArchivo = file.nombreReal;
            archivo.tiArchivo = file.tipo;

            this.proceso.archivos.push(archivo);
          });

          this.proceso.deProceso = 'PEYA ' + this.marcaSelected.abreviatura + ' ' + 
            this.pipe.transform(this.proceso.feInicioPeriodo, 'dd.MM.yyyy') + ' al ' + 
            this.pipe.transform(this.proceso.feFinPeriodo, 'dd.MM.yyyy');

          this.procesoService.addProceso(this.proceso).subscribe(
            _response => {
              this.spinner.hide();
              this.router.navigateByUrl('/home/cuadratura/lista-cuadratura-peya');
            },
            err=> {
              this.spinner.hide();
              swal.fire('Problemas al guardar el proceso', err.error.error, 'error');
            }
          );
        },
        err => {
          this.spinner.hide();
          swal.fire('Problemas al subir los archivos', err.error.error, 'error');
        }
      );
    }
  }

  public onSelectResumen(event: any): void {
    this.fileResumen = [];
    for(let file of event.currentFiles) {
      this.fileResumen.push(file);
    };
  }

  // public onSelectComprobante(event: any): void {
  //   this.fileComprobante = [];
  //   for(let file of event.currentFiles) {
  //     this.fileComprobante.push(file);
  //   };
  // }

  public onError(event:any) {
    swal.fire('Error', 'Problemas al subir el archivo!', 'error');
  }

  public onCancelResumen() {
    this.fileResumen = [];
  }

  // public onCancelComprobante() {
  //   this.fileComprobante = [];
  // }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  public cambiarEmpresa(): void {
    if (this.marcaSelected.idEmpresa === 8) {
      this.proceso.vaBolsa = 0.30
    } else if (this.marcaSelected.idEmpresa === 4) {
      this.proceso.vaBolsa = 0
    } else {
      this.proceso.vaBolsa = 0.20
    }
    console.log(this.marcaSelected);
  }
}
