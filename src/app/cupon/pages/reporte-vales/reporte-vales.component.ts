import { Component, HostListener, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { ValeService } from '../../services/vale.service';

import { DatePipe } from '@angular/common';

import { CabValeVerde } from '../../entity/cabValeVerde';
import { Cell, Workbook } from 'exceljs';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

@Component({
  selector: 'app-reporte-vales',
  templateUrl: './reporte-vales.component.html',
  styleUrls: ['./reporte-vales.component.css']
})
export class ReporteValesComponent implements OnInit {

  public cabValeVerdeList: CabValeVerde[] = [];

  public valeSelected: CabValeVerde = new CabValeVerde();

  public rangeDates: Date[] = [];

  public cantidadMap = {
    '=0': 'No existen vales',
    '=1': 'En total hay 1 vale',
    'other': 'En total hay # vales'
  }

  public isMobile: boolean = window.innerWidth < 641

  private pipe = new DatePipe("en-US");

  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private valeService: ValeService) { }

  ngOnInit(): void {
    const feInicio = new Date();
    const feFin = new Date();

    feInicio.setDate(feInicio.getDate() - 1);

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);
  }

  public buscar(): void {
    this.spinner.show();
    const desde = this.pipe.transform(this.rangeDates[0], "yyyyMMdd") || '';
    const hasta = this.pipe.transform(this.rangeDates[1], "yyyyMMdd") || '';

    this.valeService.getReporteConsulta(desde, hasta).subscribe (
      vales => {
        this.cabValeVerdeList = vales;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener los vales de cortesía', 'error');
      }
    )
  }

  public exportXLS(): void {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Consulta de Vales');
 
    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['CONSULTA DE VALES - ' + empresa.toUpperCase()]);
    worksheet.mergeCells('A2:K2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Subtítulo del archivo
    worksheet.addRow(['Fecha: ' + this.pipe.transform(this.rangeDates[0], 'dd/MM/yyyy') + ' - ' + this.pipe.transform(this.rangeDates[1], 'dd/MM/yyyy')]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A3:K3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };

    // Título de la tabla
    worksheet.addRow(["N° Factura",	"RUC",	"Tipo Vale",	"Monto Total",	"Razón Social",	"Contacto",	"Teléfono",	"Cargo",	"E-mail",	"Series",	"Registro" ]);
    worksheet.columns = [{ width: 12 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 40 }, { width: 15}, { width: 15 }, { width: 15 }, { width: 15 }, { width: 35 }, { width: 10 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 6
    this.cabValeVerdeList.forEach(vale => {
       worksheet.addRow([vale.nrofactura, vale.ruc, vale.observacion, vale.montoTotal, vale.razonSocial, vale.nombreContacto, vale.telefonoContacto, 
                         vale.cargoContacto, vale.emailContacto, vale.serie, this.pipe.transform(vale.freg, "dd/MM/yyyy")]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
        
        if (colNumber === 3) {
          cell.alignment = { vertical: 'middle', horizontal: 'right' };
        }
      });
 
       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Consulta_Vales_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
