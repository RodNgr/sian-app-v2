import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CuponesOmnicanalService } from '../../services/cupones-omnicanal.service';
import { ConsultaCuponOmnicanal, Transacciones, Resultado, Canal } from '../../entity/ConsultacuponOmnicanal';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { Cell, Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import * as fs from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { Empresa } from '../../../shared/entity/empresa';
import { TipoCuponOmnicanal } from '../../entity/tipo-cupon-omnicanal';

@Component({
  selector: 'app-reporte-cupon-omnicanal',
  templateUrl: './reporte-cupon-omnicanal.component.html',
  styleUrls: ['./reporte-cupon-omnicanal.component.css']
})
export class ReporteCuponOmnicanalComponent implements OnInit {

  public cuponesGenerados: ConsultaCuponOmnicanal[] = [];
  public TransaccionesGenerados: Transacciones[] = [];
  public empresas: Empresa[] = [];
  public cantTrans: number=0;

  public tiposCupon: TipoCuponOmnicanal[] = [
  { nombre: 'Cupón Precio Fijo a un producto', estado: false, codigo: 1 },
  { nombre: 'Cupón descuento % a un producto', estado: false, codigo: 2 },
  { nombre: 'Cupón descuento % a varios producto', estado: false, codigo: 3 },
  { nombre: 'Cupón descuento Recargo de Delivery', estado: false, codigo: 4 },
  { nombre: 'Cupón descuento monto fijo al  total', estado: false, codigo: 5 },
  { nombre: 'Cupón descuento % al monto total', estado: false, codigo: 6 }]

  public Canal: Canal[] = [
    { Canal: 'Salón', codCanal: '0' },
    { Canal: 'Call Center',  codCanal: '1' },
    { Canal: 'Web-bot', codCanal: '2' },
    { Canal: 'App', codCanal: '4' }]

  private urlEndPointOmnicanal: string;
  private pipe = new DatePipe("en-US");
  public feInicio: Date = new Date();
  public codigocupon : string='';
  @ViewChild('codcupon') codcupon: ElementRef;

  constructor(private spinner: NgxSpinnerService,
    private cuponesgenerados_service: CuponesOmnicanalService,
    private empresaService: EmpresaService) { 
    this.urlEndPointOmnicanal = environment.urlOmnicanalA;
    this.empresas = this.empresaService.getEmpresas();
  }

  ngOnInit(): void {
    
  }

  public getCuponesGenerados() {
    this.spinner.show();
    //sessionStorage.removeItem('token_omnicanal');
    const token_omnicanal: string = sessionStorage.getItem('token_omnicanal')!;

    if(this.codigocupon=='' || this.codigocupon == null || this.codigocupon==undefined){
      this.codcupon.nativeElement.focus();
      swal.fire('Mensaje', 'Debe ingresar un código de cupón', 'info');
      this.spinner.hide();
      return;
    }
    if(token_omnicanal){//DD002B5I
      this.ajaxQueryGET(`${this.urlEndPointOmnicanal}/consultacupon/${this.empresaService.getEmpresaSeleccionada().idEmpresa}/${this.codigocupon}`, token_omnicanal); 
    }else{
      this.cuponesgenerados_service.TokenOmnicanal().subscribe(resp => { 
         this.ajaxQueryGET(`${this.urlEndPointOmnicanal}/consultacupon/${this.empresaService.getEmpresaSeleccionada().idEmpresa}/${this.codigocupon}`, resp.access_token);  
      }, e => {
        this.spinner.hide();
        console.error(e);
      });
    }
    
  }

  public buscar(): void {
    this.getCuponesGenerados();
  }


  public exportar(): void {
    if (!this.cuponesGenerados) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }
    this.feInicio =new Date();

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Cupones');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte Cupones']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
   /*  worksheet.addRow(['Desde: ' + this.pipe.transform(this.feInicio, 'dd/MM/yyyy') ]); */
    worksheet.mergeCells('A2:L2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A3:L3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);
    
    // Título de la tabla
    worksheet.addRow(['Nombre Campaña','','',
                      'Cod. Cupon', 
                      'Tipo Cupon', 
                      'N° de Usos', 
                      'Cantidad Redimido', 
                      'Alianza', 
                      'Cantidad Producto usado', 
                      'Monto', 
                      'Monto Max.', 
                      'Compra Min.', 
                      'Fecha Actualización', 
                      'Fecha Ini.', 
                      'Fecha Fin', 
                      'Anulado', 
                      'Estado', 
                      'Usu Registro', 
                      'Fecha Reg.']);
    worksheet.columns = [ { width: 10 },  { width: 20 },  { width: 10 }, 
                          { width: 11 }, 
                          { width: 20 }, 
                          { width: 11 }, 
                          { width: 16 }, 
                          { width: 25 }, 
                          { width: 20 }, 
                          { width: 12 }, 
                          { width: 30 }, 
                          { width: 30 }, 
                          { width: 30 }, 
                          { width: 30 }, 
                          { width: 30 }, 
                          { width: 30 }, 
                          { width: 30 }, 
                          { width: 30 }, 
                          { width: 30 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    worksheet.mergeCells(`${'A'}${5}:${'C'}${5}`);  
    /* this.pipe.transform(info.diaventa, 'dd/MM/yyy') */
    let contador: number = 6;
    this.cuponesGenerados.forEach(info => {
      worksheet.addRow([info.nombreCampanha,'','',
                        info.codCupon,
                        info.stTipoCupon,
                        info.nroUso,
                        info.cantidadRedimido,
                        info.alianza,
                        info.cantidadProductUso,
                        info.monto,
                        info.montoMax,
                        info.compraMin,
                        info.fecActualizacion,
                        info.fecInicio,
                        info.fecFin,
                        info.stanulado,
                        info.stestado,
                        info.usuarioReg,
                        info.fecReg]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });
      worksheet.mergeCells(`${'A'}${contador}:${'C'}${contador}`);
     /*  worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(10).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(11).numFmt = '#,##0.00'; */
      contador++;
    });
    contador++;
    worksheet.addRow(['']);
    contador++;
    worksheet.addRow(['Detalle']);
    worksheet.mergeCells('A8:K8');
    worksheet.getCell('A8').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' };
    // Título de la tabla
    worksheet.addRow(['N° Pedido',
                      'Marca', 
                      'Canal', 
                      'Cod Tienda', 
                      'Cupon', 
                      'Cod Cajero', 
                      'Pedido anulado', 
                      'Fecha Registro', 
                      'Fecha Actualización', 
                      'Nombre Cajero', 
                      'Nombre Tienda']);
    /* worksheet.columns = [ { width: 10 }, 
                          { width: 10 }, 
                          { width: 16 }, 
                          { width: 16 }, 
                          { width: 16 }, 
                          { width: 18 }, 
                          { width: 16 }, 
                          { width: 16 }, 
                          { width: 30 }, 
                          { width: 30 }, 
                          { width: 30 }]; */
   
    worksheet.getRow(contador).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    contador++;
    this.TransaccionesGenerados.forEach(info => {
      worksheet.addRow([info.nroPedido,
                        info.Marca,
                        info.Canal,
                        info.codTienda,
                        info.codCupon,
                        info.codCajero,
                        info.stpedidoAnulado,
                        info.fecRegistro,
                        info.fecActualizacion,
                        info.nombreCajero,
                        info.nombreTienda]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

     /*  worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(10).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(11).numFmt = '#,##0.00'; */
      contador++;
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Cupones_' + timestamp + '.xlsx');
    });
  }
  
  private ObtenerMarca(codMarca:String): String{
    var NombreMarca='';
    this.empresas.forEach(element => {
      if(element.idEmpresa.toString()==codMarca){
        NombreMarca=element.nombre;
      }
    });
      return NombreMarca;
  }

  private ObtenerTipo(idTipoCupon:number): String{
    var NombreTipoCupon='';
    this.tiposCupon.forEach(element => {
      if(element.codigo.toString()==idTipoCupon.toString()){
        NombreTipoCupon=element.nombre;
      }
    });
      return NombreTipoCupon;
  }

  private ObtenerCanal(codCanal:String): String{
    var NombreCanal=codCanal;
    this.Canal.forEach(element => {
      if(element.codCanal.toString()==codCanal){
        NombreCanal=element.Canal;
      }
    });
      return NombreCanal;
  }

  private ajaxQueryGET(urlEndPoint: string, token: string): any {
    $.ajax({
      url: urlEndPoint,
      crossDomain: true,
      contentType: 'application/json',
     /*  data: {
        foo: 'bar'
      }, */
      success: (result: Resultado) => {
        this.cuponesGenerados = [];
        this.TransaccionesGenerados = [];

        if(result.cupon == null){
          swal.fire('Información', 'No se encontraron resultados de cupon para la búsqueda', 'info');
          this.spinner.hide();
          return;
        }
        if(result.cupon.anulado==0){result.cupon.stanulado='Activo';} else {result.cupon.stanulado='Anulado';}
        if(result.cupon.estado==0){result.cupon.stestado='Activo';} else {result.cupon.stestado='Redimido';}
        result.cupon.codCupon=result.cupon.sk.split('#')[0];

        result.cupon.stTipoCupon= this.ObtenerTipo(result.cupon.idTipoCupon);

        result.cupon.pk = result.cupon.pk || '';
        result.cupon.sk = result.cupon.sk || '';
        result.cupon.nombreCampanha = result.cupon.nombreCampanha || '';
        result.cupon.nombreCupon = result.cupon.nombreCupon || '';
        result.cupon.codCupon = result.cupon.codCupon || '';
        result.cupon.Marca = result.cupon.Marca || '';
        result.cupon.codMarca = result.cupon.codMarca || '';
        result.cupon.habilitado = result.cupon.habilitado || '';
        result.cupon.anulado = result.cupon.anulado || '';
        result.cupon.stanulado = result.cupon.stanulado || '';
        result.cupon.activoCompraMin = result.cupon.activoCompraMin || '';
        result.cupon.monto = result.cupon.monto || '';
        result.cupon.montoMax = result.cupon.montoMax || '';
        result.cupon.compraMin = result.cupon.compraMin || '';
        result.cupon.estado = result.cupon.estado || '';
        result.cupon.stestado = result.cupon.stestado || '';
        result.cupon.idTipoCupon = result.cupon.idTipoCupon || '';
        result.cupon.stTipoCupon = result.cupon.stTipoCupon || '';
        result.cupon.cantidadProductUso = result.cupon.cantidadProductUso || '';
        result.cupon.validaDelivery = result.cupon.validaDelivery || '';
        result.cupon.usuarioReg = result.cupon.usuarioReg || '';
        result.cupon.fecReg = result.cupon.fecReg || '';
        result.cupon.fecActualizacion = result.cupon.fecActualizacion || '';
        result.cupon.usuarioActualizacion = result.cupon.usuarioActualizacion || '';
        result.cupon.fecInicio = result.cupon.fecInicio || '';
        result.cupon.fecFin = result.cupon.fecFin || '';
        result.cupon.nroUso = result.cupon.nroUso || '';
        result.cupon.cantidadRedimido = result.cupon.cantidadRedimido || '';
        result.cupon.nroCuponAGenerar = result.cupon.nroCuponAGenerar || '';
        result.cupon.canalDetalle = result.cupon.canalDetalle || '';
        result.cupon.canalJson = result.cupon.canalJson || '';
        result.cupon.alianza = result.cupon.alianza || '';

        this.cuponesGenerados.push(result.cupon);

        if(result.transacciones == null){
          swal.fire('Información', 'No se encontraron resultados de transacción para la búsqueda', 'info');
          this.spinner.hide();
          return;
        }

        result.transacciones.forEach(element => {
          if(element.sk.split('#').length=4){
            element.codMarca = element.sk.split('#')[0];
            element.Marca = this.ObtenerMarca(element.codMarca);

            element.codCanal = element.sk.split('#')[1];
            element.Canal = this.ObtenerCanal(element.codCanal);

            element.codTienda = element.sk.split('#')[2];
            element.nroPedido = element.nroPedido || '';
            element.sk = element.sk || ''; 
            element.codMarca = element.codMarca || '';
            element.Marca = element.Marca || '';
            element.codCanal = element.codCanal || ''; 
            element.codTienda = element.codTienda || ''; 
            element.codCupon = element.codCupon || ''; 
            element.codCajero = element.codCajero || '';

            element.nombreCampanha = element.nombreCampanha || '';
            element.pedidoAnulado = element.pedidoAnulado || '';
            element.stpedidoAnulado = element.stpedidoAnulado || '';
            element.fecRegistro = element.fecRegistro || '';
            element.fecActualizacion = element.fecActualizacion || '';
            element.usuarioActualiza = element.usuarioActualiza || '';
            element.detallePedido = element.detallePedido || '';
            element.pedidoOrigen = element.pedidoOrigen || '';
            element.tiendaSap = element.tiendaSap || '';
            element.nombreCajero = element.nombreCajero || '';
            element.nombreTienda = element.nombreTienda || '';
            element.fecVenta = element.fecVenta || '';
            
            if(element.pedidoAnulado==0){
              element.stpedidoAnulado='Cupon esta Redimido';
            } else if(element.pedidoAnulado==1){  element.stpedidoAnulado='La Redención ha sido Anulado';}
          }
        });
        this.TransaccionesGenerados = result.transacciones;
        this.cantTrans=this.TransaccionesGenerados.length;
        //console.log('this.TransaccionesGenerados',this.TransaccionesGenerados);
        this.spinner.hide();
      },
      beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + token ); },
      error: (error) => {
        console.log(error);
        if(error.status==401){
          console.log("CLEAR NEK");
          sessionStorage.removeItem('token_omnicanal');
          swal.fire('Error', 'Problemas al obtener información. vuelva a consultar', 'error');
        }
        this.spinner.hide();
      }
    });

  }


}
