import { Component, OnInit } from '@angular/core';
import { Moneda } from '../../entity/moneda';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-deposito-con-efectivo',
  templateUrl: './deposito-con-efectivo.component.html',
  styleUrls: ['./deposito-con-efectivo.component.css']
})
export class DepositoConEfectivoComponent implements OnInit {
  monedas : Moneda[];
  monedaSeleccionada !: Moneda;
  fechaSeleccionada!: Date;

  constructor(public ref: DynamicDialogRef) { 
    this.monedas = [
      { idEmpresa: 1,
        idTienda: 1,
        idMoneda: 1,
        nombre: 'SOLES',
        nombreCorto: 'S/',
        aplicaFaltante!: 0},
        { idEmpresa: 1,
          idTienda: 1,
          idMoneda: 2,
          nombre: 'Dolares',
          nombreCorto: '$',
          aplicaFaltante!: 0}
    ];
    this.monedaSeleccionada = this.monedas[0];
  }

  ngOnInit(): void {
    this.fechaSeleccionada = new Date();
  }

  public changeDate(){

  }

  public seleccionar(){
    
  }

  public cancelar(){
    this.ref.close(false);
  }
}
