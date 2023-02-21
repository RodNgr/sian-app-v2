import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ParamDto } from '../../dto/param-dto';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { DatePipe } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';
import { CallVentasBaseDto } from '../../dto/call-ventas-base-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

interface Tipo {
  codigo: string,
  descripcion: string
}

@Component({
  selector: 'app-reporte-gestion-call-center1',
  templateUrl: './reporte-gestion-call-center1.component.html',
  styleUrls: ['./reporte-gestion-call-center1.component.css']
})
export class ReporteGestionCallCenter1Component implements OnInit {

  public tipoList: Tipo[] = [];

  public tipoSeleccionado!: Tipo;

  public dataList: CallVentasBaseDto[] = [];

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  private pipe = new DatePipe("en-US");

  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.loadTipos();
  }

  private loadTipos(): void {
    this.tipoList = [{codigo: '0', descripcion: 'BASE'}, {codigo: '1', descripcion: 'TICKET PROMEDIO POR CLIENTE'}, {codigo: '2', descripcion: 'FRECUENCIA SEMESTRAL'}, {codigo: '3', descripcion: 'RESUMEN CALL CENTER'}];
    this.tipoSeleccionado = {codigo: '0', descripcion: 'BASE'};
  }

  public onChangeTipo(): void {
    this.dataList = [];
  }

  public buscar(): void {
    if (!this.valida()) {
      return;
    }

    let dto: ParamDto = new ParamDto();
    dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
    dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
    
    this.spinner.show();
    if (this.tipoSeleccionado.codigo === '0') {
      this.reporteService.getReporteCallVentaBase(dto).subscribe(
        dataList => {
          this.dataList = dataList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else if (this.tipoSeleccionado.codigo === '1') {
      this.reporteService.getReporteCallVentaTckPromedio(dto).subscribe(
        dataList => {
          this.dataList = dataList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else if (this.tipoSeleccionado.codigo === '2') {
      this.reporteService.getReporteCallVentaFrecuenciaSemestral(dto).subscribe(
        dataList => {
          this.dataList = dataList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else {
      this.reporteService.getReporteCallVentaResumen(dto).subscribe(
        dataList => {
          this.dataList = dataList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    }
  }

  private valida(): boolean {
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
    if (!this.dataList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    if (this.tipoSeleccionado.codigo === '0') {
      this.exportarData();
    } else if (this.tipoSeleccionado.codigo === '1') {
      this.exportTicketPromedio();
    } else if (this.tipoSeleccionado.codigo === '2') {
      this.exportFrecuenciaSemestral();
    } else {
      this.exportResumen();
    }
  }

  private exportarData(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Call Center - Data Base');

    worksheet.addRow(['']);
    worksheet.addRow(['Call Center Ventas - Data Base']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:K2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:K3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Canal', 'Cliente', 'Registro Membresía', 'Fecha', 'Transacción', 'Dirección', 'Referencia', 'Correo', 'Teléfono', 'Monto', 'Medio Pago']);
    worksheet.columns = [{ width: 15 }, { width: 35 }, { width: 9 }, { width: 9 }, { width: 9 }, { width: 35 }, { width: 35 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 25 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.dataList.forEach(info => {
      worksheet.addRow([info.canal, info.cliente, info.fechaRegistro, info.fechaVenta, info.transaccion, info.direccion, info.referencia, info.correo, info.telefono, info.monto, info.formaPago]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });
    
      worksheet.getRow(contador).getCell(10).numFmt = '#,##0.00';

      contador++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Data_' + timestamp + '.xlsx');
    });
  }

  private exportTicketPromedio(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Call Center - Tck Promedio');

    worksheet.addRow(['']);
    worksheet.addRow(['Call Center Ventas - Ticket Promedio por Cliente']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:F3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Cliente', 'Cantidad de Transacciones', 'Total Neto (S/)', 'Total Venta (S/)', 'Ticket Promedio Neto (S/)', 'Ticket Promedio Venta (S/)']);
    worksheet.columns = [{ width: 35 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.dataList.forEach(info => {
      worksheet.addRow([info.cliente, info.qtyTransacciones, info.totalNeto, info.totalVenta, info.tckPromNeto, info.tckPromVenta]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });
    
      worksheet.getRow(contador).getCell(2).numFmt = '#,##';
      worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(4).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(5).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';

      contador++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TicketPromedio_' + timestamp + '.xlsx');
    });
  }

  private exportFrecuenciaSemestral(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Call Center - Frec. Semestral');

    worksheet.addRow(['']);
    worksheet.addRow(['Call Center Ventas - Frecuencial Semestral']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:H2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:H3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Nombre', 'Ene. a Jun.', 'Feb. a Jul.', 'Mar. a Ago.', 'Abr. a Set.', 'May. a Oct.', 'Jun. a Nov.', 'Jul. a Dic.']);
    worksheet.columns = [{ width: 30 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.dataList.forEach(info => {
      worksheet.addRow([info.descripcion, info.frecuencia1, info.frecuencia2, info.frecuencia3, info.frecuencia4, info.frecuencia5, info.frecuencia6, info.frecuencia6, info.frecuencia7]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });
    
      worksheet.getRow(contador).getCell(2).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(4).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(5).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(7).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';

      contador++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'FrecuenciaSemestral_' + timestamp + '.xlsx');
    });
  }

  private exportResumen(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Call Center - Resumen');

    worksheet.addRow(['']);
    worksheet.addRow(['Call Center Ventas - Resumen']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:G2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:G3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['#Veces de Compras Realizadas', 'Cantidad Clientes', '%Clientes', 'Cantidad Transacciones', 'Total Venta (S/)', '%Venta', 'Ticket Promedio']);
    worksheet.columns = [{ width: 30 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.dataList.forEach(info => {
      worksheet.addRow([info.comprasRealizadas, info.qtyClientes, info.porcClientes, info.qtyTransacciones, info.totalVenta, info.porcVentas, info.tckPromVenta]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });
    
      worksheet.getRow(contador).getCell(1).numFmt = '#,##';
      worksheet.getRow(contador).getCell(2).numFmt = '#,##';
      worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(4).numFmt = '#,##';
      worksheet.getRow(contador).getCell(5).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(7).numFmt = '#,##0.00';

      contador++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Resumen_' + timestamp + '.xlsx');
    });
  }

}
