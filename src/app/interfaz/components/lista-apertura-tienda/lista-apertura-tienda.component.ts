import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import swal from 'sweetalert2';

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { InterfazAperturaService } from '../../services/interfaz-apertura.service';

@Component({
  selector: 'app-lista-apertura-tienda',
  templateUrl: './lista-apertura-tienda.component.html',
  styleUrls: ['./lista-apertura-tienda.component.css'],
})
export class ListaAperturaTiendaComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  public tiendasByMarcaList = [];

  public cantidadMap = {
    '=0': 'No existen tiendas',
    '=1': 'En total hay 1 tienda',
    other: 'En total hay # tiendas',
  };

  public isMobile: boolean = window.innerWidth < 641;

  constructor(
    private spinner: NgxSpinnerService,
    private empresaService: EmpresaService,
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

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.isMobile = window.innerWidth < 641;
  }
}
