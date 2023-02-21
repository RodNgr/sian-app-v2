import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { SubFamilia2Service } from '../../services/sub-familia2.service';

import { Cell, Workbook } from 'exceljs';
import { SubFamilia2 } from '../../entity/sub-familia2';
import { Table } from 'primeng/table';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

@Component({
  selector: 'app-lista-sub-familia2',
  templateUrl: './lista-sub-familia2.component.html',
  styleUrls: ['./lista-sub-familia2.component.css']
})
export class ListaSubFamilia2Component implements OnInit {

  @ViewChild('dt') table!: Table;
    
  public subfamiliaList: SubFamilia2[] = [];

  public subFamiliaSelected!: SubFamilia2;

  public cantidadMap = {
    '=0': 'No existen sub familias',
    '=1': 'En total hay 1 sub familia',
    'other': 'En total hay # sub familias'
  }

  public isMobile: boolean = window.innerWidth < 641;

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private subFamilia2Service: SubFamilia2Service,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('subfamilia');

    this.list();
  }

  public applyFilterGlobal($event:any , stringVal: any) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  private list(): void {
    this.spinner.show();
    this.subFamilia2Service.getAll().subscribe(
      subfamiliaList => {
        this.subfamiliaList = subfamiliaList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las Sub Familias', 'error');
      }
    );
  }

  public add() {
    sessionStorage.setItem('tipoOperacion', 'N');

    this.router.navigateByUrl("/home/interfaz/subfamilia2");
  } 

  public edit() {
    if (!this.subFamiliaSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una sub familia', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'E');
    sessionStorage.setItem('subfamilia', this.subFamiliaSelected.id.toString());

    this.router.navigateByUrl("/home/interfaz/subfamilia2");
  }

  public view() {
    if (!this.subFamiliaSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una sub familia', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('subfamilia', this.subFamiliaSelected.id.toString());

    this.router.navigateByUrl("/home/interfaz/subfamilia2");
  }

  public remove() {
    if (!this.subFamiliaSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una familia', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de eliminar esta Sub Familia?',
      html: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        this.subFamiliaSelected.usuarioModificacion = this.authService.usuario.username;

        this.subFamilia2Service.remove(this.subFamiliaSelected).subscribe(
          _data => {
            this.spinner.hide();
            this.list();
            swal.fire('Éxito!', 'Sub Familia eliminada exitosamente!', 'success');
          },
          err => {
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
      }
    });
  }

  public exportList() {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Sub Familias 2');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Sub Familias 2']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Id', 'Descripción', 'Sub Familia 1', 'Empresa']);
    worksheet.columns = [{ width: 20 }, { width: 60 }, { width: 60 }, { width: 20 },];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.subfamiliaList.forEach(sufamilia => {
       worksheet.addRow([sufamilia.id, sufamilia.descripcion, sufamilia.subFamilia1.descripcion, empresa]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'SubFamilias2.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
