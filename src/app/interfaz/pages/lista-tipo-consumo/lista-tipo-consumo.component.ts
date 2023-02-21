import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { TipoConsumoService } from '../../services/tipo-consumo.service';

import { Cell, Workbook } from 'exceljs';
import { Table } from 'primeng/table';
import { TipoConsumo } from '../../entity/tipo-consumo';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

@Component({
  selector: 'app-lista-tipo-consumo',
  templateUrl: './lista-tipo-consumo.component.html',
  styleUrls: ['./lista-tipo-consumo.component.css']
})
export class ListaTipoConsumoComponent implements OnInit {

  @ViewChild('dt') table!: Table;
    
  public tipoConsumoList: TipoConsumo[] = [];

  public tipoConsumoSelected!: TipoConsumo;

  public cantidadMap = {
    '=0': 'No existen tipos de consumos',
    '=1': 'En total hay 1 tipo de consumo',
    'other': 'En total hay # tipos de consumos'
  }

  public isMobile: boolean = window.innerWidth < 641;

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private tipoConsumoService: TipoConsumoService,
              private empresaService: EmpresaService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('tipoConsumo');

    this.list();
  }

  public applyFilterGlobal($event:any , stringVal: any) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  private list(): void {
    this.spinner.show();
    this.tipoConsumoService.getAll().subscribe(
      tipoConsumoList => {
        this.tipoConsumoList = tipoConsumoList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los Tipos de Consumos', 'error');
      }
    );
  }

  public add() {
    sessionStorage.setItem('tipoOperacion', 'N');

    this.router.navigateByUrl("/home/interfaz/tipo-consumo");
  } 

  public edit() {
    if (!this.tipoConsumoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una tipo de consumo', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'E');
    sessionStorage.setItem('tipoConsumo', this.tipoConsumoSelected.id.toString());

    this.router.navigateByUrl("/home/interfaz/tipo-consumo");
  }

  public view() {
    if (!this.tipoConsumoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una tipo de consumo', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('tipoConsumo', this.tipoConsumoSelected.id.toString());

    this.router.navigateByUrl("/home/interfaz/tipo-consumo");
  }

  public remove() {
    if (!this.tipoConsumoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una tipo de consumo', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de eliminar este Tipo de Consumo?',
      html: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        this.tipoConsumoSelected.usuarioModificacion = this.authService.usuario.username;

        this.tipoConsumoService.remove(this.tipoConsumoSelected).subscribe(
          _data => {
            this.spinner.hide();
            this.list();
            swal.fire('Éxito!', 'Familia eliminada exitosamente!', 'success');
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
    let worksheet = workbook.addWorksheet('Tipos de Consumo');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Tipos de Consumos']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Id', 'Descripción', 'Empresa']);
    worksheet.columns = [{ width: 20 }, { width: 60 }, { width: 20 },];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.tipoConsumoList.forEach(tipoConsumo => {
       worksheet.addRow([tipoConsumo.id, tipoConsumo.descripcion, empresa]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Familias.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
