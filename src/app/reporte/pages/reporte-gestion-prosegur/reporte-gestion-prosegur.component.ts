import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import swal from 'sweetalert2';
import { Tienda } from '../../entity/tienda';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteService } from '../../services/reporte.service';
import { ParamDto } from '../../dto/param-dto';
import { DatePipe } from '@angular/common';
import { TiendaDto } from '../../dto/tienda-dto';
import { ProsegurRemitoDto } from '../../dto/prosegur-remito-dto';
import { ProsegurDiferenciaDto } from '../../dto/prosegur-diferencia-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

interface Reporte {
  codigo: number;
  descripcion: string;
}

@Component({
  selector: 'app-reporte-gestion-prosegur',
  templateUrl: './reporte-gestion-prosegur.component.html',
  styleUrls: ['./reporte-gestion-prosegur.component.css']
})
export class ReporteGestionProsegurComponent implements OnInit {

  public reporteList: Reporte[] = [];

  public reporteSeleccionado!: Reporte;

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public remitoList: ProsegurRemitoDto[] = [];

  public diferenciaList: ProsegurDiferenciaDto[] = [];

  public tiendaErrorList: TiendaDto[] = [];

  private pipe = new DatePipe("en-US");

  public rowGroupMetadata: any;

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.loadReportesValidos();

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
    if (this.authService.hasRole('ROL_SIAN_REP_GES_PRO_REMITOS')) {
      this.reporteList.push({codigo: 1, descripcion: 'Remitos Prosegur'});
    }

    if (this.authService.hasRole('ROL_SIAN_REP_GES_PRO_DIFERENCIA')) {
      this.reporteList.push({codigo: 2, descripcion: 'Diferencias Prosegur'});
    }
  }

  public onChangeReporte() {
    this.remitoList = [];
    this.diferenciaList = [];
    this.tiendaErrorList = [];
    this.rowGroupMetadata = {};
  }

  public buscar(): void {
    if (!this.valida()) {
      return;
    }

    let dto: ParamDto = new ParamDto();
    dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
    dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
    dto.tiendaList = this.tiendasSeleccionadas;

    this.spinner.show();
    if (this.reporteSeleccionado.codigo === 1) {
      this.reporteService.getReporteProsegurRemitos(dto).subscribe(
        response => {
          this.remitoList = response.lista;
          this.tiendaErrorList = response.tienda;

          this.updateRowGroupMetaDataRemitos();
          this.spinner.hide()
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    } else {
      this.reporteService.getReporteProsegurDiferencia(dto).subscribe(
        response => {
          this.diferenciaList = response.lista;
          this.tiendaErrorList = response.tienda;
          this.spinner.hide()
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
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

  private updateRowGroupMetaDataRemitos() {
    this.rowGroupMetadata = {};

    if (this.remitoList) {
      for (let i = 0; i < this.remitoList.length; i++) {
        let rowData = this.remitoList[i];
        let tienda = rowData.tienda;
        let dolares = rowData.dolares;
        let soles = rowData.soles;
        
        if (i == 0) {
          this.rowGroupMetadata[tienda] = { index: 0, size: 1, dolares: dolares, soles: soles };
        } else {
          let previousRowData = this.remitoList[i - 1];
          let previousRowGroup = previousRowData.tienda;
          if (tienda === previousRowGroup) {
            this.rowGroupMetadata[tienda].size++;
            this.rowGroupMetadata[tienda].soles = this.rowGroupMetadata[tienda].soles + soles;
            this.rowGroupMetadata[tienda].dolares = this.rowGroupMetadata[tienda].dolares + dolares;
          } else {
            this.rowGroupMetadata[tienda] = { index: i, size: 1, dolares: dolares, soles: soles };
          }
        }
      }
    }
  }

  public export(): void {
    if (this.reporteSeleccionado.codigo === 1) {
      this.exportRemitos();
    } else {
      this.exportDiferencias();
    }
  }

  private exportRemitos(): void {
    if (!this.remitoList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Remitos');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de remitos a PROSEGUR']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:K2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:K3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['', 'Centro Costo', 'Fecha', 'Hora Depósito', 'Cajero', 'Tipo Movimiento', 'Monto Dólares', 'Monto Soles', 'Tipo Cambio', 'Comentario', 'Autorizado']);
    worksheet.columns = [{ width: 25 }, { width: 10 }, { width: 10 }, { width: 21 }, { width: 29 }, { width: 25 }, { width: 11 }, { width: 11 }, { width: 11 }, { width: 29 }, { width: 30 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let tiendasId: number[] = [];
    
    this.remitoList.forEach(remito => {
      tiendasId.push(remito.tienda)
    }); 

    tiendasId = tiendasId.filter(function(value: number, pos: number, self: number[]) {
      return self.indexOf(value) === pos;
    })

    let contador: number = 6;

    tiendasId.forEach(t => {
      worksheet.addRow([t + ' (' + this.rowGroupMetadata[t].size + ')' , '', '', '', '', '', this.rowGroupMetadata[t].dolares, this.rowGroupMetadata[t].soles, '', '', '']);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial', bold: true };
      });

      worksheet.getRow(contador).getCell(7).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';

      worksheet.mergeCells(contador, 0, contador, 6);
      worksheet.mergeCells(contador, 9, contador, 11);

      contador++;

      this.remitoList.forEach(remito => {
        if (remito.tienda === t) {
          worksheet.addRow(['', remito.ceco, remito.fecha, remito.horaDeposito, remito.cajero, remito.movimiento, remito.dolares, remito.soles, remito.tipoCambio, remito.comentario, remito.autorizado]);

          worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });

          worksheet.getRow(contador).getCell(7).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';
          
          contador++;
        }
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Remitos_' + timestamp + '.xlsx');
    });
  }

  private exportDiferencias(): void {
    if (!this.diferenciaList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Remitos');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de remitos a PROSEGUR']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:D3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Tienda', 'Fecha', 'PunchIndex', 'Cajero']);
    worksheet.columns = [{ width: 25 }, { width: 10 }, { width: 13 }, { width: 50 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.diferenciaList.forEach(info => {
       worksheet.addRow([info.tiendaNombre, info.fecha, info.punchIndex, info.cajero]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Remitos_' + timestamp + '.xlsx');
    });
  }

}
