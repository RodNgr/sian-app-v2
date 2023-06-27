import { Component, OnInit } from '@angular/core';
import { CuentaBancaria } from '../../entity/cuenta-bancaria';

@Component({
  selector: 'app-cambio-cuenta',
  templateUrl: './cambio-cuenta.component.html',
  styleUrls: ['./cambio-cuenta.component.css']
})
export class CambioCuentaComponent implements OnInit {

  public SeleccionarCuenta: string = '0';
  public CuentasTiendas: CuentaBancaria[] = [];
  public CuentaSelected!: CuentaBancaria;
  constructor() { }

  ngOnInit(): void {
  }

  onRowSelect(event) {
    
  }

}
