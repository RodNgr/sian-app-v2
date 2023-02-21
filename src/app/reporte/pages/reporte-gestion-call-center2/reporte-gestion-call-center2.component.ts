import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { ReporteService } from '../../services/reporte.service';
import { CallMambresiaBaseDto } from '../../dto/call-membresia-base-dto';
import { ParamDto } from '../../dto/param-dto';
import swal from 'sweetalert2';
import { data } from 'jquery';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

interface Tipo {
  codigo: string,
  descripcion: string
}

@Component({
  selector: 'app-reporte-gestion-call-center2',
  templateUrl: './reporte-gestion-call-center2.component.html',
  styleUrls: ['./reporte-gestion-call-center2.component.css']
})
export class ReporteGestionCallCenter2Component implements OnInit {

  public tipoList: Tipo[] = [];

  public tipoSeleccionado!: Tipo;

  public dataList: CallMambresiaBaseDto[] = [];

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
    this.tipoList = [{codigo: '0', descripcion: 'BASE'}, {codigo: '1', descripcion: 'EVOLUTIVO MENSUAL DE CLIENTES'}, {codigo: '2', descripcion: 'CANTIDAD MEMBRESÍAS POR NIVEL'}, {codigo: '3', descripcion: 'CANTIDAD MEMBRESÍAS POR TIPO DE TELÉFONO'}];
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
      this.reporteService.getReporteCallMembresiaBase(dto).subscribe(
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
      this.reporteService.getReporteCallMembresiaEvolutivo(dto).subscribe(
        dataList => {
          this.dataList = dataList;
          console.log(dataList);
          console.log(this.dataList);
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else if (this.tipoSeleccionado.codigo === '2') {
      this.reporteService.getReporteCallMembresiaTipoNivel(dto).subscribe(
        dataList => {
          this.dataList = dataList;
          console.log(dataList);
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else {
      this.reporteService.getReporteCallMembresiaTipoTelefono(dto).subscribe(
        dataList => {
          this.dataList = dataList;
          console.log(dataList);
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
    if (this.tipoSeleccionado.codigo === '0') {
      this.exportarBase();
    } else {
      this.exportarResumen();
    }
  }

  private exportarBase(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Call Center Membresías - Data Base');

    worksheet.addRow(['']);
    worksheet.addRow(['Call Center Membresías - Data Base']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:I2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:I3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Cliente', 'Dirección', 'Distrito', 'Transacción', 'Tienda', 'Fecha', 'Teléfono', 'Tipo Teléfono', 'Nivel Tienda']);
    worksheet.columns = [{ width: 25 }, { width: 25 }, { width: 12 }, { width: 9 }, { width: 15 }, { width: 9 }, { width: 9 }, { width: 12 }, { width: 12 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.dataList.forEach(info => {
      worksheet.addRow([info.cliente, info.direccion, info.ciudad, info.transaccion, info.tienda, info.fechaVenta, info.telefono, info.tipoTelefono, info.nivel]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });
    
      contador++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Data_' + timestamp + '.xlsx');
    });
  }

  private exportarResumen(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Call Center Membresías - Data Base');

    worksheet.addRow(['']);

    if (this.tipoSeleccionado.codigo === '1') {
      worksheet.addRow(['Call Center Membresías - Evolutivo Mensual Clientes']);
    } else if (this.tipoSeleccionado.codigo === '2') {
      worksheet.addRow(['Call Center Membresías - Cantidad Membresías Nivel']);
    } else {
      worksheet.addRow(['Call Center Membresías - Cantidad Membresías Tipo']);
    }
    
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:M2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:M3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Descripción', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']);
    worksheet.columns = [{ width: 20 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.dataList.forEach(info => {
      worksheet.addRow([info.descripcion, info.mesesMap[1], info.mesesMap[2], info.mesesMap[3], info.mesesMap[4], info.mesesMap[5], info.mesesMap[6], info.mesesMap[7], info.mesesMap[8], info.mesesMap[9], info.mesesMap[10], info.mesesMap[11], info.mesesMap[12]]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(2).numFmt = '#,##';
      worksheet.getRow(contador).getCell(3).numFmt = '#,##';
      worksheet.getRow(contador).getCell(4).numFmt = '#,##';
      worksheet.getRow(contador).getCell(5).numFmt = '#,##';
      worksheet.getRow(contador).getCell(6).numFmt = '#,##';
      worksheet.getRow(contador).getCell(7).numFmt = '#,##';
      worksheet.getRow(contador).getCell(8).numFmt = '#,##';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##';
      worksheet.getRow(contador).getCell(10).numFmt = '#,##';
      worksheet.getRow(contador).getCell(11).numFmt = '#,##';
      worksheet.getRow(contador).getCell(12).numFmt = '#,##';
      worksheet.getRow(contador).getCell(13).numFmt = '#,##';

      contador++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      
      if (this.tipoSeleccionado.codigo === '1') {
        fs.saveAs(blob, 'EvolutivoMensualClientes_' + timestamp + '.xlsx');
      } else if (this.tipoSeleccionado.codigo === '2') {
        fs.saveAs(blob, 'CantidadMembresiasNivel_' + timestamp + '.xlsx');
      } else {
        fs.saveAs(blob, 'CantidadMembresiasTipo_' + timestamp + '.xlsx');
      }
    });

  }

}
