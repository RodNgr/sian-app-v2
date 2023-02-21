import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CierreOtroMotivo } from '../../entity/cierre-otro-motivo';
import { Moneda } from '../../entity/moneda';
import swal from 'sweetalert2';
import { InputNumber } from 'primeng/inputnumber';
import { CierreDto } from '../../dto/cierre-dto';
import { CierreOtro } from '../../entity/cierre-otro';
import { Empresa } from '../../entity/empresa';
import { Tienda } from '../../entity/tienda';
import { AuthService } from '../../../auth/services/auth.service';
import { CierreDiaService } from '../../services/cierre-dia.service';
import { Employee } from '../../entity/employee';

@Component({
  selector: 'app-otras-cuadraturas',
  templateUrl: './otras-cuadraturas.component.html',
  styleUrls: ['./otras-cuadraturas.component.css']
})
export class OtrasCuadraturasComponent implements OnInit {
  motivos : CierreOtroMotivo[];
  monedas : Moneda[];
  responsables : Employee[];

  motivoSeleccionado: CierreOtroMotivo;
  motivoBFResponsable: boolean = true;
  monedaSeleccionada !: Moneda;  
  responsableSeleccionado !: Employee;
  codigoSeleccionado!: string;
  numDocSeleccionado!: string;

  public montoIngresado!: number;

  public cierreDto!: CierreDto;

  @ViewChild('monto') selMonto: InputNumber;
  
  constructor(private spinner: NgxSpinnerService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private authService: AuthService,
    private cierreDiaService: CierreDiaService) { 

    this.motivos = [      
      { idMotivo: 2, nombre: 'BILLETE FALSO', aplicaFaltante: 1},
      { idMotivo: 3, nombre: 'OTROS', aplicaFaltante: 0},
      { idMotivo: 1, nombre: 'ROBO', aplicaFaltante: 0}
    ];

    this.monedas = [
      { idEmpresa: 1, idTienda: 1, idMoneda: 1, nombre: 'SOLES', nombreCorto: 'S/.',aplicaFaltante: 0},
      { idEmpresa: 1, idTienda: 1, idMoneda: 2, nombre: 'DOLARES', nombreCorto: 'US$', aplicaFaltante: 0}
    ];
    
    this.monedaSeleccionada = this.monedas[0];
  }

  ngOnInit(): void {
    this.cierreDto = this.config.data;

    this.spinner.show();
    this.cierreDiaService.loadResponsableSybase(this.cierreDto.idEmpresa).subscribe(
      responsables => {
        this.responsables = responsables;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire('Error','Error al cargar los responsables','error');
      }
    )
  }

  public changeMotivo(): void {
    if(this.motivoSeleccionado.idMotivo == 2){ //Billete falso
      this.motivoBFResponsable = false;
    }
    else{this.motivoBFResponsable = true;}
  }

  public aceptar(){    
    if(!this.motivoSeleccionado){
      swal.fire('Advertencia!','Debe seleccionar un motivo','warning');
      return;
    }
    if(!this.monedaSeleccionada){
      swal.fire('Advertencia!','Debe seleccionar una moneda','warning');
      return;
    }
    if (!this.montoIngresado) {      
      swal.fire({
        title: 'Advertencia!',
        text: 'Debe ingresar un monto',
        icon: 'warning',
        didClose: () => { this.selMonto.input.nativeElement.focus(); }
      });
      return;
    }

    let montoIngSoles = 0;
    let montoIngDolares = 0;
    if(this.monedaSeleccionada.idMoneda == 1){
      montoIngSoles = this.montoIngresado;
      let montoOtro = this.cierreDto.montoOtroSoles + montoIngSoles;
      let montoRend = this.cierreDto.montoRendidoSoles;
      if (montoOtro > montoRend){
        swal.fire('Advertencia!','El monto acumulado de la cuadratura en SOLES supera al monto rendido S/. ' + montoRend.toFixed(2),'warning');
        return;
      }
    }
    if(this.monedaSeleccionada.idMoneda == 2){
      montoIngDolares = this.montoIngresado;
      let montoOtro = this.cierreDto.montoOtroDolares + montoIngDolares;
      let montoRend = this.cierreDto.montoRendidoDolares;
      if (montoOtro > montoRend){
        swal.fire('Advertencia!','El monto acumulado de la cuadratura en DOLARES supera al monto rendido USD/. ' + montoRend.toFixed(2),'warning');
        return;
      }
    }
    if(this.motivoSeleccionado.idMotivo == 2){
      if(!this.responsableSeleccionado){
        swal.fire('Advertencia!','Debe seleccionar un responsable','warning');
        return;
      }
    }

    let cierreOtro : CierreOtro = new CierreOtro();
    let emp: Empresa = new Empresa();
    emp.idEmpresa = this.cierreDto.idEmpresa;
    let tda: Tienda = new Tienda(this.cierreDto.idTienda, '');
    let mot: CierreOtroMotivo = new CierreOtroMotivo();
    mot.idMotivo = this.motivoSeleccionado.idMotivo;
    let mon: Moneda = new Moneda();
    mon.idMoneda = this.monedaSeleccionada.idMoneda;

    cierreOtro.empresa = emp;
    cierreOtro.tienda = tda;
    cierreOtro.idCierre = this.cierreDto.idCierre;
    cierreOtro.motivo = mot;
    cierreOtro.moneda = mon;
    cierreOtro.monto = this.montoIngresado;
    if(this.responsableSeleccionado){
      cierreOtro.codigoEmpleado = this.responsableSeleccionado.empnum.toString();
      cierreOtro.nombreEmpleado = this.responsableSeleccionado.posname;
      cierreOtro.numeroDocumentoEmpleado = this.responsableSeleccionado.refcode;
    }    
    cierreOtro.empleadoCajaChica = this.authService.usuario.user.fullName.toUpperCase();
    cierreOtro.idUsuario = this.cierreDto.idUsuario;
    cierreOtro.fechaParam = this.cierreDto.fechaInicio;

    this.spinner.show();

    this.cierreDiaService.saveCierreOtro(cierreOtro).subscribe(
      respuesta => {
        this.cierreDto.dataModificada = true;
        if(this.monedaSeleccionada.idMoneda == 1){
          this.cierreDto.montoOtroSoles = this.montoIngresado;
        }
        else{
          this.cierreDto.montoOtroDolares = this.montoIngresado;
        }

        this.spinner.hide();
        this.ref.close();
      },
      err => {
        swal.fire('Error','Se produjo un error al intentar guardar la cuadratura','error');
      }
    )
  }

  public llenarDatosResponsable(){
    if(this.responsableSeleccionado){
      this.codigoSeleccionado = this.responsableSeleccionado.empnum.toString();
      this.numDocSeleccionado = this.responsableSeleccionado.refcode;
    }
  }

  public cancelar(){
    this.ref.close(this.cierreDto);
  }

  ngOnDestroy(): void {
    this.cancelar();      
  }
}
