import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { ConfiguracionService } from '../../services/configuracion.service';

import { Table } from 'primeng/table';

import { Configuracion } from '../../entity/configuracion';

import swal from 'sweetalert2';

@Component({
  selector: 'app-lista-configuracion-sovos',
  templateUrl: './lista-configuracion-sovos.component.html',
  styleUrls: ['./lista-configuracion-sovos.component.css']
})
export class ListaConfiguracionSovosComponent implements OnInit {

  @ViewChild('dt') table!: Table;
  
  public configuracionList: Configuracion[] = [];

  private clonedConfiguraciones: { [s: string]: Configuracion; } = {};

  public cantidadMap = {
    '=0': 'No existen configuraciones',
    '=1': 'En total hay 1 configuración',
    'other': 'En total hay # configuraciones'
  }

  public isMobile: boolean = window.innerWidth < 641

  constructor(private configuracionService: ConfiguracionService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.configuracionService.getConfiguraciones().subscribe(
      configuracionList => {
        this.configuracionList = configuracionList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las configuraciones', 'error');
      }
    )
  }

  public applyFilterGlobal($event:any , stringVal: any) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  onRowEditInit(configuracion: Configuracion) {
    this.clonedConfiguraciones[configuracion.codigo] = {...configuracion};
  }

  onRowEditSave(configuracion: Configuracion) {
    this.spinner.show();
    delete this.clonedConfiguraciones[configuracion.codigo];

    this.configuracionService.updateConfiguracion(configuracion).subscribe(
      _json => {
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al actualizar la configuración', 'error');
      }
    )
  }

  onRowEditCancel(configuracion: Configuracion, index: number) {
      this.configuracionList[index] = this.clonedConfiguraciones[configuracion.codigo];
      delete this.clonedConfiguraciones[configuracion.codigo];
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
