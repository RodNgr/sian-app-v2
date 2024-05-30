import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import swal from 'sweetalert2';

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { InterfazAperturaService } from '../../services/interfaz-apertura.service';
import { TiendaByEmpresaResponse } from '../../entity/TiendaByEmpresaResponse';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditarAperturaTiendaComponent } from '../editar-apertura-tienda/editar-apertura-tienda.component';

@Component({
  selector: 'app-lista-apertura-tienda',
  templateUrl: './lista-apertura-tienda.component.html',
  styleUrls: ['./lista-apertura-tienda.component.css'],
})
export class ListaAperturaTiendaComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  private ref!: DynamicDialogRef;

  public tiendasByMarcaList: TiendaByEmpresaResponse[];
  public tiendaSeleccionada: TiendaByEmpresaResponse;

  public cantidadMap = {
    '=0': 'No existen tiendas',
    '=1': 'En total hay 1 tienda',
    other: 'En total hay # tiendas',
  };

  public isMobile: boolean = window.innerWidth < 641;

  constructor(
    private spinner: NgxSpinnerService,
    private empresaService: EmpresaService,
    private dialogService: DialogService,
    private aperturaService: InterfazAperturaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.list();
  }

  public applyFilterGlobal($event: any, stringVal: any) {
    this.table.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  private list(): void {
    this.spinner.show();
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    this.aperturaService.getTiendasByEmpresa(idEmpresa).subscribe({
      next: (data) => {
        this.tiendasByMarcaList = data.filter((d) => d.tiendaSAP);
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        swal.fire(
          'Error',
          'Problemas al obtener la información de las tiendas',
          'error'
        );
      },
    });
  }

  public add() {
    this.router.navigateByUrl('/home/interfaz/apertura-tienda');
  }

  public edit() {    
    this.ref = this.dialogService.open(EditarAperturaTiendaComponent, {
      header: this.tiendaSeleccionada.nombreTienda,
      width: '75%',
      contentStyle: { 'max-height': '750px', overflow: 'auto' },
      data: {
        tiendaSAP: this.tiendaSeleccionada.tiendaSAP,
        nombreTienda: this.tiendaSeleccionada.nombreTienda
      },
    });

    this.ref.onClose.subscribe((Val: number) => {
      this.list();
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.isMobile = window.innerWidth < 641;
  }
}
