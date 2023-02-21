import { Component, HostListener, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { AplicacionService } from '../../services/aplicacion.service';
import { AplicacionRolService } from '../../services/aplicacion-rol.service';

import { Aplicacion } from '../../entity/aplicacion';
import { AplicacionRol } from 'src/app/seguridad/entity/aplicacion-rol';
import { Cell, Workbook } from 'exceljs';

import swal from 'sweetalert2';
import * as fs from 'file-saver';

@Component({
  selector: 'app-consulta-roles-aplicacion',
  templateUrl: './consulta-roles-aplicacion.component.html',
  styleUrls: ['./consulta-roles-aplicacion.component.css']
})
export class ConsultaRolesAplicacionComponent implements OnInit {

  public rolList: AplicacionRol[] = [];

  public aplicacionList: Aplicacion[] = [];

  public aplicacionSelected!: Aplicacion;

  public cantidadMap = {
    '=0': 'No existen roles',
    '=1': 'En total hay 1 rol',
    'other': 'En total hay # roles'
  }

  public isMobile: boolean = window.innerWidth < 641;

  constructor(private spinner: NgxSpinnerService,
              private aplicacionService: AplicacionService,
              private aplicacionRolService: AplicacionRolService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.aplicacionService.getAllAplicaciones().subscribe(
      aplicacionList => {
        this.spinner.hide();
        this.aplicacionList = aplicacionList;
      }, 
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las aplicaciones', 'error');
      }
    )
  }

  buscar(): void {
    if (!this.aplicacionSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar una aplicación', 'warning');
    }

    this.spinner.show();
    this.aplicacionRolService.getRolesPorAplicacion(this.aplicacionSelected.id).subscribe(
      aplicacionRol => {
        this.rolList = aplicacionRol;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los roles', 'error');
      }
    )
  }

  changeValue(): void {
    this.rolList = [];
  }

  public exportList() {
    if (!this.aplicacionSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar una Aplicación', 'warning');
      return;
    }

    if (this.rolList.length === 0) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Roles por Aplicación');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Roles de la Aplicación ' + this.aplicacionSelected.name]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Id', 'Descripción', 'Rol Padre']);
    worksheet.columns = [{ width: 20 }, { width: 60 }, { width: 20 }];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.rolList.forEach(rol => {
      worksheet.addRow([rol.rol.id, rol.rol.name, rol.rol.idPadre]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Roles por Aplicación.xlsx');
    });
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
