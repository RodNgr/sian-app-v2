import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TiendaDto } from '../../dto/tienda-dto';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { TicketAnulado } from '../../dto/ticket-anulado-dto';
import { ControlVentaAnuladaDto } from '../../dto/control-venta-anulada-dto';
import { ReportePjiDto } from '../../dto/reporte-pji-dto';
import { ControlClienteDeliveryDto } from '../../dto/control-cliente-delivery-dto';
import { ParamDto } from '../../dto/param-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

interface Reporte {
  codigo: number;
  descripcion: string;
}

interface Estado {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-reporte-control-ventas',
  templateUrl: './reporte-control-ventas.component.html',
  styleUrls: ['./reporte-control-ventas.component.css']
})
export class ReporteControlVentasComponent implements OnInit {

  public reporteList: Reporte[] = [];

  public reporteSeleccionado!: Reporte;

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public estadoList: Estado[] = [];

  public estadoSeleccionado!: Estado;

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public tiendaErrorList: TiendaDto[] = [];

  public ticketAnuladoList: TicketAnulado[] = [];

  public ventaAnuladaList: ControlVentaAnuladaDto[] = [];

  public reportePjiList: ReportePjiDto[] = [];

  public clienteDeliveryList: ControlClienteDeliveryDto[] = [];

  public showEstado: boolean = false;

  public showTiendas: boolean = false;

  private pipe = new DatePipe("en-US");

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.loadReportesValidos();
    this.loadEstados();

    this.reporteService.getTiendas().subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;

