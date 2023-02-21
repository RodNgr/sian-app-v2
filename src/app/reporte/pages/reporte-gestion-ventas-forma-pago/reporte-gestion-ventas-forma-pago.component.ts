import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TiendaDto } from '../../dto/tienda-dto';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { MethodPay } from '../../entity/method-pay';
import { forkJoin, Observable } from 'rxjs';
import { VentasFormaPagoDto } from '../../dto/ventas-forma-pago-dto';
import { VentasFormaPagoTransaccionDto } from '../../dto/ventas-forma-pago-transaccion-dto';
import { VentasFormaPagoCajeroDto } from '../../dto/ventas-forma-pago-cajero-dto';
import { VentasFormaPagoTiendaDto } from '../../dto/ventas-forma-pago-tienda-dto';
import { VentasFormaPagoDetalladoDto } from '../../dto/ventas-forma-pago-detallado-dto';
import { DatePipe } from '@angular/common';
import { ParamDto } from '../../dto/param-dto';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

interface Tipo {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-reporte-gestion-ventas-forma-pago',
  templateUrl: './reporte-gestion-ventas-forma-pago.component.html',
  styleUrls: ['./reporte-gestion-ventas-forma-pago.component.css']
})
export class ReporteGestionVentasFormaPagoComponent implements OnInit {

  public tipoList: Tipo[] = [{codigo: '1', descripcion: 'FORMA DE PAGO'}, {codigo: '2', descripcion: 'TRANSACCIÓN'},
                             {codigo: '3', descripcion: 'TIENDA'}, {codigo: '4', descripcion: 'CAJA'},
                             {codigo: '5', descripcion: 'FORMA DE PAGO DETALLADO'},]

  public tipoSeleccionado: Tipo = {codigo: '1', descripcion: 'FORMA DE PAGO'};

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public methodPayList: MethodPay[] = [];

  public methodPaySeleccionadas: MethodPay[] = [];

  public ventaFormaPagoList: VentasFormaPagoDto[] = [];

  public ventaFormaPagoTransaccionList: VentasFormaPagoTransaccionDto[] = [];

  public ventaFormaPagoCajeroList: VentasFormaPagoCajeroDto[] = [];

  public ventaFormaPagoTiendaList: VentasFormaPagoTiendaDto[] = [];

  public ventaFormaPagoDetalladoList: VentasFormaPagoDetalladoDto[] = [];

  public tiendaErrorList: TiendaDto[] = [];

  public rowGroupMetadata: any;

  public cantidadTotal: number = 0;

  public costoTotal: number = 0;

  public ventaTotal: number = 0;

  private pipe = new DatePipe("en-US");

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,
              private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.spinner.show();
    
    const promiseList:Observable<any>[] = [];
    promiseList.push(this.reporteService.getTiendas());
    promiseList.push(this.reporteService.getMethodPays());

