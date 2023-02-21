import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from '../../../shared/services/empresa.service';
import { FormatoValeService } from '../../services/formato-vale.service';

import { Cell, Workbook } from 'exceljs';
import { FormatoVale } from '../../entity/formato-vale';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-formatos-vale',
  templateUrl: './lista-formatos-vale.component.html',
  styleUrls: ['./lista-formatos-vale.component.css']
})
export class ListaFormatosValeComponent implements OnInit {

  public formatoValeList: FormatoVale[] = [];

  public formatoValeSelected!: FormatoVale;

  public isMobile: boolean = window.innerWidth < 641;

  public cantidadMap = {
    '=0': 'No existen formatos',
    '=1': 'En total hay 1 formato',
    'other': 'En total hay # formatos'
  }

  public url!: string;

  constructor(private spinner: NgxSpinnerService,
              private formatoValeService: FormatoValeService,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('formato-vale');

    this.url = environment.urlCupones;
    this.list();
  }

  private list(): void {
    this.spinner.show();

    this.formatoValeService.getFormatosVales().subscribe(
      formatoList => {
        this.formatoValeList = formatoList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los Formatos', 'error');
      }
    );
  }

  public newFormato(): void {
    sessionStorage.setItem('tipoOperacion', 'N');

    this.router.navigateByUrl("/home/cupon/formato-vale");
  }

  public editFormato(): void {
    if (!this.formatoValeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un formato', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'E');
    sessionStorage.setItem('formato-vale', this.formatoValeSelected.id.toString());

    this.router.navigateByUrl("/home/cupon/formato-vale");
  }

  public viewFormato(): void {
    if (!this.formatoValeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un formato', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('formato-vale', this.formatoValeSelected.id.toString());

    this.router.navigateByUrl("/home/cupon/formato-vale");
  }

  public exportXLS(): void {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Formatos de Vales');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Formatos de Vales']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:B2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Id', 'Descripción']);
    worksheet.columns = [{ width: 20 }, { width: 60 }];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.formatoValeList.forEach(formato => {
       worksheet.addRow([formato.id, formato.descripcion]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'FormatoVale.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