        if (tiendaList.length === 1) {
          this.tiendasSeleccionadas = tiendaList;
        }
        this.spinner.hide();
      }, 
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener las tienda', 'error');
      }
    )
  }

  private loadReportesValidos(): void {
    if (this.authService.hasRole('ROL_SIAN_REP_CON_VTA_TICKETS_ANUL')) {
      this.reporteList.push({codigo: 1, descripcion: 'Tickets Anulados'});
    }

    if (this.authService.hasRole('ROL_SIAN_REP_CON_VTA_VENTA_ANUL')) {
      this.reporteList.push({codigo: 2, descripcion: 'Ventas Anuladas'});
    }

    if (this.authService.hasRole('ROL_SIAN_REP_CON_VTA_CLI_DELIVERY')) {
      this.reporteList.push({codigo: 3, descripcion: 'Ventas de Clientes Delivery'});
    }

    if (this.authService.hasRole('ROL_SIAN_REP_CON_VTA_PJI')) {
      this.reporteList.push({codigo: 4, descripcion: 'Reporte PJI'});
    }
  }

  private loadEstados(): void {
    this.estadoList.push({codigo: '0', descripcion: 'TODOS'}, {codigo: '1', descripcion: 'PARCIAL'}, {codigo: '2', descripcion: 'TOTAL'})
    this.estadoSeleccionado = {codigo: '0', descripcion: 'TODOS'};
  }

  public onChangeReporte(): void {
    this.showEstado = this.reporteSeleccionado.codigo === 2;
    this.showTiendas = this.reporteSeleccionado.codigo !==3;
  }

  public buscar(): void {
    if (!this.valida) {
      return;
    }
    
    let dto: ParamDto = new ParamDto();
    dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
    dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
    dto.tiendaList = this.tiendasSeleccionadas;

    this.spinner.show();
    if (this.reporteSeleccionado.codigo === 1) {
      this.reporteService.getReporteControlVentaTicketAnulado(dto).subscribe(
        response => {
          this.ticketAnuladoList = response.lista;
          this.tiendaErrorList = response.tienda;

          console.log(response.lista);
          console.log(this.ticketAnuladoList);
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else if (this.reporteSeleccionado.codigo === 2) {
      this.reporteService.getReporteControlVentaAnulado(dto).subscribe(
        response => {
          this.ventaAnuladaList = response.lista;
          this.tiendaErrorList = response.tienda;

          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else if (this.reporteSeleccionado.codigo === 3) {
      this.reporteService.getReporteControlClienteDelivery(dto).subscribe(
        response => {
          this.clienteDeliveryList = response.lista;
          this.tiendaErrorList = response.tienda;

          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else {
      this.reporteService.getReporteControlPji(dto).subscribe(
        response => {
          this.reportePjiList = response.lista;
          this.tiendaErrorList = response.tienda;
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    }
  }

  private valida(): boolean {
    if (this.reporteSeleccionado === undefined) {
      swal.fire('Advertencia!', 'Debe seleccionar un reporte', 'warning');
      return false;
    }

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

    return true;
  }

  public exportar(): void {
    if (this.reporteSeleccionado.codigo === 1) {
      this.exportTicketsAnulados();
    } else if (this.reporteSeleccionado.codigo === 2) {
      this.exportVentasAnuladas();
    } else if (this.reporteSeleccionado.codigo === 3) {
      this.exportClientesDelivery();
    } else {
      this.exportReportePji();
    }
  }

  private exportTicketsAnulados(): void {
    if (!this.ticketAnuladoList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('TicketsAnulados');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Tickets Anulados']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:I2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:I3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Tienda', 'Fecha', '#Ticket', 'Monto', 'Cajero', 'Administrador', 'Motivo', 'Inicio', 'Canal Venta']);
    worksheet.columns = [{ width: 33 }, { width: 10 }, { width: 14 }, { width: 7 }, { width: 39 }, { width: 25 }, { width: 21 }, { width: 21 }, { width: 21 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.ticketAnuladoList.forEach(info => {
      if (info.tipo === 'C') {
        worksheet.addRow([info.tiendaNombre, info.openDate, info.transact, info.importe, info.empleado, info.administrador, info.motivo, info.inicio, info.canalVenta]);

        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial' };
        });
      } else if (info.tipo === 'TT') {
        worksheet.addRow([info.tiendaNombre.replace(/&nbsp;/g, ' '), '', '', '', info.empleado.replace(/&nbsp;/g, ' '), '', '', info.openDate.replace(/&nbsp;/g, ' '), '']);

        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial', bold: true, color: {argb:'FFFFFF'}};
          cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'154360'}};
        });

        worksheet.mergeCells(contador, 1, contador, 4);
        worksheet.mergeCells(contador, 5, contador, 7);
        worksheet.mergeCells(contador, 8, contador, 9);
      } else {
        worksheet.addRow([info.tiendaNombre.replace(/&nbsp;/g, ' '), '', '', '', info.empleado.replace(/&nbsp;/g, ' '), '', '', info.openDate.replace(/&nbsp;/g, ' '), '']);

        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial', bold: true };
          cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'5DADE2'}};
        });

        worksheet.mergeCells(contador, 1, contador, 4);
        worksheet.mergeCells(contador, 5, contador, 7);
        worksheet.mergeCells(contador, 8, contador, 9);
      }

      worksheet.getRow(contador).getCell(4).numFmt = '#,##0.00';
      
      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'VentasAnuladas_' + timestamp + '.xlsx');
    });
  }

  private exportVentasAnuladas(): void {
    if (!this.ventaAnuladaList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('VentasAnuladas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas Anuladas']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:K2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:K3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Tienda', '#TICKET', 'Autoriza', 'Vendedor/Mozo', 'Fecha', 'Hora', 'Producto', 'Importe Anulado', 'Total Cobrado', 'Estado', 'Canal']);
    worksheet.columns = [{ width: 21 }, { width: 9 }, { width: 25 }, { width: 25 }, { width: 9 }, { width: 8 }, { width: 28 }, { width: 8 }, { width: 8 }, { width: 11 }, { width: 15 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.ventaAnuladaList.forEach(info => {
       worksheet.addRow([info.tiendaNombre, info.transaccion, info.autoriza, info.vendedor, info.fechaVenta, this.pipe.transform(info.hora, 'HH:mm:ss'), info.producto, info.importe, info.totalTransaccion, info.estado, info.canalVenta]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';
      
      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'VentasAnuladas_' + timestamp + '.xlsx');
    });
  }

  private exportClientesDelivery(): void {
    if (!this.clienteDeliveryList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Clientes Delivery');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte PJI']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:M2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:M3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Código', 'Apellidos y Nombres', 'DNI', 'Email', 'Distrito', 'Dirección 1', 'Dirección 2', 'Teléfono 1', 'Teléfono 2', 'Fecha', 'Importe', 'Tienda', 'Tipo']);
    worksheet.columns = [{ width: 12 }, { width: 30 }, { width: 9 }, { width: 9 }, { width: 12 }, { width: 25 }, { width: 25 }, { width: 10 }, { width: 10 }, { width: 9 }, { width: 10 }, { width: 20 }, { width: 10 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.clienteDeliveryList.forEach(info => {
       worksheet.addRow([info.codigo, info.apellidos + ' ' + info.nombres, info.dni, info.email, info.distrito, info.direccion1, info.direccion2, info.telefono1, info.telefono2, info.fechaVenta, info.importe, info.tienda, info.tipo]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(11).numFmt = '#,##0.00';
      
      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ClientesDelivery_' + timestamp + '.xlsx');
    });
  }

  private exportReportePji(): void {
    if (!this.reportePjiList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('PJI');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte PJI']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:K2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:K3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Fecha', 'NetSales', 'DeliverySales', 'CarryOutSales', 'DineInOutSales', 'TransaccOrder', 'DeliveryOrders', 'CarryOutOrders', 'DinInOrders', 'Tienda', 'Tienda Pixel']);
    worksheet.columns = [{ width: 14 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 25 }, { width: 13 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.reportePjiList.forEach(info => {
       worksheet.addRow([info.fecha, info.netSales, info.deliverySales, info.carryOutSales, info.dineInOutSales, info.transaccOrders, info.deliveryOrders1, info.deliveryOrders2, info.dineInOrders, info.tiendaNombre, info.tienda]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(2).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(4).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(5).numFmt = '#,##0.00';

      worksheet.getRow(contador).getCell(6).numFmt = '#,##';
      worksheet.getRow(contador).getCell(7).numFmt = '#,##';
      worksheet.getRow(contador).getCell(8).numFmt = '#,##';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##';
      
      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ReportePJI_' + timestamp + '.xlsx');
    });
  }

}
