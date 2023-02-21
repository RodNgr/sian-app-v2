import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmpresaService } from '../../../shared/services/empresa.service';
import { InterfazStatusService } from '../../services/interfaz-status.service';
import { TiendaService } from '../../services/tienda.service';

import { DatePipe } from '@angular/common';

import { Cell, Workbook } from 'exceljs';
import { FiltroDto } from '../../dto/filtro-dto';
import { InterfazStatus } from '../../entity/interfaz-status';
import { ResultadoDto } from '../../dto/resultado-dto';
import { Tienda } from '../../entity/tienda';

import swal from 'sweetalert2';

import * as fs from 'file-saver';
import * as moment from 'moment';
import { AuthService } from '../../../auth/services/auth.service';


import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResumenInterfacesDetallesComponent } from '../resumen-interfaces-detalles/resumen-interfaces-detalles.component';

@Component({
  selector: 'app-resumen-interfaces',
  templateUrl: './resumen-interfaces.component.html',
  styleUrls: ['./resumen-interfaces.component.css']
})
export class ResumenInterfacesComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public rangeDates: Date[] = [];

  public statusList: InterfazStatus[] = [];

  public resultadoDto: ResultadoDto = new ResultadoDto();

  private pipe = new DatePipe("en-US");

  private ref!: DynamicDialogRef;
  
  constructor(private empresaService: EmpresaService,
              private authService: AuthService,
              private spinner: NgxSpinnerService,
              private tiendaService: TiendaService,
              private interfazStatusService: InterfazStatusService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
    const dateMnsFive = moment(new Date()).subtract(1 , 'day');

    this.rangeDates[0] = new Date(dateMnsFive.toISOString());
    this.rangeDates[1] = new Date(dateMnsFive.toISOString());

    this.spinner.show();
    this.tiendaService.getTiendasPorEmpresa(this.empresaService.getEmpresaSeleccionada().idEmpresa, this.authService.getUsuarioInterface()).subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;

        if (this.tiendaList.length === 1) {
          this.tiendasSeleccionadas[0] = this.tiendaList[0];
        }

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

    this.spinner.show();
    this.interfazStatusService.getResumen(filtro).subscribe(
      dto => {
        this.resultadoDto = dto;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información', 'error');
      }
    );
  }

  public exportList(): void {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Resumen de Interfaces');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Resumen Ejecución Interfaces - Empresa: ' + empresa]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:I2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.getRow(4).getCell(1).value = 'Tienda';
    worksheet.mergeCells('A4:A5');
    
    let contador: number = 2
    this.resultadoDto.parentColumnNames.forEach(p => {
      worksheet.getRow(4).getCell(contador).value = p;
      worksheet.mergeCells(4, contador, 4, contador + 3);
      contador = contador + 4;
    });

    contador = 2;
    this.resultadoDto.childColumnNames.forEach(p => {
      worksheet.getRow(5).getCell(contador).value = p.name;
      contador++;
    });

    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    contador = 6;
    this.resultadoDto.valores.forEach(v => {
      worksheet.getRow(contador).getCell(1).value = v.data['nombre'];

      let col = 2;
      this.resultadoDto.childColumnNames.forEach(p => {
        worksheet.getRow(contador).getCell(col).value = v.data[p.busqueda];
        col++;
      });

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      contador++;
    });
    
    contador = 1;
    worksheet.columns.forEach(c => {
      if (contador === 1) {
        c.width = 25;
      } else {
        c.width = 7;
      }
      
      contador ++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Resumen Interfaces.xlsx');
    });
  }

  public changeFecIni(): void {
    if(this.rangeDates[0] > this.rangeDates[1]){
      this.rangeDates[1]=this.rangeDates[0];
    }
  }

  public changeFecFin(): void {
    if(this.rangeDates[1] < this.rangeDates[0]){
      this.rangeDates[0]=this.rangeDates[1];
    }
  }

  //Juan Ramos - getDetallesInterface

  public getDetallesInterface(resultadoDto : any, busqueda: any): void {
    //console.log(">> informacionValores", resultadoDto.informacionValores);
    if(resultadoDto.informacionValores.length > 0 || resultadoDto.informacionValores){
      //console.log(">> informacionValores.data", resultadoDto.informacionValores[0].data);
      //console.log(">> busqueda", busqueda);

      if(resultadoDto.informacionValores[0].data[busqueda]){
        let dto: any = resultadoDto.informacionValores[0].data[busqueda];
        //console.log(">> informacionValores.data[busqueda]", dto);

        this.ref = this.dialogService.open(ResumenInterfacesDetallesComponent, {
          header: 'Detalles de la interfaz',
          width: '70%', 
          contentStyle: {"max-height": "500px", "overflow": "auto"},
          baseZIndex: 10000,
          data: dto
        });

      }
      
    }

    
  }
}
