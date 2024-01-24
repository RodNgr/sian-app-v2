import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { CambioCuentaService } from '../../services/cambio-cuenta.service';
import { CuentaBancarias, cbobancos } from '../../entity/CuentaBancaria';
import * as $ from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-cuenta-bancaria',
  templateUrl: './editar-cuenta-bancaria.component.html',
  styleUrls: ['./editar-cuenta-bancaria.component.css']
})
export class EditarCuentaBancariaComponent implements OnInit {  
  
  public IdCuenta: number = 0;
  public Numero: string;
  public Cuenta: string;
  private urlCuentaBancaria: String;
  public CuentaSel!: CuentaBancarias;

  public bancoss: cbobancos[] = [
    /* {idCuenta: 0, banco: 'Seleccionar banco',cuenta:'',moneda:'',numero:'', cuentaDescipcion: '--- Seleccionar banco  ---'}, */
  ];

  constructor(public ref: DynamicDialogRef,
              private router: Router,
              public config: DynamicDialogConfig,
              private cambioCuentaService: CambioCuentaService) { 
    this.urlCuentaBancaria = environment.urlCierre;
    this.CuentaSel =this.config.data;
  }

  ngOnInit(): void {
    this.cambioCuentaService.getBancosCambioCuenta(this.CuentaSel.marca,this.CuentaSel.codMoneda).subscribe(
      Bancos2 => {
        for (let index = 0; index < Bancos2.length; index++) {      
          this.bancoss.push({ idCuenta: Bancos2[index].idCuenta,
                              codBanco: Bancos2[index].codBanco,
                              banco: Bancos2[index].banco,
                              cuenta:Bancos2[index].cuenta,
                              moneda:Bancos2[index].moneda,
                              numero:Bancos2[index].numero,
                              codNumero:Bancos2[index].codNumero,
                              cuentaDescipcion: Bancos2[index].banco+'  '+ Bancos2[index].moneda+' N° Cuenta:'+Bancos2[index].numero
                            },);
        }
        this.selBanco();      
      }
    )

    //this.Banco = this.config.data.codBanco;    
    this.Numero = this.config.data.numero;
    this.Cuenta = this.config.data.cuenta;

    if (this.bancoss) {
     
     
    }
  }
  private selBanco(){
    this.IdCuenta=this.CuentaSel.idCuenta;
  }
  public MostrarDatos(){
    this.CuentaSel.idCuenta=this.IdCuenta;

    var selbanco = this.bancoss.find(banco => banco.idCuenta === this.IdCuenta);
    this.CuentaSel.banco = selbanco.banco;
    this.CuentaSel.cuenta = selbanco.cuenta;
    this.CuentaSel.moneda = selbanco.moneda;
    this.CuentaSel.numero = selbanco.numero;
    this.CuentaSel.codBanco = selbanco.codBanco;
    this.CuentaSel.codNumero = selbanco.codNumero;
  }

  public Guardar(){
    this.cambioCuentaService.GuardarCuenta(
      this.CuentaSel.idCuenta,
      this.CuentaSel.marca,
      this.CuentaSel.codTienda,
      this.CuentaSel.codBanco,
      this.CuentaSel.codMoneda,
      this.CuentaSel.numero,
      this.CuentaSel.cuenta).subscribe(
      result => {
        Swal.fire(
          'Ejecutado!',
          'Se guardaron los cambios registrados!',
          'success'
        )
        this.ref.close(1);
      }
    );
  }
}
