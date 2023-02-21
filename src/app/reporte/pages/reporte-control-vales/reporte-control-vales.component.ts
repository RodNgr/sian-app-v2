import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TiendaDto } from '../../dto/tienda-dto';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { ParamDto } from '../../dto/param-dto';
import { ValeAlimentoDto } from '../../dto/vale-alimento-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

interface Reporte {
  codigo: number;
  descripcion: string;
}

@Component({
  selector: 'app-reporte-control-vales',
  templateUrl: './reporte-control-vales.component.html',
  styleUrls: ['./reporte-control-vales.component.css']
})
export class ReporteControlValesComponent implements OnInit {

  public reporteList: Reporte[] = [];

  public reporteSeleccionado!: Reporte;

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public dataList: ValeAlimentoDto[] = [];

  public tiendaErrorList: TiendaDto[] = [];

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  private pipe = new DatePipe("en-US");

  public rowGroupMetadata: any;

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.reporteList.push({codigo: 1, descripcion: 'Reporte de Vales de Alimentos'});
    this.reporteSeleccionado = this.reporteList[0];

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

  public onChangeReporte(): void {
    this.dataList = [];
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

    this.reporteService.getReporteValeAlimento(dto).subscribe(
      response => {
        this.dataList = response.lista
        this.tiendaErrorList = response.tienda

        console.log(this.dataList);

        this.updateRowGroupMeta();
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
      }
    );
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
    if (!this.dataList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:H2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:H3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['', 'Fecha', 'Turno', 'Forma de Pago', 'Cajero', 'Importe', 'Comandas', 'Administrador']);
    worksheet.columns = [{ width: 25 }, { width: 10 }, { width: 9 }, { width: 16 }, { width: 20 }, { width: 11 }, { width: 11 }, { width: 20 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let tiendasId: number[] = [];
    
    this.dataList.forEach(venta => {
      tiendasId.push(venta.tienda);
    }); 

    tiendasId = tiendasId.filter(function(value: number, pos: number, self: number[]) {
      return self.indexOf(value) === pos;
    })

    let contador: number = 6;

    tiendasId.forEach(t => {
      worksheet.addRow([this.rowGroupMetadata[t].nombre + ' (' + this.rowGroupMetadata[t].size + ')', '' , '', '', '', this.rowGroupMetadata[t].importe, this.rowGroupMetadata[t].comandas], '');

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial', bold: true };
      });

      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(7).numFmt = '#,##';

      contador++;

      this.dataList.forEach(venta => {
        if (venta.tienda === t) {
          worksheet.addRow(['', venta.openDate, venta.punchIndex, venta.descript, venta.posName, venta.importe, venta.nr, venta.administrador]);

          worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });

          worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(7).numFmt = '#,##';
          
          contador++;
        }
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'VentasAlimento_' + timestamp + '.xlsx');
    });
  }

  private updateRowGroupMeta() {
    this.rowGroupMetadata = {};

    if (this.dataList) {
      for (let i = 0; i < this.dataList.length; i++) {
        let rowData = this.dataList[i];
        let tienda = rowData.tienda;
        let importe = rowData.importe;
        let comandas = rowData.nr;
        let nombre = rowData.nombreTienda;
        
        if (i == 0) {
          this.rowGroupMetadata[tienda] = { index: 0, size: 1, importe: importe, comandas: comandas, nombre: nombre };
        } else {
          let previousRowData = this.dataList[i - 1];
          let previousRowGroup = previousRowData.tienda;
          if (tienda === previousRowGroup) {
            this.rowGroupMetadata[tienda].size++;
            this.rowGroupMetadata[tienda].importe = this.rowGroupMetadata[tienda].importe + importe;
            this.rowGroupMetadata[tienda].comandas = this.rowGroupMetadata[tienda].comandas + comandas;
          } else {
            this.rowGroupMetadata[tienda] = { index: i, size: 1, importe: importe, comandas: comandas, nombre: nombre };
          }
        }
      }
    }
  }

}
