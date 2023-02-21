import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { TiendaDto } from '../../dto/tienda-dto';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { ParamDto } from '../../dto/param-dto';
import { DatePipe } from '@angular/common';
import { PagadoEfectivoDto } from '../../dto/pagado-efectivo-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-reporte-gestion-pagado-efectivo',
  templateUrl: './reporte-gestion-pagado-efectivo.component.html',
  styleUrls: ['./reporte-gestion-pagado-efectivo.component.css']
})
export class ReporteGestionPagadoEfectivoComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public pagadoList: PagadoEfectivoDto[] = [];

  public tiendaErrorList: TiendaDto[] = [];

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

    dto.tiendaList.forEach(t => {
      t.empresa = this.empresaService.getEmpresaSeleccionada().nombre;
    })
    
    this.spinner.show();

    this.reporteService.getReportePagoCobradoEfectivo(dto).subscribe(
      response => {
        this.pagadoList = response.lista;
        this.tiendaErrorList = response.tienda;

        console.log(this.pagadoList);
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al generar el reporte', 'error');
      }
    );
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

  public exportar() {
    if (!this.pagadoList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('CobradoPagado');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Pagado y Cobrado en Efectivo']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:M2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:M3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Unidad Negocio', 'Fecha', 'Base', 'Centro', 'Tienda', 'Pagado/Cobrado', 'Cajero', 'Gerente', 'Turno', 'Fecha Hora', 'Moneda', 'Monto Original', 'Monto S/.']);
    worksheet.columns = [{ width: 13 }, { width: 10 }, { width: 5 }, { width: 7 }, { width: 17 }, { width: 18 }, { width: 21 }, { width: 21 }, { width: 7 }, { width: 15 }, { width: 8 }, { width: 11 }, { width: 10 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.pagadoList.forEach(info => {
      worksheet.addRow([info.unidadNegocio, info.openDate, info.codigoTienda, info.centro, info.tiendaNombre, info.reasonName, info.cajero, info.gerente, info.punchIndex, this.pipe.transform(info.fechaHora, 'dd/MM/yyyy HH:mm:ss'), info.moneda, info.montoOriginal, info.montoSoles]);
      
      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(12).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(13).numFmt = '#,##0.00';

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'PagadoCobradoEfectivo_' + timestamp + '.xlsx');
    });
  }

}
