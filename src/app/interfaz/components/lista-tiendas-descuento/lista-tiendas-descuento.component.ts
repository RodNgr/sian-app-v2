import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import swal from 'sweetalert2';

import { CuponesOmnicanalService } from 'src/app/shared/services/cupon-omnicanal.service';

@Component({
  selector: 'app-lista-tiendas-descuento',
  templateUrl: './lista-tiendas-descuento.component.html',
  styleUrls: ['./lista-tiendas-descuento.component.css'],
})
export class ListaTiendasBeneficioComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  public tiendaBeneficioLista = [];

  public cantidadMap = {
    '=0': 'No existen tiendas',
    '=1': 'En total hay 1 tienda',
    other: 'En total hay # tiendas',
  };

  public isMobile: boolean = window.innerWidth < 641;

  constructor(
    private spinner: NgxSpinnerService,
    private cuponOmnicanalService: CuponesOmnicanalService,
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
    this.cuponOmnicanalService.listarTiendas().subscribe({
      next: (data) => {
        data.subscribe({
          next: (list) => { this.tiendaBeneficioLista = list; this.spinner.hide() } 
        });
      },
      error: () => {
        this.spinner.hide();
        swal.fire(
          'Error',
          'Problemas al obtener la información de los feriados',
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
