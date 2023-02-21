import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../../auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { InterfazBloqueoService } from '../../services/interfaz-bloqueo.service';
import { TiendaService } from '../../services/tienda.service';

import { DatePipe } from '@angular/common';

import { Cell, Workbook } from 'exceljs';
import { FiltroDto } from '../../dto/filtro-dto';
import { InterfazBloqueo } from '../../entity/interfaz-bloqueo';
import { Tienda } from '../../entity/tienda';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

@Component({
  selector: 'app-resumen-interfaces-bloqueadas',
  templateUrl: './resumen-interfaces-bloqueadas.component.html',
  styleUrls: ['./resumen-interfaces-bloqueadas.component.css']
})
export class ResumenInterfacesBloqueadasComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public rangeDates: Date[] = [];

  public bloqueoList: InterfazBloqueo[] = [];

  public selectedBloqueos: InterfazBloqueo[] = [];

  private pipe = new DatePipe("en-US");
  
  constructor(private empresaService: EmpresaService,
              private spinner: NgxSpinnerService,
              private tiendaService: TiendaService,
              private authService: AuthService,
              private interfazBloqueoService: InterfazBloqueoService) { }

  ngOnInit(): void {
    this.rangeDates[0] = new Date();
    this.rangeDates[1] = new Date();

    this.rangeDates[0].setDate(1);

    this.spinner.show();
    this.tiendaService.getTiendas(this.empresaService.getEmpresaSeleccionada().idEmpresa).subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
      }
    )
  }

  public buscar(): void {
    if (this.tiendasSeleccionadas.length === 0) {
      swal.fire('Advertencia!', 'Por lo menos debe seleccionar una tienda', 'warning');
      return;
    }

    if (!this.rangeDates[0]) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de inicial', 'warning');
      return;
    }

    if (!this.rangeDates[1]) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de final', 'warning');
      return;
    }

    let filtro: FiltroDto = new FiltroDto();
    filtro.idEmpresa = Number(this.empresaService.getEmpresaSeleccionada().codSap);
    filtro.tiendas = this.tiendasSeleccionadas;
    filtro.fechaInicio = this.pipe.transform(this.rangeDates[0], 'yyyyMMdd') || '';
    filtro.fechaFin = this.pipe.transform(this.rangeDates[1], 'yyyyMMdd') || '';

    this.selectedBloqueos = [];

    this.spinner.show();
    this.interfazBloqueoService.getResumen(filtro).subscribe(
      bloqueoList => {
        this.bloqueoList = bloqueoList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información', 'error');
      }
    );
  }

  public liberar(): void {
    if (!this.selectedBloqueos) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos un registro', 'warning');
      return;
    }

    if (this.selectedBloqueos.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos un registro', 'warning');
      return;
    }

    let filtro: FiltroDto = new FiltroDto();
    filtro.usuario = this.authService.usuario.username;
    filtro.cierreList = [];
    this.selectedBloqueos.forEach(b => {
      filtro.cierreList.push(b.idCierre)
    });

    this.spinner.show();
    this.interfazBloqueoService.liberar(filtro).subscribe(
      _response => {
        swal.fire('Éxito', 'Interfaces desbloqueadas exitosamente', 'success');
        this.buscar();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al desbloquear las interfaces', 'error');
      }
    );
  }

  public exportList(): void {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Interfaz Bloqueada');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Interfaces Bloqueadas - Empresa: ' + empresa]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Tienda', 'Nombre', 'Fecha', 'Tipo']);
    worksheet.columns = [{ width: 20 }, { width: 60 }, { width: 20 }, { width: 20 }];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.bloqueoList.forEach(bloqueo => {
       worksheet.addRow([bloqueo.idTienda, bloqueo.nombreTienda, this.pipe.transform(bloqueo.fecha, 'dd/MM/yyyy'), bloqueo.tipo ]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Interfaz Bloqueo.xlsx');
    });
  }
  
}
