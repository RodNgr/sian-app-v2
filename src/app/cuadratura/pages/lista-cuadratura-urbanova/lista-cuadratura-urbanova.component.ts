import { Component, HostListener, OnInit } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { ProcesoService } from '../../services/proceso.service';

import { DetalleProcesoComponent } from '../../components/detalle-proceso/detalle-proceso.component';

import { DatePipe } from '@angular/common';

import { EstadoProcesoPipe } from '../../pipes/estado-proceso.pipe';

import { Cell, Workbook } from 'exceljs';
import { Proceso } from '../../entity/proceso';
import { Table } from 'primeng/table';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

interface Estado {
  codigo: string,
  descripcion: string
}

@Component({
  selector: 'app-lista-cuadratura-urbanova',
  templateUrl: './lista-cuadratura-urbanova.component.html',
  styleUrls: ['./lista-cuadratura-urbanova.component.css']
})
export class ListaCuadraturaUrbanovaComponent implements OnInit {

  public procesoList: Proceso[] = [];

  public procesoSelected!: Proceso;

  public estados: any[] = [];

  public rangeDates: Date[] = [];

  public cantidadMap = {
    '=0': 'No existen procesos',
    '=1': 'En total hay 1 proceso',
    'other': 'En total hay # procesos'
  }

  public isMobile: boolean = window.innerWidth < 641

  private pipe = new DatePipe("en-US");

  private estadoPipe = new EstadoProcesoPipe();

  private type: number = 3;

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private dialogService: DialogService,
              private procesoService: ProcesoService) { }

  ngOnInit(): void {
    const feInicio = new Date();
    const feFin = new Date();

    feInicio.setDate(1);

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.buscar();

    this.estados = [
      {codigo: 'P', descripcion: 'Pendiente'},
      {codigo: 'X', descripcion: 'En Proceso'},
      {codigo: 'F', descripcion: 'Finalizado'},
    ]
  }

  public reprocesar(): void {
    if (!this.procesoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un proceso', 'warning');
      return;
    } 

    this.spinner.show();
    this.procesoService.reprocesar(this.procesoSelected).subscribe(
      _response => {
        this.buscar();
        swal.fire('Éxito!', 'El proceso se ha puesto en Pendiente para su Reproceso', 'success');
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al realizar el reproceso', 'error');
      }
    );
  }

  public verDetalle(): void {
    if (!this.procesoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un proceso', 'warning');
      return;
    } 

    this.ref = this.dialogService.open(DetalleProcesoComponent, {
      header: 'Ver Detalle',
      width: '75%',
      contentStyle: {"overflow": "auto"},
      data: this.procesoSelected
    });
  }

  public exportXLS(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Proceso Envío Información Urbanova');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Procesos Envío Información Urbanova']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:G2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Id', 'Descripción', 'F.Inicio', 'F.Fin', 'F.Creación', 'Resultado', 'Estado']);
    worksheet.columns = [{ width: 5 }, { width: 40 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 10 }, { width: 20 }];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.procesoList.forEach(proceso => {
      let estado = this.estadoPipe.transform(proceso.esProceso);
      let feInicio = this.pipe.transform(proceso.feInicioPeriodo, 'dd/MM/yyyy');
      let feFin = this.pipe.transform(proceso.feFinPeriodo, 'dd/MM/yyyy');
      let feCreacion = this.pipe.transform(proceso.feFinPeriodo, 'dd/MM/yyyy HH:mm:ss');
      let resultado = proceso.inResultado ? 'Ok': 'Error';

      worksheet.addRow([proceso.idProceso, proceso.deProceso, feInicio, feFin, feCreacion, resultado, estado]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Proceso_Informacion_Urbanova.xlsx');
    });
  }

  public buscar(): void {
    const desde = this.pipe.transform(this.rangeDates[0], "yyyyMMdd") || '';
    const hasta = this.pipe.transform(this.rangeDates[1], "yyyyMMdd") || '';

    this.spinner.show();

    this.procesoService.findProcesos(this.type, desde, hasta).subscribe(
      procesoList => {
        this.procesoList = procesoList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener los procesos', 'error');
      }
    );
  }

  filterEstado(event: Estado, dt: Table) {
    if (event === undefined || event === null) {
      dt.filter(null, 'esProceso', 'equals');
    } else {
      dt.filter(event.codigo, 'esProceso', 'equals');
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.destroy();
    }
  }

}
