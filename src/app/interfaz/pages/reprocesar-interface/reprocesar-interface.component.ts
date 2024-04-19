import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner'

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { TiendaService } from '../../services/tienda.service';

import * as moment from 'moment';
import swal from 'sweetalert2';
import { FiltroDto } from '../../dto/filtro-dto';
import { formatDate } from '@angular/common';
import { InterfazTiendaService } from '../../services/interfaz-tienda.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ReporteService } from '../../../cierre/services/reporte.service';
import { Tienda } from '../../../cierre/entity/tienda';
import { InterfazLog } from '../../entity/logInterfaz';
import { tiendaSeleccionada } from '../../entity/tiendaSeleccionada';

@Component({
  selector: 'app-reprocesar-interface',
  templateUrl: './reprocesar-interface.component.html',
  styleUrls: ['./reprocesar-interface.component.css']
})
export class ReprocesarInterfaceComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public rangeDates: Date[] = [];

  public mensajeList: FiltroDto[] = [];

  public forzarEjecucion: boolean = false;

  public mixVentas: boolean = false;

  public esTienda: boolean = false;

  public spinnerMessage: string = 'Cargando...';

  constructor(private spinner: NgxSpinnerService,
    private authService: AuthService,
    private empresaService: EmpresaService,
    private tiendaService: TiendaService,
    private reporteService: ReporteService,
    private interfaztiendaService: InterfazTiendaService) { }

  ngOnInit(): void {
    this.deshabilitarControlesUsuarioTienda();

    const dateMnsFive = moment(new Date()).subtract(1, 'day');

    this.rangeDates[0] = new Date(dateMnsFive.toISOString());
    this.rangeDates[1] = new Date(dateMnsFive.toISOString());

    this.spinner.show();
    this.reporteService.getTiendasPorEmpresa(this.empresaService.getEmpresaSeleccionada().idEmpresa, this.authService.getUsuarioInterface()).subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;        
        if (this.tiendaList.length == 1) {
          this.tiendasSeleccionadas = tiendaList;
        }        
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
      }
    )
    
  }

  deshabilitarControlesUsuarioTienda() {
    if (this.authService.usuario.user.estienda !== undefined) {
      if (this.authService.usuario.user.estienda !== null) {
        if (this.authService.usuario.user.estienda == 'S') {
          this.esTienda = true;
        }
      }
    }
  }

procesarInterfaceverificado(tipo: string, marca: number){
  let ArrTiendas: String[] = [];
  this.tiendasSeleccionadas.forEach(value => {
    ArrTiendas.push(value.tiendaSAP);
  })

  let fecIni = this.rangeDates[0];
  let fecFin = this.rangeDates[1];

  let dto = new FiltroDto();
  dto.fecha = formatDate(fecIni, 'yyyyMMdd', 'en_US');
  if (this.authService.usuario.user.estienda == 'S') {
    dto.fechaFin = dto.fecha;      
  }
  else{
    dto.fechaFin = formatDate(fecFin, 'yyyyMMdd', 'en_US');
  }

  console.log(fecIni, fecFin);

  console.log(dto.fecha, dto.fechaFin);

  let logInterfaz: InterfazLog = new InterfazLog();

  logInterfaz.dfecinicio = dto.fecha;
  logInterfaz.vatipointerfaz = tipo;
  logInterfaz.dfecfin = dto.fechaFin; 
  logInterfaz.cdusuario = this.authService.usuario.user.nrodoc;
  logInterfaz.vatiendas = ArrTiendas.toString();
  logInterfaz.mensaje = "Se inicio el proceso de interfaz desde el front para las tiendas" + ArrTiendas.toString();
  logInterfaz.flagEjecucion = 0;
  logInterfaz.idInicio = 0;
  console.log(logInterfaz);
  this.interfaztiendaService.insertarLogStatus(logInterfaz).subscribe(
    resultado => {
      let idInterfazLog: string = resultado.idInterfazLog;
      console.log("id log interfaz: " + idInterfazLog);

      

      this.spinnerMessage = 'Procesando...';
      this.spinner.show();    
    
      dto.idLogInterfaz = idInterfazLog;

      dto.lisTiendas = ArrTiendas;
    
      if(this.mixVentas){
        dto.tipo = 'M';
      }
      else{
        dto.tipo = tipo;
      }
      
      let forzarEjecucion: string = 'N';
      if (this.forzarEjecucion) {
        forzarEjecucion = 'S';
      }
      dto.forzarEjecucion = forzarEjecucion;
    
      dto.idUsuario = parseInt(this.authService.usuario.user.codigo);
    
      this.mensajeList = [];   
      
      this.interfaztiendaService.getResultadosProcesoInterfaz(dto, marca).subscribe(
        resultado => {
          resultado.forEach(mensaje => {
            mensaje.fecDate = new Date(parseInt(mensaje.fecha.substring(0, 4)), parseInt(mensaje.fecha.substring(4, 6)) - 1, parseInt(mensaje.fecha.substring(6, 8)));
            this.mensajeList.push(mensaje);
          })
          logInterfaz.mensaje = "Se finalizo el proceso de interfaz desde el front para las tiendas" + ArrTiendas.toString();
          logInterfaz.idInicio = parseInt(idInterfazLog);
          logInterfaz.flagEjecucion = 1;
          console.log(logInterfaz);
          this.interfaztiendaService.insertarLogStatus(logInterfaz).subscribe(
            resultado => {
              console.log("Se cerro la insercion el log de inicio");
            }
          )
          this.spinner.hide();
          
        },
        _err => {
          dto.fecDate = new Date(parseInt(dto.fecha.substring(0, 4)), parseInt(dto.fecha.substring(4, 6)) - 1, parseInt(dto.fecha.substring(6, 8)));
          dto.mensaje = "Error interno al procesar la interfaz";
          this.mensajeList.push(dto);
          logInterfaz.mensaje = "Se finalizo el proceso de interfaz desde el front para las tiendas" + ArrTiendas.toString();
          logInterfaz.idInicio = parseInt(idInterfazLog);
          logInterfaz.flagEjecucion = 1;
          console.log(logInterfaz);
          this.interfaztiendaService.insertarLogStatus(logInterfaz).subscribe(
            resultado => {
              console.log("Se cerro la insercion el log de inicio - ERROR");
            }
          )
          this.spinner.hide();        
        }
      )
      logInterfaz.mensaje = "Se finalizo el proceso de interfaz desde el front para las tiendas" + ArrTiendas.toString();
    
//---------------------

    }
  )
  

  
}

  public procesarInterface(tipo: string) {

    let marca = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    let logInterfaz: InterfazLog = new InterfazLog();
  logInterfaz.cdusuario = this.authService.usuario.user.nrodoc;
    this.interfaztiendaService.verificarLogStatus(logInterfaz).subscribe(
      resultado => {
        if (parseInt(resultado.verifica, 10) > 0) {
          swal.fire('Error', 'El proceso aun se encuentra en ejecución, espere unos instantes', 'error');
        }
        else {
          this.procesarInterfaceverificado(tipo, marca);
        }
      }
    )
  }

  public changeFecIni(): void {    
    if(this.rangeDates[0] > this.rangeDates[1]){
      this.rangeDates[1]=this.rangeDates[0];
    }
  }

  public changeFecFin(): void {
    if(this.rangeDates[1] < this.rangeDates[0]){
      this.rangeDates[0]=this.rangeDates[1];
    }
  }
}
