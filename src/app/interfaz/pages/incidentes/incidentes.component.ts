import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { InterfazStatus } from '../../entity/interfaz-status';
import { InterfazStatusService } from '../../services/interfaz-status.service';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Cell, Workbook } from 'exceljs';

import * as fs from 'file-saver';
import * as moment from 'moment';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VerIncidenteComponent } from '../../components/ver-incidente/ver-incidente.component';
import { AsumirIncidenteComponent } from '../../components/asumir-incidente/asumir-incidente.component';

interface Filtro {
  codigo: string,
  descripcion: string
}

@Component({
  selector: 'app-incidentes',
  templateUrl: './incidentes.component.html',
  styleUrls: ['./incidentes.component.css']
})
export class IncidentesComponent implements OnInit, OnDestroy {

  public incidenteList: InterfazStatus[] = [];

  public incidenteSelected!: InterfazStatus;

  public rangeDates: Date[] = [];

  private pipe = new DatePipe("en-US");

  public tipoList: Filtro[] = [{codigo: 'TODOS', descripcion: 'Todos'}, {codigo: 'COB', descripcion: 'Cobranza'}, {codigo: 'CON', descripcion: 'Consumo'}, {codigo: 'MIX', descripcion: 'Mix Venta'}, {codigo: 'VTA', descripcion: 'Venta'}]

  public estadoList: Filtro[] = [{codigo: 'TODOS', descripcion: 'Todos'}, {codigo: 'C', descripcion: 'Cerrada'}, {codigo: 'P', descripcion: 'Pendiente'}, {codigo: 'E', descripcion: 'Error'}, {codigo: 'X', descripcion: 'Asumida'}]

  public tipoSelected: Filtro = {codigo: 'TODOS', descripcion: 'Todos'};

  public estadoSelected: Filtro = {codigo: 'TODOS', descripcion: 'Todos'};

  public cantidadMap = {
    '=0': 'No existen incidentes',
    '=1': 'En total hay 1 incidente',
    'other': 'En total hay # incidentes'
  }

  public isMobile: boolean = window.innerWidth < 641;

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              private incidenteService: InterfazStatusService,
              private empresaService: EmpresaService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
    const dateMnsFive = moment(new Date()).subtract(1 , 'day');

    this.rangeDates[0] = new Date(dateMnsFive.toISOString());
    this.rangeDates[1] = new Date(dateMnsFive.toISOString());
  }

  public buscar(): void {
    if (!this.rangeDates[0]) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de inicial', 'warning');
      return;
    }

    if (!this.rangeDates[1]) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de final', 'warning');
      return;
    }

    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    const fechaInicio = this.pipe.transform(this.rangeDates[0], 'yyyyMMdd') || '';
    const fechaFin = this.pipe.transform(this.rangeDates[1], 'yyyyMMdd') || '';
    const tipo = this.tipoSelected.codigo;
    const estado = this.estadoSelected.codigo;

    this.spinner.show();
    
    this.incidenteService.getIncidentesInterfaces(idEmpresa, fechaInicio, fechaFin, tipo, estado).subscribe(
      incidenteList => {
        this.incidenteList = incidenteList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las Incidencias', 'error');
      }
    );
  }

  public verDetalle() {
    if (!this.incidenteSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar un Incidente', 'warning');
      return;
    }

    this.ref = this.dialogService.open(VerIncidenteComponent, {
      header: 'Detalle',
      width: '75%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      data: this.incidenteSelected
    });
  }

  public asumir() {
    if (!this.incidenteSelected) {
      swal.fire('Advertencia!', 'Debe seleccionar un Incidente', 'warning');
      return;
    }

    /*
    if (this.incidenteSelected.estatus !== 'E') {
      swal.fire('Advertencia!', 'Sólo puede asumir incidentes con estado de Error', 'warning');
      return;
    }
    */

    this.ref = this.dialogService.open(AsumirIncidenteComponent, {
      header: 'Detalle',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      data: this.incidenteSelected
    });
  }

  public exportList() {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Incidentes');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Incidentes']);
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
    /*
    this.familiaList.forEach(familia => {
    worksheet.addRow([familia.id, familia.descripcion, empresa]);

    worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
    cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
    cell.font = { size: 8,  name: 'Arial' };
    });

    contador++;
    })
    */

    workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Familias.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.destroy();
    }
  }
  
}
