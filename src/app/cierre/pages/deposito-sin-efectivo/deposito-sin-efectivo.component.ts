import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Banco } from '../../entity/banco';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';

import swal from 'sweetalert2';
import { Moneda } from '../../entity/moneda';
import { TiendaConfiguracionBanco } from '../../entity/tiendaConfiguracionBanco';
import { CierreDiaService } from '../../services/cierre-dia.service';
import { CierreDto } from '../../dto/cierre-dto';
import { Deposito } from '../../entity/deposito';
import { InputNumber } from 'primeng/inputnumber';
import { utils } from 'protractor';
import { Empresa } from '../../entity/empresa';
import { Tienda } from '../../entity/tienda';
import { CuentaBancaria } from '../../entity/cuenta-bancaria';
import { formatDate } from '@angular/common';
import { Cierre } from '../../entity/cierre';
import Swal from 'sweetalert2';
import { toDecimal } from '../../../shared/util/utils';

@Component({
  selector: 'app-deposito-sin-efectivo',
  templateUrl: './deposito-sin-efectivo.component.html',
  styleUrls: ['./deposito-sin-efectivo.component.css']
})
export class DepositoSinEfectivoComponent implements OnInit {
  bancosList : Banco[] = [];
  monedaList : Moneda[] = [];
  tiendaBancoList : TiendaConfiguracionBanco[] = [];

  bancoSeleccionado!: Banco;  
  monedaSeleccionada!: Moneda;  
  tiendaBancoSeleccionado!: TiendaConfiguracionBanco;

  fechaSeleccionada!: Date;
  public montoIngresado!: number;
  public operacionIngresada!: string;
  public oficinaIngresada!: string;

  public depositosList: Deposito[] = [];
  depositoSeleccionado!: Deposito;

  public cierreDto!: CierreDto;

  @ViewChild('monto') selMonto: InputNumber;

  constructor(private spinner: NgxSpinnerService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private cierreDiaService: CierreDiaService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.cierreDto = this.config.data;
    this.fechaSeleccionada = new Date();

    this.cargarDepositos();

    this.cargarBancos().then(
      bancos => {
        this.bancosList = bancos;
        if(this.bancosList.length > 0){
          this.bancoSeleccionado = this.bancosList[0];
        }
        this.cargarMoneda().then(
          monedas => {
            this.monedaList = monedas;
            if(this.monedaList.length > 0){
              this.monedaSeleccionada = this.monedaList[0];
            }
            this.cargarCuentas();
            this.spinner.hide();
          },
          err => {this.spinner.hide();}
        )
      },
      err => {this.spinner.hide();}
    );    
  }

  private cargarBancos(): Promise<Banco[]>{
    return new Promise<Banco[]>((resolve, reject) => {
      this.cierreDiaService.getBancos(this.cierreDto).subscribe(
          bancos => {            
            resolve(bancos);
          }
        )
    })
  }

  private cargarMoneda(): Promise<Moneda[]>{
    return new Promise<Moneda[]>((resolve, reject) => {
      this.cierreDiaService.getMonedas(this.cierreDto).subscribe(
          monedas => {            
            resolve(monedas);
          }
        )
    })
  }

  cargarCuentas(){
    if(this.bancoSeleccionado && this.monedaSeleccionada){
      this.cierreDto.idBanco = this.bancoSeleccionado.idBanco;
      this.cierreDto.idMoneda = this.monedaSeleccionada.idMoneda;
      this.cierreDiaService.getCuentasBancarias(this.cierreDto).subscribe(
        cuentasBancarias => {
          this.tiendaBancoList = cuentasBancarias;
          if(this.tiendaBancoList.length > 0){
            this.tiendaBancoSeleccionado = this.tiendaBancoList[0];
          }
        },
        err => {this.spinner.hide();}
      )
    }
    else{
      this.tiendaBancoSeleccionado = null;
    }    
  }

