import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { ParamDto } from '../../dto/param-dto';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { DatePipe } from '@angular/common';
import { TiendaDto } from '../../dto/tienda-dto';
import { RendidoFormaPagoDto } from '../../dto/rendido-forma-pago-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-reporte-gestion-rendido-tarjetas',
  templateUrl: './reporte-gestion-rendido-tarjetas.component.html',
  styleUrls: ['./reporte-gestion-rendido-tarjetas.component.css']
})
export class ReporteGestionRendidoTarjetasComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public detallado: boolean = false;

  public transaccion: boolean = false;

  public tiendaErrorList: TiendaDto[] = [];

  public rendidoList: RendidoFormaPagoDto[] = [];
  
  private pipe = new DatePipe("en-US");

  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private reporteService: ReporteService) { }

  ngOnInit(): void {
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

  public buscar(): void {
    if (!this.valida()) {
      return;
    }

    let dto: ParamDto = new ParamDto();
    dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
    dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
    dto.tiendaList = this.tiendasSeleccionadas;

    this.tiendasSeleccionadas.forEach(tienda => {
      tienda.empresa = this.empresaService.getEmpresaSeleccionada().nombre;
    })

    this.spinner.show();
    if (this.detallado) {
      this.reporteService.getReporteRendidoTarjetaDetallado(dto).subscribe(
        response => {
          this.rendidoList = response.lista;
          this.tiendaErrorList = response.tienda;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else if (this.transaccion) {
      this.reporteService.getReporteRendidoTarjetaTransaccion(dto).subscribe(
        response => {
          this.rendidoList = response.lista;
          this.tiendaErrorList = response.tienda;
          console.log(this.rendidoList);
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else {
      this.reporteService.getReporteRendidoTarjeta(dto).subscribe(
        response => {
          this.rendidoList = response.lista;
          this.tiendaErrorList = response.tienda;
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
    if (!this.rendidoList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Rendido');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Rendidos de Tarjeta']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);

    if (this.detallado) {
      worksheet.mergeCells('A2:N2');
    } else if (this.transaccion) {
      worksheet.mergeCells('A2:M2');
    } else {
      worksheet.mergeCells('A2:L2');
    }
    
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    if (this.detallado) {
      worksheet.mergeCells('A3:N3');
    } else if (this.transaccion) {
      worksheet.mergeCells('A3:M3');
    } else {
      worksheet.mergeCells('A3:L3');
    }
    
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla

    if (this.detallado) {
      worksheet.addRow(['Unidad de Negocio', 'Fecha', 'Centro', 'Base', 'Tienda', 'Caja', 'Forma de Pago', 'PINPAD', 'INALAMBRICO', 'APP', 'INTERNET', 'SAFTPAY', 'TOTAL']);
      worksheet.columns = [{ width: 13 }, { width: 10 }, { width: 7 }, { width: 6 }, { width: 17 }, { width: 8 }, { width: 18 }, { width: 8 }, { width: 12 }, { width: 8 }, { width: 8 }, { width: 8 }, { width: 8 }];
    } else if (this.transaccion) {
      worksheet.addRow(['Unidad de Negocio', 'Fecha', 'Centro', 'Base', 'Tienda', 'Caja', 'Transacción', 'Forma de Pago', 'PINPAD', 'INALAMBRICO', 'APP', 'INTERNET', 'SAFTPAY', 'TOTAL']);
      worksheet.columns = [{ width: 13 }, { width: 10 }, { width: 7 }, { width: 6 }, { width: 17 }, { width: 8 }, { width: 10 }, { width: 18 }, { width: 8 }, { width: 12 }, { width: 8 }, { width: 8 }, { width: 8 }, { width: 8 }];
    } else {
      worksheet.addRow(['Unidad de Negocio', 'Fecha', 'Centro', 'Base', 'Tienda', 'Forma de Pago', 'PINPAD', 'INALAMBRICO', 'APP', 'INTERNET', 'SAFTPAY', 'TOTAL']);
      worksheet.columns = [{ width: 13 }, { width: 10 }, { width: 7 }, { width: 6 }, { width: 17 }, { width: 18 }, { width: 8 }, { width: 12 }, { width: 8 }, { width: 8 }, { width: 8 }, { width: 8 }];
    }
    
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.rendidoList.forEach(info => {
      if (this.detallado) {
        worksheet.addRow([info.empresa, info.openDate, info.centro, info.tienda, info.tiendaNombre, info.punchIndex, info.formaPago, info.pinPad, info.inalambrico, info.app, info.internet, info.saftpay, info.rendido]);
      } else if (this.transaccion) {
        worksheet.addRow([info.empresa, info.openDate, info.centro, info.tienda, info.tiendaNombre, info.punchIndex, info.transact, info.formaPago, info.pinPad, info.inalambrico, info.app, info.internet, info.saftpay, info.rendido]);
      } else {
        worksheet.addRow([info.empresa, info.openDate, info.centro, info.tienda, info.tiendaNombre, info.formaPago, info.pinPad, info.inalambrico, info.app, info.internet, info.saftpay, info.rendido]);
      }
      
      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

        contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'RendidoTarjetas_' + timestamp + '.xlsx');
    });
  }

}
