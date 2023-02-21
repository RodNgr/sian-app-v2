import { Component, HostListener, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Proceso } from '../../entity/proceso';
import { DetalleArchivo } from '../../entity/detalle-archivo';

import { environment } from 'src/environments/environment';

interface Formato {
  id: number;
  nombre: string
}

@Component({
  selector: 'app-detalle-proceso',
  templateUrl: './detalle-proceso.component.html',
  styleUrls: ['./detalle-proceso.component.css']
})
export class DetalleProcesoComponent implements OnInit {

  public proceso!: Proceso;

  public isMobile: boolean = window.innerWidth < 641

  public formatos: Formato[] = [{id: 1, nombre: 'Antiguo'}, {id: 2, nombre: 'Nuevo (Octubre 2021)'}];

  public formatoSelected: Formato = {id: 2, nombre: 'Nuevo (Octubre 2021)'};

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.proceso = this.config.data;

    this.formatos.forEach(f => {
      if (f.id === this.proceso.inFormato) {
        this.formatoSelected = f;
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  public downloadFile(archivo: DetalleArchivo): void {
    console.log(this.proceso.tiProceso);
    if (this.proceso.tiProceso === 1) {
      window.location.href = environment.urlCuadratura + '/api/cuadratura/download/upload/' + archivo.noArchivo;
    } else {
      window.location.href = environment.urlCuadratura + '/api/cuadratura/download/result/' + archivo.noArchivo;
    }
  }

}
