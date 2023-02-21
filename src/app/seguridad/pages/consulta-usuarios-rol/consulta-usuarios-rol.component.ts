import { Component, HostListener, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { RolService } from '../../services/rol.service';
import { UsuarioService } from '../../services/usuario.service';

import { Cell, Workbook } from 'exceljs';
import { Rol } from '../../entity/rol';
import { Usuario } from '../../../shared/entity/usuario';

import swal from 'sweetalert2';
import * as fs from 'file-saver';

@Component({
  selector: 'app-consulta-usuarios-rol',
  templateUrl: './consulta-usuarios-rol.component.html',
  styleUrls: ['./consulta-usuarios-rol.component.css']
})
export class ConsultaUsuariosRolComponent implements OnInit {

  public usuarioList: Usuario[] = [];

  public rolList: Rol[] = [];

  public rolSelected!: Rol;

  public cantidadMap = {
    '=0': 'No existen usuarios',
    '=1': 'En total hay 1 usuario',
    'other': 'En total hay # usuarios'
  }

  public isMobile: boolean = window.innerWidth < 641;

  constructor(private spinner: NgxSpinnerService,
              private rolservice: RolService,
              private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.rolservice.getAllRoles().subscribe(
      rolList => {
        this.spinner.hide();
        this.rolList = rolList;
      }, 
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los roles', 'error');
      }
    );
  }

  buscar(): void {
    if (!this.rolSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar un rol', 'warning');
    }

    this.spinner.show();
    this.usuarioService.getUsuariosPorRol(this.rolSelected.id).subscribe(
      usuarioList => {
        this.usuarioList = usuarioList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los usuarios', 'error');
      }
    )
  }

  changeValue(): void {
    this.usuarioList = [];
  }

  public exportList() {
    if (!this.rolSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar un Rol', 'warning');
      return;
    }

    if (this.usuarioList.length === 0) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Usuarios por Rol');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Usuarios del Rol ' + this.rolSelected.name]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Código', 'Apellidos y Nombres', 'Empresa', 'Cargo']);
    worksheet.columns = [{ width: 15 }, { width: 60 }, { width: 30 }, { width: 60 } ];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.usuarioList.forEach(usuario => {
       worksheet.addRow([usuario.codigo, usuario.fullName, usuario.razsoc, usuario.despue]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Usuarios por Rol.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.isMobile = window.innerWidth < 641;
  }

}
