import { Component, HostListener, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Cell, Workbook } from 'exceljs';
import { RowInvalid } from '../../dto/row-invalid';

import * as fs from 'file-saver';

@Component({
  selector: 'app-error-carga-masiva',
  templateUrl: './error-carga-masiva.component.html',
  styleUrls: ['./error-carga-masiva.component.css']
})
export class ErrorCargaMasivaComponent implements OnInit {

  public rowInvalidList: RowInvalid[] = [];

  public isMobile: boolean = window.innerWidth < 641;

  constructor(public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.rowInvalidList = this.config.data;
  }

  exportar(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Errores');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Errores en la Carga Masiva']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:B2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Índice', 'Descripción']);
    worksheet.columns = [{ width: 10 }, { width: 50 }];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.rowInvalidList.forEach(invalid => {
       worksheet.addRow([invalid.index, invalid.descripcion]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Errores.xlsx');
    });
  }

  cerrar(): void {
    this.ref.close();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