  public agregarDeposito(){
    if(!this.bancoSeleccionado){
      swal.fire('Advertencia!','Debe seleccionar un banco','warning');
      return;
    }
    if(!this.monedaSeleccionada){
      swal.fire('Advertencia!','Debe seleccionar una moneda','warning');
      return;
    }
    if(!this.tiendaBancoSeleccionado){
      swal.fire('Advertencia!','Debe seleccionar un No. de cuenta','warning');
      return;
    }
    if (!this.montoIngresado) {      
      swal.fire({        
        title: 'Advertencia!',
        text: 'Ingrese el monto para el voucher',
        icon: 'warning',
        didClose: () => { this.selMonto.input.nativeElement.focus(); }
      });
      return;
    }
    let montoIngSoles = 0;
    let montoIngDolares = 0;
    if(this.monedaSeleccionada.idMoneda == 1){
      montoIngSoles = this.montoIngresado;
      let montoDep = this.cierreDto.montoDepositoSoles + montoIngSoles;
      montoDep = toDecimal(montoDep, 2);
      let montoRend = this.cierreDto.montoRendidoSoles;
      montoRend = toDecimal(montoRend, 2);
      if (montoDep > montoRend){
        swal.fire('Advertencia!','El monto de los depositos en SOLES ' + montoDep.toFixed(2) + ' supera al monto rendido S/. ' + montoRend.toFixed(2),'warning');
        return;
      }
    }
    if(this.monedaSeleccionada.idMoneda == 2){
      montoIngDolares = this.montoIngresado;
      let montoDep = this.cierreDto.montoDepositoDolares + montoIngDolares;
      montoDep = toDecimal(montoDep, 2);
      let montoRend = this.cierreDto.montoRendidoDolares;
      montoRend = toDecimal(montoRend, 2);
      if (montoDep > montoRend){
        swal.fire('Advertencia!','El monto de los depositos en DOLARES ' + montoDep.toFixed(2) + ' supera al monto rendido USD/. ' + montoRend.toFixed(2),'warning');
        return;
      }
    }
    if(!this.operacionIngresada){
      swal.fire('Advertencia!','Debe ingresar un No. de Ope/Tra.','warning');
      return;
    }
    if(!this.oficinaIngresada){
      swal.fire('Advertencia!','Debe ingresar una oficina','warning');
      return;
    }

    this.spinner.show();

    let totDepositoSoles = montoIngSoles;
    let totDepositoDolares = montoIngDolares;
    this.depositosList.forEach(dep => {
      if(dep.moneda.idMoneda == 1){
        totDepositoSoles += dep.monto;
      }
      else{totDepositoDolares += dep.monto;}
    })

    let deposito: Deposito = new Deposito();
    let emp: Empresa = new Empresa();
    emp.idEmpresa = this.cierreDto.idEmpresa;
    let tda: Tienda = new Tienda(this.cierreDto.idTienda, '');
    let cta: CuentaBancaria= new CuentaBancaria();
    cta.idCuenta = this.tiendaBancoSeleccionado.idCuenta;

    deposito.empresa = emp;
    deposito.tienda = tda;
    deposito.idCierre = this.cierreDto.idCierre;
    deposito.banco = this.bancoSeleccionado;
    deposito.moneda = this.monedaSeleccionada;
    deposito.cuentaBancaria = cta;
    deposito.monto = this.montoIngresado;
    deposito.fecha = formatDate(this.fechaSeleccionada, 'yyyyMMdd', 'en_US');
    deposito.noTransaccion = this.operacionIngresada;
    deposito.oficina = this.oficinaIngresada;
    deposito.cierre = new Cierre();
    deposito.cierre.empresa = emp;
    deposito.cierre.tienda = tda;
    deposito.cierre.idCierre = this.cierreDto.idCierre
    deposito.cierre.montoDepositoSoles = totDepositoSoles;
    deposito.cierre.montoDepositoDolares = totDepositoDolares;
    deposito.cierre.usuarioCreacion = this.cierreDto.idUsuario;
    deposito.cierre.fecha = deposito.fecha;

    this.cierreDiaService.saveDeposito(deposito).subscribe(
      resultado =>{
        this.cierreDto.dataModificada = true;
        if(resultado == 1){
          this.cargarDepositos();
          this.montoIngresado = null;
          this.operacionIngresada = null;
          this.oficinaIngresada = null;
          this.spinner.hide();
        }
        else{ //trae mensaje de validación
          this.spinner.hide();
          swal.fire('Advertencia!', 'No se puede grabar un No. de Ope/Tra. que ya fue ingresado anteriormente.', 'warning');
        }
      },
      err =>{
        this.spinner.hide();
        swal.fire('Error', 'Error al intentar guardar el depósito','error');
      }
    )
  }

  private cargarDepositos(){    
    this.cierreDiaService.getDepositosPorTienda(this.cierreDto).subscribe(
      depositos => {        
        this.depositosList = depositos;
      }
    )
  }

  public changeBanco(){
    this.cargarCuentas();    
  }

  public changeMoneda(){
    this.cargarCuentas();    
  }

  public eliminaDeposito(deposito: Deposito){
    this.spinner.show();

    let montoIngSoles = 0;
    let montoIngDolares = 0;
    if(deposito.moneda.idMoneda == 1){
      montoIngSoles = deposito.monto;      
    }
    if(deposito.moneda.idMoneda == 2){
      montoIngDolares = deposito.monto;      
    }    
    let totDepositoSoles = montoIngSoles * -1;
    let totDepositoDolares = montoIngDolares * -1;
    this.depositosList.forEach(dep => {
      if(dep.moneda.idMoneda == 1){
        totDepositoSoles += dep.monto;
      }
      else{totDepositoDolares += dep.monto;}
    })

    let deposit: Deposito = new Deposito();
    let emp: Empresa = new Empresa();
    emp.idEmpresa = deposito.empresa.idEmpresa;
    let tda: Tienda = new Tienda(deposito.tienda.tienda, '');
    let cta: CuentaBancaria= new CuentaBancaria();
    cta.idCuenta = deposito.cuentaBancaria.idCuenta;

    deposit.empresa = emp;
    deposit.tienda = tda;
    deposit.idCierre = deposito.idCierre;
    deposit.idDeposito = deposito.idDeposito;
    deposit.cierre = new Cierre();
    deposit.cierre.empresa = emp;
    deposit.cierre.tienda = tda;
    deposit.cierre.idCierre = deposito.idCierre;
    deposit.cierre.montoDepositoSoles = totDepositoSoles;
    deposit.cierre.montoDepositoDolares = totDepositoDolares;
    deposit.cierre.usuarioCreacion = this.cierreDto.idUsuario;
    deposit.cierre.fecha = deposito.fecha;

    this.cierreDiaService.deleteDeposito(deposit).subscribe(
      resultado =>{
        this.cierreDto.dataModificada = true;
        this.cargarDepositos();
        this.spinner.hide();
      },
      err =>{
        this.spinner.hide();
        swal.fire('error', 'Error al intentar eliminar el depósito','error');
      }
    )
  }

  public cancelar(){
    this.ref.close(this.cierreDto);
  }

  ngOnDestroy(): void {
    this.cancelar();      
  }
}
