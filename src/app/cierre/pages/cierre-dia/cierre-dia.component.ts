import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { EmpresaService } from '../../../shared/services/empresa.service';

import swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';
import { Dropdown } from 'primeng/dropdown';
import { ReporteService } from '../../services/reporte.service';
import { Tienda } from '../../entity/tienda';
import { CierreDto } from '../../dto/cierre-dto';
import { CierreDiaService } from '../../services/cierre-dia.service';
import { formatDate } from '@angular/common';
import { Cierre } from '../../entity/cierre';
import { take, takeLast } from 'rxjs/operators';
import { CierreOtro } from '../../entity/cierre-otro';
import { DepositosPixelComponent } from '../depositos-pixel/depositos-pixel.component';
import { DepositoDto } from '../../dto/deposito-dto';
import { error } from 'console';

import { SelectorEmpresaComponent } from '../../../shared/components/selector-empresa/selector-empresa.component'
import { Empresa } from 'src/app/shared/entity/empresa';
import { DepositoSinEfectivoComponent } from '../deposito-sin-efectivo/deposito-sin-efectivo.component';
import { DepositoConEfectivoComponent } from '../deposito-con-efectivo/deposito-con-efectivo.component';
import { OtrasCuadraturasComponent } from '../otras-cuadraturas/otras-cuadraturas.component';
import { toDecimal } from 'src/app/shared/util/utils';

@Component({
  selector: 'app-cierre-dia',
  templateUrl: './cierre-dia.component.html',
  styleUrls: ['./cierre-dia.component.css']
})
export class CierreDiaComponent implements OnInit, OnDestroy {

  anchoDiferenciaTurno = 50;

  private usaDeposito: string;

  private listArqueo: any = [];
  private listTurno: any = [];
  private listCuadre: any = [];
  private listDeposito: any = [];
  private diferenciaPorRendir: string = '0.00';

  public tiendaList: Tienda[] = [];

  public tiendaSeleccionada!: Tienda;
  public fechaSeleccionada!: Date;

  public grabar!: boolean;
  public limpiar!: boolean;
  public cierre!: boolean;
  public imprimir!: boolean;
  public abrir!: boolean;
  public addCuadratura!: boolean;
  public delCuadratura!: boolean;
  public addDeposito!: boolean;
  public cierreDia: Cierre = new Cierre();

  public verDeposito!: boolean;
  public verAbrir!: boolean;
  public cuadraturaSeleccionada!: CierreOtro;

  public tipoDeposito!: string;
  private procesando: boolean = false;

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
    private authService: AuthService,
    private empresaService: EmpresaService,
    private reporteService: ReporteService,
    private cierreDiaService: CierreDiaService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.fechaSeleccionada = new Date();
    this.usaDeposito = '';

    this.spinner.show();      
      this.reporteService.getTiendasPorEmpresa(this.empresaService.getEmpresaSeleccionada().idEmpresa, this.authService.getUsuarioInterface()).subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;

