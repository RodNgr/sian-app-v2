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
  
  public Banco: string = '0';
  public Numero: string;
  public Cuenta: string;
  private urlCuentaBancaria: String;

  public bancoss: cbobancos[] = [
    {codBanco: 0, banco: 'Seleccionar banco' },
  ];

  constructor(public ref: DynamicDialogRef,
              private router: Router,
              public config: DynamicDialogConfig,
              private cambioCuentaService: CambioCuentaService) { 
    this.urlCuentaBancaria = environment.urlCierre;
  }

  ngOnInit(): void {
    this.cambioCuentaService.getBancos().subscribe(
      Bancos2 => {
        for (let index = 0; index < Bancos2.length; index++) {
          var element = Bancos2[index].banco;
          var element1 = Bancos2[index].codBanco;          
          this.bancoss.push({ codBanco: element1, banco: element },);
        }        
      }
    )

    this.Banco = this.config.data.codBanco;    
    this.Numero = this.config.data.numero;    
    this.Cuenta = this.config.data.cuenta;    

    this.bancoss = this.bancoss.filter(r => {          
      return r.banco = this.config.data.banco;
    });

    if (this.config.data.codBanco) {
      this.bancoss.forEach(r => {              
        if (r.codBanco.toString() === this.config.data.codBanco.toString()) {
          this.Banco = r.codBanco.toString();              
          
          $("#Banco2").val(r.banco);

        }
      })
    }
  }

  public MostrarDatos(){
    this.cambioCuentaService.getCuentaBancariaSeleccionada(this.config.data.marca,this.config.data.codTienda,this.Banco,this.config.data.codMoneda).subscribe(
      result => {
        if(result.length == 0){
          this.Numero = "";    
          this.Cuenta = "";    
        } else {
          this.Numero = result[0].numero;
          this.Cuenta = result[0].cuenta;   
        }
      }
    )
  }

  public Guardar(){
    this.cambioCuentaService.GuardarCuenta(this.config.data.marca,this.config.data.codTienda,this.Banco,this.config.data.codMoneda,this.Numero,this.Cuenta).subscribe(
      result => {
        Swal.fire(
          'Ejecutado!',
          'Se guardaron los cambios registrados!',
          'success'
        )
        this.ref.close(1);
      }
    )
  }
}
