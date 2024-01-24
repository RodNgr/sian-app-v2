import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { CambioCuentaService } from '../../services/cambio-cuenta.service';
import { CuentaBancarias, cbobancos } from '../../entity/CuentaBancaria';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Empresa } from '../../entity/empresa';
import { ReporteService } from '../../services/reporte.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Banco } from '../../entity/banco';
import { Moneda } from '../../entity/moneda';
import { CuentaBancariasGeneral } from '../../entity/CuentaBancaria';
@Component({
  selector: 'app-editar-cuenta',
  templateUrl: './editar-cuenta.component.html',
  styleUrls: ['./editar-cuenta.component.css']
})
export class EditarCuentaComponent implements OnInit {  
  
  public IdCuenta: number = 0;
  public Numero: string;
  public Cuenta: string;
  private urlCuentaBancaria: String;
  public CuentaSel!: CuentaBancariasGeneral;
  private boValida:boolean=false;
  public stValida:string='';
  public bancoss: cbobancos[] = [
    /* {idCuenta: 0, banco: 'Seleccionar banco',cuenta:'',moneda:'',numero:'', cuentaDescipcion: '--- Seleccionar banco  ---'}, */
  ];
  public empresaList: Empresa[] = [];
  public bancoList: Banco[] = [];
  public monedaList: Moneda[] = [];

  public empresSelect: Empresa;
  public bancoSelect: Banco;
  public monedaSelect: Moneda;

  constructor(public ref: DynamicDialogRef,
              private router: Router,
              public config: DynamicDialogConfig,
              private cambioCuentaService: CambioCuentaService,
              private reporteService: ReporteService,
              private spinner: NgxSpinnerService) { 
    this.urlCuentaBancaria = environment.urlCierre;
    if(this.config.data ===null || this.config.data === undefined){
      this.config.data = new CuentaBancarias();
      this.config.data.idCuenta=0;
    }
    this.CuentaSel =this.config.data;
  }

  ngOnInit(): void {
    this.tiendas();
    this.banco();
    this.moneda();
   
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
  }

  private valida(): boolean{
    this.boValida = false;

    if(this.CuentaSel.numero===''){
      this.stValida='Ingresar Numero de Cuenta';
      this.boValida=true;
    }
    if(this.CuentaSel.cuentaContable===''){
      this.stValida='Ingresar Cuenta Contable';
      this.boValida=true;
    }

    return this.boValida;
  }

  public Guardar(){
    
    if(this.valida()){
      swal.fire('Información', this.stValida, 'info');
      return;
    }

    this.CuentaSel.idEmpresa=this.empresSelect.idEmpresa;
    this.CuentaSel.empresa=this.empresSelect.nombre;

    this.CuentaSel.idBanco=this.bancoSelect.idBanco;
    this.CuentaSel.banco=this.bancoSelect.nombre;

    this.CuentaSel.idMoneda=this.monedaSelect.idMoneda;
    this.CuentaSel.moneda=this.monedaSelect.nombre;

    this.cambioCuentaService.GuardarCuentaBancaria(this.CuentaSel).subscribe(
      result => {
        swal.fire(
          'Ejecutado!',
          'Se guardaron los cambios registrados!',
          'success'
        )
        this.ref.close(1);
      }
    );


  }



  private tiendas(){
    this.reporteService.getEmpresas().subscribe(
      empresaList => {

        this.empresaList = empresaList;
        if(this.config.data.idCuenta){
          this.empresSelect = new Empresa();
          this.empresSelect =empresaList.find(x=>x.idEmpresa == this.CuentaSel.idEmpresa);
        }else{
          this.empresSelect =empresaList[0];
        }
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las empresas', 'error');
      }
    );
  }

  private banco(){
    this.cambioCuentaService.getBancos().subscribe(
      bancoList => {

        this.bancoList = bancoList;
        if(this.config.data.idCuenta){
          this.bancoSelect = new Banco(0,'');
          this.bancoSelect =bancoList.find(x=>x.idBanco == this.CuentaSel.idBanco);
        }else{
          this.bancoSelect =bancoList[0];
        }
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de bancos', 'error');
      }
    );
  }

  private moneda(){
    this.cambioCuentaService.getMoneda().subscribe(
      monedaList => {
        this.monedaList = monedaList;
        if(this.config.data.idCuenta){
        this.monedaSelect = new Moneda();
        this.monedaSelect =monedaList.find(x=>x.idMoneda == this.CuentaSel.idMoneda);
        }else{
          this.monedaSelect =monedaList[0];
        }
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de tipo de moneda', 'error');
      }
    );
  }



}
