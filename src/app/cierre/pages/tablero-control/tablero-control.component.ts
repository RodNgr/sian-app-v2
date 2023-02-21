import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';
import { CierreDto } from '../../dto/cierre-dto';
import { ResultadoDto } from '../../dto/resultado-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-tablero-control',
  templateUrl: './tablero-control.component.html',
  styleUrls: ['./tablero-control.component.css']
})
export class TableroControlComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public fechaIniSeleccionada!: Date;

  public fechaFinSeleccionada!: Date;

  private pipe = new DatePipe("en-US");

  public resultadoDto: ResultadoDto = new ResultadoDto();

  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private reporteService: ReporteService,
              private authService: AuthService
              ) { }

  ngOnInit(): void {
    const dateMnsFive = moment(new Date()).subtract(1 , 'day');

    this.fechaIniSeleccionada = new Date(dateMnsFive.toISOString());    
    this.fechaFinSeleccionada = new Date();   

    this.spinner.show();
    this.reporteService.getTiendasPorEmpresa(this.empresaService.getEmpresaSeleccionada().idEmpresa, this.authService.getUsuarioInterface()).subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;
        this.tiendasSeleccionadas = [... this.tiendaList];

        console.log(this.tiendaList);

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los locales', 'error');
      }
    );
  }

  public listar(): void {
    if (this.validaFiltros()) {
      const cierreDto: CierreDto = new CierreDto();
      cierreDto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
      cierreDto.fechaInicio= this.pipe.transform(this.fechaIniSeleccionada, "yyyyMMdd") || '';
      cierreDto.fechaFin = this.pipe.transform(this.fechaFinSeleccionada, "yyyyMMdd") || '';
      cierreDto.tiendas = this.tiendasSeleccionadas;
      cierreDto.idTiendaArray = '';
      this.tiendasSeleccionadas.forEach(t => {
        cierreDto.idTiendaArray = cierreDto.idTiendaArray + t.tienda + ',';
      });

      cierreDto.idTiendaArray = cierreDto.idTiendaArray.substring(0, cierreDto.idTiendaArray.length - 1);

      this.spinner.show();
      this.reporteService.getTableroControl(cierreDto).subscribe(
        json => {
          this.resultadoDto = json.data;
          console.log(this.resultadoDto);
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          swal.fire(err.error.mensaje, err.error.error, 'error');
        }
      );
    }
  }

  private validaFiltros(): boolean {
    if (this.tiendasSeleccionadas.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar una tienda', 'warning');
      return false;
    }

    if (this.fechaIniSeleccionada === undefined || this.fechaIniSeleccionada === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha inicial', 'warning');
      return false;
    }

    if (this.fechaFinSeleccionada === undefined || this.fechaFinSeleccionada === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha final', 'warning');
      return false;
    }

    if (this.fechaIniSeleccionada.getDate() > this.fechaFinSeleccionada.getDate()) {
      swal.fire('Advertencia!', 'La fecha inicial no puede ser mayor a la fecha final', 'warning');
      return false;
    }

    return true;
  }

  public exportXLS(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Cuadro de Control');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Resumen']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:I2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.getRow(4).getCell(1).value = 'Tienda';
    worksheet.getRow(4).getCell(2).value = 'Últ. Cierre';
    
    let contador: number = 3
    this.resultadoDto.childColumnNames.forEach(p => {
      worksheet.getRow(4).getCell(contador).value = p.name;
      contador++;
    });

    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    contador = 5;
    this.resultadoDto.valores.forEach(v => {
      worksheet.getRow(contador).getCell(1).value = v.data['tienda'];
      worksheet.getRow(contador).getCell(2).value = v.data['fechaCierre'];

      let col = 3;
      this.resultadoDto.childColumnNames.forEach(p => {
        worksheet.getRow(contador).getCell(col).value = v.data[p.busqueda].value;
        col++;
      });

      worksheet.getRow(contador).eachCell(function(cell: Cell, _colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      contador++;
    });
    
    contador = 1;
    worksheet.columns[0].width = 30;
    worksheet.columns[1].width = 10;
    
    /*
    worksheet.columns.forEach(c => {
      if (contador === 1) {
        c.width = 25;
      } else {
        c.width = 7;
      }
      
      contador ++;
    })
    */

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Cuadro de Control.xlsx');
    });
  }

}