        if (this.tiendaList.length === 1) {
          this.tiendaSeleccionada = this.tiendaList[0];
        }

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
      }
    );
    
    this.handledBotonesToolBar(false, false, false, false, false);
    this.handledBotonesOtros(false, false);
    this.handledBotonesDepositos(false);

    if (this.authService.hasRole('ROL_ABRIR_CIERRE_DIA')) {
      this.verDeposito = true;
      this.verAbrir = true;
    } 
  }

  public onClickObtener(): void {
    if (this.procesando) {
      return;
    }

    if (!this.tiendaSeleccionada) {
      swal.fire('Advertencia!', 'Debe seleccionar una tienda', 'warning');
      return;
    }

    if (!this.fechaSeleccionada) {
      swal.fire('Advertencia!', 'Debe seleccionar una fecha', 'warning');
      return;
    }

    this.procesando = true;

    // Se obtienen los datos para el cierre
    this.spinner.show();

    let dto = new CierreDto();
    dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.fechaInicio = formatDate(this.fechaSeleccionada, 'yyyyMMdd', 'en_US');
    dto.tienda = this.tiendaSeleccionada;
    dto.idUsuario = parseInt(this.authService.usuario.user.codigo);

    this.cierreDiaService.getCierreDia(dto).subscribe(
      resultado => {
        this.usaDeposito = resultado.usaDeposito
        this.cierreDia = resultado;
        
        this.spinner.hide();
        this.procesando = false;
        if (resultado.idCierre > 0) {
          if (resultado.estado == "P") { //POR CERRAR
            let esDeposito: boolean = true;
            if(this.cierreDia.usaDeposito == 'S'){esDeposito = false;}

            this.handledBotonesToolBar(false, true, true, false, false);            
            this.handledBotonesOtros(esDeposito, this.cierreDia.cierreOtroList.length > 0);
            this.handledBotonesDepositos(true);
          }
          else { //CERRADO
            this.handledBotonesToolBar(false, false, false, true, true);
            this.handledBotonesOtros(false, false);
            this.handledBotonesDepositos(false);
          }
        }
        else { //POR CUADRAR
          this.cierreDia.usuarioCreacionNombre = this.authService.usuario.user.fullName.toUpperCase();

          this.handledBotonesToolBar(true, false, false, false, false);
          this.handledBotonesOtros(false, false);
          this.handledBotonesDepositos(false);

          if (resultado.valida == -2){
            swal.fire('Error',resultado.sql,'error');
          }
        }
      },
      _err => {
        this.spinner.hide();        
        this.resetData(false);
        swal.fire('Error','Error interno','error');
      }
    )
  }

  public onClickGrabar() {
    if (!this.grabar){
      swal.fire('Advertencia', 'Solo puede grabar cuando el botón está habilitado', 'warning');
      return;
    }

    if (this.cierreDia.cierreTurnoList.length == 0) {
      swal.fire('Advertencia', 'No se puede grabar la información, porque no existen datos de la ventas del Sistema por turno', 'warning');
      return;
    }
    if (this.cierreDia.cierreArqueoList.length == 0) {
      swal.fire('Advertencia', 'No se puede grabar la información, porque no existen datos del arqueo de caja', 'warning');
      return;
    }

    this.spinner.show();

    this.cierreDia.estado = 'P';
    this.cierreDia.usuarioCreacion = parseInt(this.authService.usuario.user.codigo);
    this.cierreDia.usuarioModificacion = this.cierreDia.usuarioCreacion;
    this.cierreDia.usrCreaSW = this.authService.usuario.user.fullName.toUpperCase();
    this.cierreDia.usrModSW = this.cierreDia.usrCreaSW;

    this.cierreDiaService.saveDia(this.cierreDia).subscribe(
      resultado => {
        this.spinner.hide();
        if (resultado.grabar == 0) {
          this.cierreDia = resultado;
          swal.fire('Grabar datos', 'Se guardaron los datos antes del cierre', 'info');
          this.handledBotonesToolBar(false, true, true, false, false);
        }
        else { //1 = El día anterior no fue cerrado
          let fecCierre = this.convertirFechaStringADate(this.cierreDia.fecha);
          swal.fire('Grabar datos', 'No se puede cerrar la fecha ' + fecCierre + ', porque el día anterior esta abierto.', 'warning');
          return;
        }
        if (resultado.cierreOtroList.length > 0){
          this.handledBotonesOtros(true, true);
        }
        else{
          this.handledBotonesOtros(true, false);
        }
        this.handledBotonesDepositos(true);
      },
      err => {
        this.spinner.hide();
        swal.fire('Error', 'Se produjo un error al intentar guardar los datos', 'error');
        this.resetData(false);
      }
    )
  }

  public onClickLimpiar() {
    this.spinner.show();

    this.cierreDia.estado = 'R';
    this.cierreDia.usuarioCreacion = parseInt(this.authService.usuario.user.codigo);

    this.cierreDiaService.cleanDia(this.cierreDia).subscribe(
      resultado => {
        this.cierreDia.estado = resultado.estado;
        this.cierreDia.estadoNombre = resultado.estadoNombre;
        this.cierreDia.usuarioCreacionNombre = this.authService.usuario.user.fullName.toUpperCase();

        this.spinner.hide();

        swal.fire('Se limpiaron los datos', 'Nuevo estado: "POR CUADRAR"', 'info');
        this.resetData(true);
      },
      error => {
        this.spinner.hide();
        swal.fire('Error', 'Se produjo un error al intentar limpiar los datos', 'error');
        this.resetData(false);
      }
    )
  }

  public onClickCierreDia() {
    swal.fire({
      title: 'Cierre de día',
      text: '¿Está seguro de cerrar el día '+ this.convertirFechaStringADate(this.cierreDia.fecha) +'? ',
      icon: 'question',
      showCancelButton: true
    }).then(respuesta => {
      //aqui se agregara el registro de cierre de dia 
      var fechaActual = new Date();
      this.cierreDia.usuarioCierre = parseInt(this.authService.usuario.user.codigo);
      // this.cierreDia.fechaCierre = '2023-06-20';
      this.cierreDia.fechaCierre = fechaActual.getFullYear() + '-' + (fechaActual.getMonth()+1).toString().padStart(2, '0') + '-' + (fechaActual.getDate()).toString().padStart(2, '0') + " " + fechaActual.getHours().toString().padStart(2, '0') + ":" + fechaActual.getMinutes().toString().padStart(2, '0') + ":" + fechaActual.getSeconds().toString().padStart(2, '0');
      
      this.cierreDiaService.RegistrarIngreso(this.cierreDia).subscribe();

      if (respuesta.isConfirmed) {
        let montoSol = this.cierreDia.montoDepositoSoles + this.cierreDia.montoOtroSoles - this.cierreDia.montoRendidoSoles; 
        montoSol = toDecimal(montoSol, 2);
        let montoDol = this.cierreDia.montoDepositoDolares + this.cierreDia.montoOtroDolares - this.cierreDia.montoRendidoDolares;
        montoDol = toDecimal(montoDol, 2);

        if(this.authService.hasRole('ROL_AUTORIZA_CIERRE_DESCUADRADO') || this.authService.hasRole('ADM')){
          if(montoSol!=0 || montoDol!=0){
            swal.fire({
              title: 'Existen diferencias en los montos',
              text: '¿Desea continuar con el cierre?',
              icon: 'question',
              showCancelButton: true
            }).then(respuesta=>{
              if(respuesta.isConfirmed){
                this.closeDia();
              }
            })
          }
          else{
            this.closeDia();
          }
        }
        else{
          if(montoSol==0 && montoDol==0){
            this.closeDia();
          }
          else{
            if(montoSol!=0){
              swal.fire('Advertencia','Existe una diferencia de S/. ' + montoSol.toFixed(2) + ', para realizar el cierre no debe existir diferencias.','warning');
              return;            
            }
            if(montoDol!=0){
              swal.fire('Advertencia','Existe una diferencia de S/. ' + montoDol.toFixed(2) + ', para realizar el cierre no debe existir diferencias.','warning');
              return;  
            }
          }          
        }        
      }
    });    
  }

  private closeDia() {
    this.spinner.show();

    this.cierreDia.estado = 'C';
    this.cierreDia.usuarioCierre = parseInt(this.authService.usuario.user.codigo);
    this.cierreDia.usuarioCreacion = this.cierreDia.usuarioCierre;
    this.cierreDia.usrCierreSW = this.authService.usuario.user.fullName.toUpperCase();
    this.cierreDia.usrModSW = this.cierreDia.usrCierreSW; 
    this.cierreDia.fechaCierre = 'GETDATE';

    this.cierreDiaService.closeDia(this.cierreDia).subscribe(
      resultado =>{
        this.cierreDia = resultado;
        
        this.spinner.hide();
        swal.fire('Cierre de día', ' Se cerró el día ' + this.convertirFechaStringADate(this.cierreDia.fecha), 'info');
        this.handledBotonesToolBar(false, false, false, true, true);
        this.handledBotonesOtros(false, false);
        this.handledBotonesDepositos(false);
      },
      error=>{
        this.spinner.hide();
        swal.fire('Error', 'Se produjo un error al intentar cerrar el día', 'error');
        this.resetData(false);
      }
    )        
  }

  public onClickCierreAbrir() {
    swal.fire({
      title: 'Abrir día',
      text: '¿Está seguro de abrir el cierre de día del ' + this.convertirFechaStringADate(this.cierreDia.fecha) + '?',
      icon: 'question',
      showCancelButton: true
    }).then(respuesta => {
      if (respuesta.isConfirmed) {
        this.spinner.show();

        this.cierreDia.estado = 'P';
        this.cierreDia.usuarioCierre = parseInt(this.authService.usuario.user.codigo);
        this.cierreDia.usuarioCreacion = this.cierreDia.usuarioCierre;        
        this.cierreDia.usrCierreSW = this.authService.usuario.user.fullName.toUpperCase();
        this.cierreDia.usrModSW = this.cierreDia.usrCierreSW; 
        this.cierreDia.fechaCierre = 'GETDATE';

        this.cierreDiaService.openDia(this.cierreDia).subscribe(
          resultado =>{
            this.cierreDia.estado = resultado.estado;
            this.cierreDia.estadoNombre = resultado.estadoNombre;

            this.spinner.hide();
            swal.fire('Día abierto', 'Se abrió el día ' + this.convertirFechaStringADate(this.cierreDia.fecha), 'info');
            this.handledBotonesToolBar(false, true, true, false, false);
            if (resultado.cierreOtroList.length > 0){
              this.handledBotonesOtros(true, true);
            }
            else{
              this.handledBotonesOtros(true, false);
            }
            this.handledBotonesDepositos(true);
          },
          error=>{
            this.spinner.hide();
            swal.fire('Error', 'Se produjo un error al intentar abrir el día', 'error');
            this.resetData(false);
          }
        )        
      }
    });
  }

  public onClickCierreImprimir() {
    if(this.cierreDia.idCierre>0){
      this.cargarListasPDF();

    let fechaCab = this.convertirFechaStringADate(this.cierreDia.fecha);
    let nombreTiendaCab = this.cierreDia.empresa.nombreComercial + ' - ' + this.cierreDia.tienda.nombreTienda;
    let fecHoyCab = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en_US');    
    
    const pdfDefinition: any = {
      pageMargins: [40, 80, 40, 40], //left, top, right, bottom (esta parte es para el contenido, no para el header)
      pageOrientation: 'portrait', // para que la pagina se visualice horizontalmente usar landscape
      header: function (currentPage, pageCount) {
        return [
          { text: 'Página ' + currentPage.toString() + ' / ' + pageCount, style: 'encabezadoder', margin: [0, 15, 40, 0] },
          { text: fecHoyCab, style: 'encabezadoder', margin: [0, 0, 40, 0] },
          { text: 'REPORTE DE CIERRE DE DÍA', alignment: 'center', bold: true, fontSize: 10 },
          { text: 'Tienda: ' + nombreTiendaCab, style: 'encabezadoizq' },
          { text: 'Fecha venta: ' + fechaCab, style: 'encabezadoizq' },
        ]
      },
      content: [
        { text: 'ARQUEO DE CAJA', style: 'subTitulo' },
        {
          table: {
            headerRows: 1, //Esta línea hace que la primera fila del body sea la cabecera, hace que la tabla vuelva a mostrar la cabecera en caso de pagebreak y permite que se use la propiedad layout
            widths: ['auto', '*', '*', 'auto', 'auto', 'auto'], //ancho para cada columna (auto=ancho del dato, * se reparte el sobrante del ancho entre todas las que tengan este valor)
            body: this.listArqueo
          },
          layout: 'headerLineOnly'
        },
        { text: 'VENTA DEL SISTEMA POR TURNO', style: 'subTitulo' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', this.anchoDiferenciaTurno, 'auto'],
            body: this.listTurno
          },
          layout: 'headerLineOnly'
        },
        { text: 'DIFERENCIA DE CAJA PENDIENTE DE ACLARACIÓN', style: 'subTitulo', margin: [0, -12, 0, 10]},
        {
          table: {
            headerRows: 1,
            widths: ['*', this.anchoDiferenciaTurno, this.anchoDiferenciaTurno],
            body: this.listCuadre
          },
          layout: 'headerLineOnly'
        },
        { text: 'LISTA DE DEPÓSITOS REALIZADOS', style: 'subTitulo' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', 'auto', 'auto'],
            body: this.listDeposito
          },
          layout: 'headerLineOnly'
        }
      ],
      styles: {
        encabezadoizq:{
          fontSize: 8,
          alignment: 'left', 
          bold: true, 
          margin: [40, 0, 0, 0]
        },
        encabezadoder:{
          fontSize: 8,
          alignment: 'right'
        },
        cabeceraTabla: {
          fontSize: 8,
          bold: true
        },
        cabeceraTablader: {
          fontSize: 8,
          bold: true,
          alignment: 'right'
        },
        fuente: {
          fontSize: 8
        },
        fuenteder: {
          fontSize: 8,
          alignment: 'right'
        }
        ,
        subTitulo: {
          fontSize: 10,
          bold: true,
          margin: [0, 10, 0, 10]
        }
      }
    }

    const pdf = pdfMake.createPdf(pdfDefinition).open();
    }    
    else{
      swal.fire('Advertencia','El cierre no es válido y no puede ser impreso','warning');
    }
  }

  cargarListasPDF() {
    this.loadListaArqueo();
    this.loadListaTurno();
    this.loadListaCuadre();
    this.loadListaDeposito();
  }

  loadListaArqueo() {
    this.listArqueo = [];
    //Cabecera de la tabla
    this.listArqueo.push([
      { text: 'Código', style: 'cabeceraTabla' },
      { text: 'Forma de pago', style: 'cabeceraTabla' },
      { text: 'Moneda', style: 'cabeceraTabla' },
      { text: 'Monto de venta', style: 'cabeceraTablader' },
      { text: 'Monto rendido', style: 'cabeceraTablader' },
      { text: 'Diferencia', style: 'cabeceraTablader' }
    ]);

    //Datos dinámicos
    let totalVenta = 0, totalRendido = 0, totalDiferencia = 0;
    this.cierreDia.cierreArqueoList.forEach(element => {
      this.listArqueo.push([
        { text: element.idForma.toString(), style: 'fuente' },
        { text: element.formaPago.toString(), style: 'fuente' },
        { text: element.moneda.nombre.toString(), style: 'fuente' },
        { text: this.formateaDoubleA2DigitosString(element.ventaSoles), style: 'fuenteder' },
        { text: this.formateaDoubleA2DigitosString(element.rendidoSoles), style: 'fuenteder' },
        { text: this.formateaDoubleA2DigitosString(element.diferencia), style: 'fuenteder' }
      ])
      totalVenta += element.ventaSoles;
      totalRendido += element.rendidoSoles;
      totalDiferencia += element.diferencia;
    });

    //Se agregan los totales a la tabla
    this.diferenciaPorRendir = this.formateaDoubleA2DigitosString(totalDiferencia);
    this.listArqueo.push([
      { text: '', style: 'fuente' },
      { text: '', style: 'fuente' },
      { text: '', style: 'fuente' },
      { text: this.formateaDoubleA2DigitosString(totalVenta), bold: true, style: 'fuenteder' },
      { text: this.formateaDoubleA2DigitosString(totalRendido), bold: true, style: 'fuenteder' },
      { text: this.formateaDoubleA2DigitosString(totalDiferencia), bold: true, style: 'fuenteder' }
    ])
  }

  loadListaTurno() {
    this.listTurno = [];
    //Cabecera de la tabla
    this.listTurno.push([
      { text: 'Turno', style: 'cabeceraTabla' },
      { text: 'Cajero', style: 'cabeceraTabla' },
      { text: 'Boleta', style: 'cabeceraTablader' },
      { text: 'Factura', style: 'cabeceraTablader' },
      { text: 'N/C', style: 'cabeceraTablader' },
      { text: 'Propinas', style: 'cabeceraTablader' },
      { text: 'Total', style: 'cabeceraTablader' }
    ]);

    //Datos dinámicos
    let total = 0;
    this.cierreDia.cierreTurnoList.forEach(element => {
      let cajero = '';
      if(element.cajero != null){
        cajero=element.cajero;
      }
      this.listTurno.push([
        { text: element.turno.toString(), style: 'fuente' },
        { text: cajero, style: 'fuente' },
        { text: this.formateaDoubleA2DigitosString(element.tboleta), style: 'fuenteder' },
        { text: this.formateaDoubleA2DigitosString(element.tfactura), style: 'fuenteder' },
        { text: this.formateaDoubleA2DigitosString(element.tnotaCredito), style: 'fuenteder' },
        { text: this.formateaDoubleA2DigitosString(element.tpropinas), style: 'fuenteder' },
        { text: this.formateaDoubleA2DigitosString(element.ttotal), style: 'fuenteder' }
      ])
      total += element.ttotal;
    });

    //Se agregan los totales a la tabla
    this.listTurno.push([
      { text: '', style: 'fuente' },
      { text: '', style: 'fuente' },
      { text: '', style: 'fuente' },
      { text: '', style: 'fuente' },
      { text: '', style: 'fuente' },
      { text: '', style: 'fuente' },
      { text: this.formateaDoubleA2DigitosString(total), bold: true, style: 'fuenteder' }
    ])

    //Se agrega la línea de los totales
    this.listTurno.push([
      { text: '', style: 'fuente' },
      { text: '', style: 'fuente' },
      { text: '', style: 'fuenteder' },
      { text: '', style: 'fuenteder' },
      { text: '', style: 'fuenteder' },
      { text: '', style: 'fuenteder' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: this.anchoDiferenciaTurno, y2: 0, lineWidth: 2 }] }
    ]);
    //Se agrega el total por rendir
    this.listTurno.push([
      { text: '', style: 'fuente' },
      { text: '', style: 'fuente' },
      { text: '', style: 'fuenteder' },
      { text: '', style: 'fuenteder' },
      { text: '', style: 'fuenteder' },
      { text: this.diferenciaPorRendir, bold: true, style: 'fuenteder' }
    ]);
  }
  loadListaCuadre() {
    this.listCuadre = [];
    //Cabecera de la tabla
    this.listCuadre.push([
      { text: 'CUADRE DE EFECTIVO', style: 'cabeceraTabla' },
      { text: 'Monto S/.', style: 'cabeceraTablader' },
      { text: 'Monto $', style: 'cabeceraTablader' }
    ]);

    //Datos dinámicos
    this.cierreDia.resumenArqueoList.forEach(element => {
      if (element.hijo != 1) { //Quita el detalle de los depósitos
        this.listCuadre.push([
          { text: element.padre == 3 ? '' : element.operacion.toString(), style: 'fuente' },
          { text: this.formateaDoubleA2DigitosString(element.montoSOL), style: 'fuenteder', bold: element.padre == 3 ? true : false },
          { text: this.formateaDoubleA2DigitosString(element.montoUSD), style: 'fuenteder', bold: element.padre == 3 ? true : false }
        ])
        if (element.padre == 2 || element.padre == 4) { //Debajo de otros ajustes para cuadratura se pone la línea de totales
          this.listCuadre.push([
            { text: '', style: 'fuente' },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 1.5 * this.anchoDiferenciaTurno, y2: 0, lineWidth: 2 }] },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: this.anchoDiferenciaTurno, y2: 0, lineWidth: 2 }] }
          ])
        }
      }
    });
  }
  loadListaDeposito() {
    this.listDeposito = [];
    //Cabecera de la tabla
    this.listDeposito.push([
      { text: 'Fec. voucher', style: 'cabeceraTabla' },
      { text: 'N° Ope/Tra.', style: 'cabeceraTabla' },
      { text: 'Banco', style: 'cabeceraTabla' },
      { text: 'Número de cuenta', style: 'cabeceraTabla' },
      { text: 'Moneda', style: 'cabeceraTabla' },
      { text: 'Monto', style: 'cabeceraTablader' }
    ]);

    //Datos dinámicos
    this.cierreDia.depositoList.forEach(element => {
      this.listDeposito.push([
        { text: element.fecha.toString(), style: 'fuente' },
        { text: element.noTransaccion.toString(), style: 'fuente' },
        { text: element.banco.nombre.toString(), style: 'fuente' },
        { text: element.cuentaBancaria.numero.toString(), style: 'fuente' },
        { text: element.moneda.nombre.toString(), style: 'fuente' },
        { text: this.formateaDoubleA2DigitosString(element.monto), style: 'fuenteder' }
      ])
    });
  }

  formateaDoubleA2DigitosString(numero: number): string{
    return isNaN(numero) ? numero.toString() : numero.toFixed(2).toString();
  }

  public onClickVerDeposito() {
    if(!this.tiendaSeleccionada){
      swal.fire('Advertencia','Debe seleccionar una tienda','warning');
      return;
    }

    let dto: DepositoDto = new DepositoDto();
    dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.tienda = this.tiendaSeleccionada;     
    dto.fechaInicial = formatDate(this.fechaSeleccionada, 'yyyyMMdd', 'en_US');

    this.ref = this.dialogService.open(DepositosPixelComponent, {
      header: 'Depósitos pixel',
      width: '70%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000,
      data: dto
    });
  }

  public onClickAddDeposito() {
    if (this.procesando) {
       return;
    }

    this.procesando = true;
    //Prueba 2257 29/05/2022
    let dto: CierreDto = new CierreDto();
    dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.idTienda = this.tiendaSeleccionada.tienda;
    dto.montoRendidoSoles = this.cierreDia.montoRendidoSoles;
    dto.montoRendidoDolares = this.cierreDia.montoRendidoDolares;
    dto.montoDepositoSoles = this.cierreDia.montoDepositoSoles;
    dto.montoDepositoDolares = this.cierreDia.montoDepositoDolares;
    dto.idCierre = this.cierreDia.idCierre;
    dto.idUsuario = parseInt(this.authService.usuario.user.codigo);
    
    if(this.usaDeposito == 'N'){ //Formulario con banco
      this.ref = this.dialogService.open(DepositoSinEfectivoComponent, {
        header: 'Depósitos',
        width: '60%', 
        contentStyle: {"max-height": "500px", "overflow": "auto"},
        baseZIndex: 10000,
        data: dto
      });
    }else if(this.usaDeposito == 'S'){ //Este formulario no se usa desde 10/12/2019
      this.ref = this.dialogService.open(DepositoConEfectivoComponent, {
        header: 'Otras cuadraturas',
        width: '60%', 
        contentStyle: {"max-height": "500px", "overflow": "auto"},
        baseZIndex: 10000
      });
    }else{
      swal.fire('La tienda no tiene información sobre depósitos/cuadraturas');
    }

    this.ref.onClose.subscribe((datosCiere: CierreDto) => {
      this.procesando = false;
      
      setTimeout(()=>{
        if(datosCiere.dataModificada){
          this.cargarCierre();
        }      
      },500)
    })
  }

  public cargarCierre(){
    //Se carga nuevamente el formulario
    this.spinner.show();

    let dto = new CierreDto();
    dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.fechaInicio = formatDate(this.fechaSeleccionada, 'yyyyMMdd', 'en_US');
    dto.tienda = this.tiendaSeleccionada;
    dto.idUsuario = parseInt(this.authService.usuario.user.codigo);

    this.cierreDiaService.getCierreDia(dto).subscribe(
      resultado => {
        this.cierreDia = resultado;          
        this.spinner.hide();          
      }
    )
  }

  public onClickAddCuadratura() {
    if (this.procesando) {
      return;
   }

   this.procesando = true;
    let dto: CierreDto = new CierreDto();
    dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.idTienda = this.tiendaSeleccionada.tienda;
    dto.montoRendidoSoles = this.cierreDia.montoRendidoSoles;
    dto.montoRendidoDolares = this.cierreDia.montoRendidoDolares;
    dto.montoOtroSoles = this.cierreDia.montoOtroSoles;
    dto.montoOtroDolares = this.cierreDia.montoOtroDolares;
    dto.idCierre = this.cierreDia.idCierre;
    dto.idUsuario = parseInt(this.authService.usuario.user.codigo);
    dto.fechaInicio = formatDate(this.fechaSeleccionada, 'yyyyMMdd', 'en_US');

    this.ref = this.dialogService.open(OtrasCuadraturasComponent, {
      header: 'Otras cuadraturas',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000,
      data: dto
    });

    this.handledBotonesOtros(true, true);

    this.ref.onClose.subscribe((datosCiere: CierreDto) =>{
      this.procesando = false;

      setTimeout(()=>{
        if(datosCiere.dataModificada){
          this.cargarCierre();
          this.cierreDia.montoOtroSoles += datosCiere.montoOtroSoles;
          this.cierreDia.montoOtroDolares += datosCiere.montoOtroDolares;
        }       
      },500)       
    });     
  }

  public onClickDelCuadratura() {
    if (!this.cuadraturaSeleccionada) {
      swal.fire('Advertencia','Debe seleccionar una cuadratura','warning');
      return;
    }
    
    if(this.cuadraturaSeleccionada.motivo.idMotivo == 4){
      swal.fire('Advertencia','No se puede eliminar la caja chica','warning');
      return;
    }
    
    this.spinner.show();
    this.cierreDia.cierreOtroDel = this.cuadraturaSeleccionada; //Cuadratura que se va a eliminar

    this.cierreDiaService.deleteCuadratura(this.cierreDia).subscribe(
      resultado =>{
        this.cierreDia = resultado;
        if(this.cuadraturaSeleccionada.moneda.idMoneda == 1){
          this.cierreDia.montoOtroSoles -= this.cuadraturaSeleccionada.monto;            
        }
        else{
          this.cierreDia.montoOtroDolares -= this.cuadraturaSeleccionada.monto;
        }

        this.spinner.hide();
        swal.fire('Aviso', 'Cuadratura eliminada correctamente', 'info');
        this.handledBotonesOtros(true, this.cierreDia.cierreOtroList.length > 0);
      },
      error =>{
        this.spinner.hide();
        swal.fire('Error', 'Se produjo un error al intentar eliminar la cuadratura', 'error');
        this.resetData(false);
      }
    )    
  }  

  private convertirFechaStringADate(fecString : string): string{
    //Convierte string yyyyMMdd a string dd/MM/yyyy
    return formatDate(new Date(parseInt(fecString.substring(0,4)),parseInt(fecString.substring(4,6))-1,parseInt(fecString.substring(6,8))), 'dd/MM/yyyy', 'en_US');
  }

  private resetData(limpiarGrillas : boolean): void {
    if(limpiarGrillas){
      this.cierreDia = new Cierre();
    }    
    this.handledBotonesToolBar(false, false, false, false, false);
    this.handledBotonesOtros(false, false);
    this.handledBotonesDepositos(false);
  }

  private handledBotonesToolBar(grabar: boolean, limpiar: boolean, cierre: boolean, imprimir: boolean,
    abrir: boolean) {
    this.grabar = grabar;
    this.limpiar = limpiar;
    this.cierre = cierre;
    this.imprimir = imprimir;
    this.abrir = abrir;
  }

  public changeDate(): void {
    this.resetData(true);
  }

  public changeTienda(): void {
    if (!this.tiendaSeleccionada) {
      return;
    }

    if (this.tiendaSeleccionada.usaDeposito === 'S') {
      this.tipoDeposito = 'DEPOSITO PROSEGUR';
    } else {
      this.tipoDeposito = 'RECAUDACIÓN';
    }

    this.resetData(true);
  }

  private handledBotonesOtros(addCuadratura: boolean, delCuadratura: boolean) {
    this.addCuadratura = addCuadratura;
    this.delCuadratura = delCuadratura;
  }

  private handledBotonesDepositos(addDeposito: boolean) {
    this.addDeposito = addDeposito;
  }

  @HostListener('document:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (event.key === 'F3') {
      event.preventDefault();
      this.onClickObtener();
    } else if (event.key === 'F4') {
      event.preventDefault();
      this.onClickGrabar();
    } else if (event.key === 'F11') {
      event.preventDefault();
      this.onClickAddCuadratura();
    } else if (event.key === 'F12') {
      event.preventDefault();
      this.onClickAddDeposito();
    }
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
  }
}
