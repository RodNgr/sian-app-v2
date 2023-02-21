import { Component, OnInit, ViewChild } from '@angular/core';

import { Table } from 'primeng/table';
import { Tienda } from '../../entity/tienda';

@Component({
  selector: 'app-lista-tienda',
  templateUrl: './lista-tienda.component.html',
  styleUrls: ['./lista-tienda.component.css']
})
export class ListaTiendaComponent implements OnInit {

  @ViewChild('dt') table!: Table;
  
  public tiendaList: Tienda[] = [];

  public tiendaSelected!: Tienda;

  public isMobile!: boolean;

  public cantidadMap = {
    '=0': 'No existen tiendas',
    '=1': 'En total hay 1 Tienda',
    'other': 'En total hay # tiendas'
  }

  constructor() { }

  ngOnInit(): void {
  }

  public add(): void {

  }

  public edit(): void {

  }

  public remove(): void {

  }

  public view(): void {

  }

  public exportList(): void {

  }

  public applyFilterGlobal($event: any, type: string){

  }

}
