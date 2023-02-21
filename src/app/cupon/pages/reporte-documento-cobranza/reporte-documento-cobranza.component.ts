import { Component, HostListener, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from '../../../shared/services/empresa.service';
import { ValeService } from '../../services/vale.service';

import { DatePipe } from '@angular/common';

import { Cell, Workbook } from 'exceljs';
import { DocumentoCobranza } from '../../dto/documento-cobranza';
import { DocumentoCobranzaDet } from '../../dto/documento-cobranza-det';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

interface Tipo {
  id: string;
  name: string;
}

@Component({
  selector: 'app-reporte-documento-cobranza',
  templateUrl: './reporte-documento-cobranza.component.html',
  styleUrls: ['./reporte-documento-cobranza.component.css']
})
export class ReporteDocumentoCobranzaComponent implements OnInit {

  public cabeceraList: DocumentoCobranza[] = [];

  public detalleList: DocumentoCobranzaDet[] = [];

  public selectedDocumento!: DocumentoCobranza;

  public tipos: Tipo[] = [{id: "1", name: 'Fecha Emisión D.C.'}, {id: "2", name: 'Fecha Venc. Vale'}];

  public selectedTipo: Tipo = this.tipos[0];

  public rangeDates: Date[] = [];

  public idEmpresa!: string;

  public isMobile: boolean = window.innerWidth < 641

  private pipe = new DatePipe("en-US");
  
  constructor(public spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private valeService: ValeService) { }

  ngOnInit(): void {
    const feInicio = new Date();
    const feFin = new Date();

    feInicio.setDate(1);

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.idEmpresa = this.empresaService.getEmpresaSeleccionada().codSap;
  }

  public exportXLS(): void {

  }

  public buscar(): void {
    this.spinner.show();

    const inicio: string = this.pipe.transform(this.rangeDates[0], 'yyyyMMdd') || '';
    const fin: string = this.pipe.transform(this.rangeDates[1], 'yyyyMMdd') || '';
    const serie: string = '0' + this.empresaService.getEmpresaSeleccionada().codSap;

    this.valeService.getReporteDocumentoCobranza(inicio, fin, serie, this.selectedTipo.id).subscribe(
      documentoList =>  {
        this.cabeceraList = documentoList;
        this.detalleList = [];
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );
  }

  onRowSelect() {
    this.spinner.show()
    this.valeService.getReporteDocumentoCobranzaDet(this.selectedDocumento.id).subscribe(
      detalleList => {
        this.detalleList = detalleList;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );
  }

  onRowUnselect() {
      this.detalleList = [];
  }

  public exportarResumen(): void {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['RESUMEN DE VALES CORPORATIVOS']);
    worksheet.mergeCells('A2:L2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Subtítulo del archivo
    worksheet.addRow(['Empresa: ' + empresa + 'Fecha: ' + this.pipe.transform(this.rangeDates[0], 'dd/MM/yyyy') + ' - ' + this.pipe.transform(this.rangeDates[1], 'dd/MM/yyyy')]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A3:L3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };

    // Título de la tabla
    worksheet.addRow(["UNI", "Emisión", "R.U.C.", "Nombre", "Doc. Cobranza", "Inicio", "Fin", "C. Vendido", "C. Usado", "Monto D.C.", "Monto Usado", "Registrado"]);
    worksheet.columns = [{ width: 10 }, { width: 10 }, { width: 10 }, { width: 40 }, { width: 15 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 12 }, { width: 12 }, { width: 10 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 6
    this.cabeceraList.forEach(cab => {
       worksheet.addRow([this.idEmpresa, cab.feEmision, cab.ruc, cab.razonSocial, cab.serie + '-' + cab.correlativo, cab.feInicio, 
                         cab.feFin, cab.cantidad, cab.caUsado, cab.vaMontoTotal, cab.vaUsado, cab.feRegistro]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
        
        // if (colNumber === 1 || colNumber === 2  || colNumber === 5 || colNumber === 12) {
        //   cell.alignment = { vertical: 'middle', horizontal: 'center' };
        // }
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Reporte_Vales_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });
  }

  public exportarDetalle(): void {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['DETALLE DE VALES CORPORATIVOS - DOCUMENTO: ' + this.selectedDocumento.serie + '-' + this.selectedDocumento.correlativo]);
    worksheet.mergeCells('A2:H2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Subtítulo del archivo
    worksheet.addRow(['Empresa: ' + empresa + 'Fecha: ' + this.pipe.transform(this.rangeDates[0], 'dd/MM/yyyy') + ' - ' + this.pipe.transform(this.rangeDates[1], 'dd/MM/yyyy')]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A3:H3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };

    // Título de la tabla
    worksheet.addRow(["Inicio", "Fin", "Vale", "P. Unitario", "Tienda SAP", "Nombre Tienda", "Usado", "Cajero"]);
    worksheet.columns = [{ width: 10 }, { width: 10 }, { width: 20 }, { width: 10 }, { width: 13 }, { width: 30 }, { width: 10 }, { width: 30 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 6
    this.detalleList.forEach(det => {
       worksheet.addRow([det.feInicio, det.feFin, det.codBarra, det.vaUnitarioVale, det.tiendaSap, det.nombreTienda, det.feUso, det.cajero]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
        
        // if (colNumber === 1 || colNumber === 2  || colNumber === 5 || colNumber === 12) {
        //   cell.alignment = { vertical: 'middle', horizontal: 'center' };
        // }
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Detalle_Vales_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });

  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
