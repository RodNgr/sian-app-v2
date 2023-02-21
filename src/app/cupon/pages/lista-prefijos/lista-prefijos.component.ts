import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { PrefijoService } from '../../services/prefijo.service';

import { Cell, Workbook } from 'exceljs';
import { Prefijo } from '../../entity/prefijo';
import { Table } from 'primeng/table';

import swal from 'sweetalert2'

import * as fs from 'file-saver';

@Component({
  selector: 'app-lista-prefijos',
  templateUrl: './lista-prefijos.component.html',
  styleUrls: ['./lista-prefijos.component.css']
})
export class ListaPrefijosComponent implements OnInit {

  @ViewChild('dt') table!: Table;
    
  public prefijoList: Prefijo[] = [];

  public prefijoSelected!: Prefijo;

  public cantidadMap = {
    '=0': 'No existen prefijos',
    '=1': 'En total hay 1 prefijo',
    'other': 'En total hay # prefijos'
  }

  public isMobile: boolean = window.innerWidth < 641;

  constructor(private spinner: NgxSpinnerService,
              private prefijoService: PrefijoService,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('prefijo');

    this.list();
  }

  public applyFilterGlobal($event:any , stringVal: any) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  private list(): void {
    this.spinner.show();
    this.prefijoService.getPrefijos().subscribe(
      prefijoList => {
        this.prefijoList = prefijoList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los Prefijos', 'error');
      }
    );
  }

  public newPrefijo() {
    sessionStorage.setItem('tipoOperacion', 'N');

    this.router.navigateByUrl("/home/cupon/prefijo");
  } 

  public editPrefijo() {
    if (!this.prefijoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un prefijo', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'E');
    sessionStorage.setItem('prefijo', this.prefijoSelected.prefijo);

    this.router.navigateByUrl("/home/cupon/prefijo");
  }

  public viewPrefijo() {
    if (!this.prefijoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un prefijo', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('prefijo', this.prefijoSelected.prefijo);

    this.router.navigateByUrl("/home/cupon/prefijo");
  }

  public exportList() {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Prefijos');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Prefijos']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Prefijo', 'Grupo', 'Descripción', 'Longitud', 'Prod.Num', 'Empresa']);
    worksheet.columns = [{ width: 20 }, { width: 20 }, { width: 60 }, { width: 12 }, { width: 20 }, { width: 20 },];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.prefijoList.forEach(prefijo => {
       worksheet.addRow([prefijo.prefijo, prefijo.grupo, prefijo.descripcion, prefijo.lenCodBar, prefijo.prodnum, empresa]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
        
        if (colNumber === 5 || colNumber === 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Prefijos.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
