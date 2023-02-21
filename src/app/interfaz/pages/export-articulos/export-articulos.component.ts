import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from '../../../shared/services/empresa.service';
import { InterfazProductoService } from '../../services/interfaz-producto.service';

import { Cell, Workbook } from 'exceljs';
import { Familia } from '../../entity/familia';
import { ProductoSap } from '../../entity/producto-sap';
import { SubFamilia1 } from '../../entity/sub-familia1';
import { SubFamilia2 } from '../../entity/sub-familia2';
import { SubFamilia3 } from '../../entity/sub-familia3';
import { SubFamilia4 } from '../../entity/sub-familia4';
import { TipoConsumo } from '../../entity/tipo-consumo';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-export-articulos',
  templateUrl: './export-articulos.component.html',
  styleUrls: ['./export-articulos.component.css']
})
export class ExportArticulosComponent implements OnInit {

  private articulos: ProductoSap[] = [];

  public url!: string;

  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private interfazProductoService: InterfazProductoService) { 
    this.url = environment.urlInterfazProducto;
  }

  ngOnInit(): void {
  }

  exportList(): void {
    this.spinner.show();
    this.interfazProductoService.exportArticuloSap().subscribe(
      articulos => {
        this.articulos = articulos;
        this.enviarExcel();
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al exportar el maestro de artículos', 'error');
      }
    )
  }

  private enviarExcel(): void {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;
    const idempresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Artículos');

    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Artículos - ' + empresa ]);
    worksheet.addRow(['']);

    if (idempresa === 8) {
      worksheet.mergeCells('A2:Q2');
    } else {
      worksheet.mergeCells('A2:O2');
    }   
    
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    if (idempresa === 8) {
      worksheet.addRow(['Cod.Pixel', 'Descripción', 'Cod.Sap', 'Id Tipo Consumo', 'Tipo Consumo', 'Id Familia', 'Familia', 'Id SubFamilia 1',
                      'SubFamilia 1', 'Id SubFamilia 2', 'SubFamilia 2', 'Id SubFamilia 3', 'SubFamilia 3', 'Id SubFamilia 4', 'SubFamilia 4',
                      'Cant.Clásicas', 'Cant.Premium']);
    } else {
      worksheet.addRow(['Cod.Pixel', 'Descripción', 'Cod.Sap', 'Id Tipo Consumo', 'Tipo Consumo', 'Id Familia', 'Familia', 'Id SubFamilia 1',
                        'SubFamilia 1', 'Id SubFamilia 2', 'SubFamilia 2', 'Id SubFamilia 3', 'SubFamilia 3', 'Id SubFamilia 4', 'SubFamilia 4']);
    }

    worksheet.columns = [{ width: 20 }, { width: 60 }, { width: 20 },];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.articulos.forEach(articulo => {
      if (articulo.tipoConsumo === undefined || articulo.tipoConsumo === null) {
        articulo.tipoConsumo = new TipoConsumo();
        articulo.tipoConsumo.id = 0;
        articulo.tipoConsumo.descripcion = ' ';
      } 

      if (articulo.familia === undefined || articulo.familia === null) {
        articulo.familia = new Familia();
        articulo.familia.id = 0;
        articulo.familia.descripcion = ' ';
      }

      if (articulo.subFamilia1 === undefined || articulo.subFamilia1 === null) {
        articulo.subFamilia1 = new SubFamilia1();
        articulo.subFamilia1.id = 0;
        articulo.subFamilia1.descripcion = ' ';
      }

      if (articulo.subFamilia2 === undefined || articulo.subFamilia2 === null) {
        articulo.subFamilia2 = new SubFamilia2();
        articulo.subFamilia2.id = 0;
        articulo.subFamilia2.descripcion = ' ';
      }

      if (articulo.subFamilia3 === undefined || articulo.subFamilia3 === null) {
        articulo.subFamilia3 = new SubFamilia3();
        articulo.subFamilia3.id = 0;
        articulo.subFamilia3.descripcion = ' ';
      }

      if (articulo.subFamilia4 === undefined || articulo.subFamilia4 === null) {
        articulo.subFamilia4 = new SubFamilia4();
        articulo.subFamilia4.id = 0;
        articulo.subFamilia4.descripcion = ' ';
      }

      console.log(idempresa);

      if (idempresa === 8) {
        worksheet.addRow([articulo.coPixel, articulo.descripcionArticulo, articulo.coSap, (articulo.tipoConsumo.id === 0 ? ' ' : articulo.tipoConsumo.id), 
                        articulo.tipoConsumo.descripcion, (articulo.familia.id === 0 ? ' ' : articulo.familia.id), articulo.familia.descripcion, 
                        (articulo.subFamilia1.id === 0 ? ' ' : articulo.subFamilia1.id), articulo.subFamilia1.descripcion,
                        (articulo.subFamilia2.id === 0 ? ' ' : articulo.subFamilia2.id), articulo.subFamilia2.descripcion, 
                        (articulo.subFamilia3.id === 0 ? ' ' : articulo.subFamilia3.id), articulo.subFamilia3.descripcion,
                        (articulo.subFamilia4.id === 0 ? ' ' : articulo.subFamilia4.id), articulo.subFamilia4.descripcion, 
                        (articulo.clasica === undefined ? ' ' : articulo.clasica), (articulo.premium === undefined ? ' ' : articulo.premium)]);
      } else {        
        worksheet.addRow([articulo.coPixel, articulo.descripcionArticulo, articulo.coSap, (articulo.tipoConsumo.id === 0 ? ' ' : articulo.tipoConsumo.id), 
                        articulo.tipoConsumo.descripcion, (articulo.familia.id === 0 ? ' ' : articulo.familia.id), articulo.familia.descripcion, 
                        (articulo.subFamilia1.id === 0 ? ' ' : articulo.subFamilia1.id), articulo.subFamilia1.descripcion,
                        (articulo.subFamilia2.id === 0 ? ' ' : articulo.subFamilia2.id), articulo.subFamilia2.descripcion, 
                        (articulo.subFamilia3.id === 0 ? ' ' : articulo.subFamilia3.id), articulo.subFamilia3.descripcion,
                        (articulo.subFamilia4.id === 0 ? ' ' : articulo.subFamilia4.id), articulo.subFamilia4.descripcion]);
      }

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Articulos.xlsx');
    });
  }

  public downloadFile(): void {
    this.spinner.show();
    this.interfazProductoService.generateFile().subscribe(
      rpta => {
        this.spinner.hide();
        let archivo: String = rpta.mensaje;
        window.location.href = this.url + '/api/interfaz-articulo/articulo/masivo/download/' + archivo;
      }, 
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );
  }

}
