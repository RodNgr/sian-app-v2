import { Component, HostListener, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { AplicacionService } from '../../services/aplicacion.service';
import { UsuarioService } from '../../services/usuario.service';

import { Aplicacion } from '../../entity/aplicacion';
import { Cell, Workbook } from 'exceljs';
import { Usuario } from '../../../shared/entity/usuario';

import swal from 'sweetalert2';
import * as fs from 'file-saver';

@Component({
  selector: 'app-consulta-usuarios-aplicacion',
  templateUrl: './consulta-usuarios-aplicacion.component.html',
  styleUrls: ['./consulta-usuarios-aplicacion.component.css']
})
export class ConsultaUsuariosAplicacionComponent implements OnInit {

  public usuarioList: Usuario[] = [];

  public aplicacionList: Aplicacion[] = [];

  public aplicacionSelected!: Aplicacion;

  public cantidadMap = {
    '=0': 'No existen usuarios',
    '=1': 'En total hay 1 usuario',
    'other': 'En total hay # usuarios'
  }

  public isMobile: boolean = window.innerWidth < 641;

  constructor(private spinner: NgxSpinnerService,
              private aplicacionService: AplicacionService,
              private usuarioService: UsuarioService) { }

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
    );
  }

  buscar(): void {
    if (!this.aplicacionSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar una aplicación', 'warning');
    }

    console.log(this.aplicacionSelected);
    this.spinner.show();
    this.usuarioService.getUsuariosPorAplicacion(this.aplicacionSelected.id).subscribe(
      usuarioList => {
        this.usuarioList = usuarioList;
        console.log(this.usuarioList);
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
    if (!this.aplicacionSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar una Aplicación', 'warning');
      return;
    }

    if (this.usuarioList.length === 0) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Usuarios por Aplicación');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Usuarios de la Aplicación ' + this.aplicacionSelected.name]);
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
      fs.saveAs(blob, 'Usuarios por Aplicación.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.isMobile = window.innerWidth < 641;
  }

}
