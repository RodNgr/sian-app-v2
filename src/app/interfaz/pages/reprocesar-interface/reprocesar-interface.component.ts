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

  public procesarInterface(tipo: string) {
    this.spinnerMessage = 'Procesando...';
    this.spinner.show();
    let fecIni = this.rangeDates[0];
    let fecFin = this.rangeDates[1];
    let ArrTiendas: String[] = [];

    let dto = new FiltroDto();
    dto.fecha = formatDate(fecIni, 'yyyyMMdd', 'en_US');
    if (this.authService.usuario.user.estienda == 'S') {
      dto.fechaFin = dto.fecha;      
    }
    else{
      dto.fechaFin = formatDate(fecFin, 'yyyyMMdd', 'en_US');
    }

    this.tiendasSeleccionadas.forEach(value => {
      ArrTiendas.push(value.tiendaSAP);
    })
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
    this.spinner.show();
    this.interfaztiendaService.getResultadosProcesoInterfaz(dto).subscribe(
      resultado => {
        resultado.forEach(mensaje => {
          mensaje.fecDate = new Date(parseInt(mensaje.fecha.substring(0, 4)), parseInt(mensaje.fecha.substring(4, 6)) - 1, parseInt(mensaje.fecha.substring(6, 8)));
          this.mensajeList.push(mensaje);
        })
        
        this.spinner.hide();
        this.spinnerMessage = 'Cargando...';
      },
      _err => {
        dto.fecDate = new Date(parseInt(dto.fecha.substring(0, 4)), parseInt(dto.fecha.substring(4, 6)) - 1, parseInt(dto.fecha.substring(6, 8)));
        dto.mensaje = "Error interno al procesar la interfaz";
        this.mensajeList.push(dto);
        this.spinner.hide();
        this.spinnerMessage = 'Cargando...';
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
