import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from '../../../shared/services/empresa.service';
import { ProcesoService } from '../../services/proceso.service';

import { DatePipe } from '@angular/common';

import { EstadoProcesoPipe } from '../../pipes/estado-proceso.pipe';

import { Cell, Workbook } from 'exceljs';
import { Empresa } from '../../../shared/entity/empresa';
import { Proceso } from '../../entity/proceso';
import { Table } from 'primeng/table';

import { DetalleProcesoComponent } from '../../components/detalle-proceso/detalle-proceso.component';

import swal from 'sweetalert2';

import { environment } from 'src/environments/environment';

import * as fs from 'file-saver';

interface Estado {
  codigo: string,
  descripcion: string
}

@Component({
  selector: 'app-lista-cuadratura-peya',
  templateUrl: './lista-cuadratura-peya.component.html',
  styleUrls: ['./lista-cuadratura-peya.component.css']
})
export class ListaCuadraturaPeyaComponent implements OnInit {
  public procesoList: Proceso[] = [];

  public procesoSelected!: Proceso;

  public marcas: Empresa[] = [];

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

  private type: number = 4;

  private ref!: DynamicDialogRef;

  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private dialogService: DialogService,
              private procesoService: ProcesoService,
              private empresaService: EmpresaService) { }

  ngOnInit(): void {
    const feInicio = new Date();
    const feFin = new Date();

    feInicio.setDate(1);

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.buscar();
    this.marcas = this.empresaService.getEmpresas();

    this.estados = [
      {codigo: 'P', descripcion: 'Pendiente'},
      {codigo: 'X', descripcion: 'En Proceso'},
      {codigo: 'F', descripcion: 'Finalizado'},
    ]
  }

  public newProceso(): void {
    if (this.type === 4) {
      this.router.navigateByUrl('/home/cuadratura/pedidos-peya')
    }
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
    let worksheet = workbook.addWorksheet('Proceso Cuadratura PEYA');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Procesos de Cuadratura PEYA']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:H2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Id', 'Marca', 'Descripción', 'F.Inicio', 'F.Fin', 'F.Creación', 'Resultado', 'Estado']);
    worksheet.columns = [{ width: 5 }, { width: 16 }, { width: 40 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 10 }, { width: 20 }];
    
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

      worksheet.addRow([proceso.idProceso, proceso.marca, proceso.deProceso, feInicio, feFin, feCreacion, resultado, estado]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Proceso_Cuadratura_peya.xlsx');
    });
  }

  public buscar(): void {
    const desde = this.pipe.transform(this.rangeDates[0], "yyyyMMdd") || '';
    const hasta = this.pipe.transform(this.rangeDates[1], "yyyyMMdd") || '';

    this.spinner.show();

    this.procesoService.findProcesos(this.type, desde, hasta).subscribe(
      procesoList => {
        this.procesoList = procesoList;

        this.procesoList.forEach(p => {
          p.marca = this.empresaService.getEmpresa(p.idEmpresa).nombre;
        })

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener los procesos', 'error');
      }
    );
  }

  filterEmpresa(event: Empresa, dt: Table) {
    if (event === undefined || event === null) {
      dt.filter(null, 'idEmpresa', 'equals');
    } else {
      dt.filter(event.idEmpresa, 'idEmpresa', 'equals');
    }
  }

  filterEstado(event: Estado, dt: Table) {
    if (event === undefined || event === null) {
      dt.filter(null, 'esProceso', 'equals');
    } else {
      dt.filter(event.codigo, 'esProceso', 'equals');
    }
  }

  public verInforme(): void {
    if (!this.procesoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un proceso', 'warning');
      return;
    } else if (this.procesoSelected.esProceso !== 'F') {
      swal.fire('Alerta!', 'Sólo se puede ver el resultado en los procesos finalizados', 'warning');
      return;
    } 

    window.location.href = environment.urlCuadratura + '/api/cuadratura/download/result/' + this.procesoSelected.noInforme;
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