    this.spinner.show();
    forkJoin(promiseList).subscribe(
      response => {
        this.tiendaList = response[0];
        this.methodPayList = response[1];

        if (this.tiendaList.length === 1) {
          this.tiendasSeleccionadas = this.tiendaList;
        }

        this.spinner.hide();
      }, 
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información', 'error');
      }
    );
  }

  public buscar(): void {
    if (!this.validar()) {
      return;
    }

    let dto: ParamDto = new ParamDto();
    dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
    dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
    dto.tiendaList = this.tiendasSeleccionadas;
    dto.formaPagoList = this.methodPaySeleccionadas;

    this.spinner.show();
    if (this.tipoSeleccionado.codigo === '1') {
      this.reporteService.getReporteVentasFormaPago(dto).subscribe(
        response => {
          this.ventaFormaPagoList = response.lista;
          this.tiendaErrorList = response.tienda;

          this.updateRowGroupMetaDataFormaPago();
          this.spinner.hide()
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    } else if (this.tipoSeleccionado.codigo === '2') {
      this.reporteService.getReporteVentasFormaPagoTransaccion(dto).subscribe(
        response => {
          this.ventaFormaPagoTransaccionList = response.lista;
          this.tiendaErrorList = response.tienda;

          this.spinner.hide()
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    } else if (this.tipoSeleccionado.codigo === '3') {
      this.reporteService.getReporteVentasFormaPagoTienda(dto).subscribe(
        response => {
          this.ventaFormaPagoTiendaList = response.lista;
          this.tiendaErrorList = response.tienda;

          this.updateRowGroupMetaDataTienda();
          this.spinner.hide()
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    } else if (this.tipoSeleccionado.codigo === '4') {
      this.reporteService.getReporteVentasFormaPagoCajero(dto).subscribe(
        response => {
          this.ventaFormaPagoCajeroList = response.lista;
          this.tiendaErrorList = response.tienda;

          this.spinner.hide()
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    } else {
      this.reporteService.getReporteVentasFormaPagoDetallado(dto).subscribe(
        response => {
          this.ventaFormaPagoDetalladoList = response.lista;
          this.tiendaErrorList = response.tienda;

          this.cantidadTotal = 0;
          this.costoTotal = 0;
          this.ventaTotal = 0;
                
          this.ventaFormaPagoDetalladoList.forEach(v => {
            this.cantidadTotal += v.cantidad;
            this.costoTotal += v.costo;
            this.ventaTotal += v.venta;
          });
          this.spinner.hide()
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    }
  }

  public validar(): boolean {
    if (this.tiendasSeleccionadas.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos una tienda', 'warning');
      return false;
    }

    if (this.feInicio === undefined || this.feInicio === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de inicio', 'warning');
      return false;
    }

    if (this.feFin === undefined || this.feFin === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de fin', 'warning');
      return false;
    }

    if (this.feInicio > this.feFin) {
      swal.fire('Advertencia!', 'La fecha de fin no puede ser menor a la fecha de inicio', 'warning');
      return false;
    }

    if (this.methodPaySeleccionadas.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos una forma de pago', 'warning');
      return false;
    }

    return true;
  }

  public onChangeFilters() {
    this.ventaFormaPagoList = [];
    this.ventaFormaPagoTransaccionList = [];
    this.ventaFormaPagoCajeroList = [];
    this.ventaFormaPagoTiendaList = [];
    this.ventaFormaPagoDetalladoList = [];

    this.tiendaErrorList = [];
    this.rowGroupMetadata = {};

    this.cantidadTotal = 0;
    this.costoTotal = 0;
    this.ventaTotal = 0;
  }

  private updateRowGroupMetaDataFormaPago() {
    this.rowGroupMetadata = {};

    if (this.ventaFormaPagoList) {
      for (let i = 0; i < this.ventaFormaPagoList.length; i++) {
        let rowData = this.ventaFormaPagoList[i];
        let venta = rowData.venta;
        let cantidad = rowData.cantidad;
        let nombre = rowData.tiendaNombre;
        
        if (i == 0) {
          this.rowGroupMetadata[nombre] = { index: 0, size: 1, nombre: nombre, venta: venta, cantidad: cantidad };
        } else {
          let previousRowData = this.ventaFormaPagoList[i - 1];
          let previousRowGroup = previousRowData.tiendaNombre;
          if (nombre === previousRowGroup) {
            this.rowGroupMetadata[nombre].size++;
            this.rowGroupMetadata[nombre].venta = this.rowGroupMetadata[nombre].venta + venta;
            this.rowGroupMetadata[nombre].cantidad = this.rowGroupMetadata[nombre].cantidad + cantidad;
          } else {
            this.rowGroupMetadata[nombre] = { index: i, size: 1, nombre: nombre, venta: venta, cantidad: cantidad };
          }
        }
      }
    }
  }

  private updateRowGroupMetaDataTienda() {
    this.rowGroupMetadata = {};

    console.log(this.ventaFormaPagoTiendaList);
    
    if (this.ventaFormaPagoTiendaList) {
      for (let i = 0; i < this.ventaFormaPagoTiendaList.length; i++) {
        let rowData = this.ventaFormaPagoTiendaList[i];
        let venta = rowData.tender;
        let cantidad = rowData.nro;
        let nombre = rowData.tiendaNombre;
        let tienda = rowData.snum;
        
        if (i == 0) {
          this.rowGroupMetadata[tienda] = { index: 0, size: 1, nombre: nombre, tienda: tienda, venta: venta, cantidad: cantidad };
        } else {
          let previousRowData = this.ventaFormaPagoTiendaList[i - 1];
          let previousRowGroup = previousRowData.snum;
          if (tienda === previousRowGroup) {
            this.rowGroupMetadata[tienda].size++;
            this.rowGroupMetadata[tienda].venta = this.rowGroupMetadata[tienda].venta + venta;
            this.rowGroupMetadata[tienda].cantidad = this.rowGroupMetadata[tienda].cantidad + cantidad;
          } else {
            this.rowGroupMetadata[tienda] = { index: i, size: 1, nombre: nombre, tienda: tienda, venta: venta, cantidad: cantidad };
          }
        }
      }
    }

    console.log(this.rowGroupMetadata);
  }

  public export(): void {
    if (this.tipoSeleccionado.codigo === '1') {
      this.exportFormaPago();
    } else if (this.tipoSeleccionado.codigo === '2') {
      this.exportTransaccion();
    } else if (this.tipoSeleccionado.codigo === '3') {
      this.exportTienda();
    } else if (this.tipoSeleccionado.codigo === '4') {
      this.exportCajero();
    } else {
      this.exportDetallado();
    }
  }

  public exportFormaPago(): void {
    if (!this.ventaFormaPagoList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas por Forma de Pago']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:E2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:E3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['', 'Fecha', 'Forma de Pago', 'Venta', 'Transaccion']);
    worksheet.columns = [{ width: 25 }, { width: 10 }, { width: 20 }, { width: 10 }, { width: 10 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let tiendasId: string[] = [];
    
    this.ventaFormaPagoList.forEach(venta => {
      tiendasId.push(venta.tiendaNombre);
    }); 

    tiendasId = tiendasId.filter(function(value: string, pos: number, self: string[]) {
      return self.indexOf(value) === pos;
    })

    let contador: number = 6;

    tiendasId.forEach(t => {
      worksheet.addRow([t + ' (' + this.rowGroupMetadata[t].size + ')' , '', '', this.rowGroupMetadata[t].venta, this.rowGroupMetadata[t].cantidad]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial', bold: true };
      });

      worksheet.getRow(contador).getCell(4).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(5).numFmt = '#,##';

      contador++;

      this.ventaFormaPagoList.forEach(venta => {
        if (venta.tiendaNombre === t) {
          worksheet.addRow(['', venta.openDate, venta.descript, venta.venta, venta.cantidad]);

          worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });

          worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(4).numFmt = '#,##';
          
          contador++;
        }
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

  public exportTransaccion(): void {
    if (!this.ventaFormaPagoTransaccionList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas por Transacción']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:U2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:U3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Código', 'Tienda', 'Fecha', 'Correlativo', 'Transacción', 'Tipo', 'Serie', 'Nro', 'Cajero', 'Tipo Venta', 'Formato de Pago', 'Transdate', 'Cent', 'Administrador', 'Venta', 'Tarjeta', 'Aprobación', 'Ref.', 'Lote', 'Tipo','Nro Pedido']);
    worksheet.columns = [{ width: 10 }, { width: 28 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 14 }, { width: 9 }, { width: 11 }, { width: 21 }, { width: 20 }, { width: 20 }, { width: 10 }, { width: 5 }, { width: 20 }, { width: 10 }, { width: 13 }, { width: 10 }, { width: 5 }, { width: 5 }, { width: 5 }, { width: 11 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.ventaFormaPagoTransaccionList.forEach(info => {
       worksheet.addRow([info.tienda, info.tiendaNombre, info.openDate, info.correlativo, info.transact, info.docTipo, info.docSerie, info.docNro,
                         info.posName, info.tipoVentaNombre, info.descript, info.transdate, info.ccenter, info.administrador, info.tenderDbl,
                         info.tarjeta, info.aprobacion, info.referencia, info.lote, info.tipo, info.numeroPedido]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(15).numFmt = '#,##0.00';

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

  public exportTienda(): void {
    if (!this.ventaFormaPagoTiendaList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas por Tienda']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:D3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['', 'Fecha','Venta', 'Cantidad']);
    worksheet.columns = [{ width: 25 }, { width: 10 }, { width: 10 }, { width: 10 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let tiendasId: string[] = [];
    
    this.ventaFormaPagoList.forEach(venta => {
      tiendasId.push(venta.tiendaNombre);
    }); 

    tiendasId = tiendasId.filter(function(value: string, pos: number, self: string[]) {
      return self.indexOf(value) === pos;
    })

    let contador: number = 6;

    tiendasId.forEach(t => {
      worksheet.addRow([t + ' (' + this.rowGroupMetadata[t].size + ')' , '', this.rowGroupMetadata[t].venta, this.rowGroupMetadata[t].cantidad]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial', bold: true };
      });

      worksheet.getRow(contador).getCell(2).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(3).numFmt = '#,##';

      contador++;

      this.ventaFormaPagoTiendaList.forEach(venta => {
        if (venta.tiendaNombre === t) {
          worksheet.addRow(['', venta.openDate, venta.tender, venta.nro]);

          worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });

          worksheet.getRow(contador).getCell(2).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(3).numFmt = '#,##';
          
          contador++;
        }
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

  public exportCajero(): void {
    if (!this.ventaFormaPagoCajeroList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas por Cajero']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:G2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:G3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Código', 'Tienda', 'Fecha', 'Forma de Pago', 'Caja', 'Venta', 'Cantidad']);
    worksheet.columns = [{ width: 10 }, { width: 28 }, { width: 10 }, { width: 35 }, { width: 7 }, { width: 10 }, { width: 7 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.ventaFormaPagoCajeroList.forEach(info => {
       worksheet.addRow([info.tienda, info.tiendaNombre, info.openDate, info.descript, info.punchIndex, info.tenderDbl, info.nro]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

  public exportDetallado(): void {
    if (!this.ventaFormaPagoDetalladoList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas por Forma de Pago Detallado']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:I2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:I3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Tienda', 'Fecha', 'Ticket', 'Código', 'Producto', 'Forma de Pago', 'Cantidad', 'Precio sin IGV y RC', 'Venta con IGV y RC']);
    worksheet.columns = [{ width: 21 }, { width: 10 }, { width: 8 }, { width: 10 }, { width: 30 }, { width: 23 }, { width: 7 }, { width: 14 }, { width: 14 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.ventaFormaPagoDetalladoList.forEach(info => {
       worksheet.addRow([info.tiendaNombre, info.openDate, info.transact, info.prodNum, info.producto, info.formaPago, info.cantidad, info.costo, info.venta]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(7).numFmt = '#,##0';
      worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

}
