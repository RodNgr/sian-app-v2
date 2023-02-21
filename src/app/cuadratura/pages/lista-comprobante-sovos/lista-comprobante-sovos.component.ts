import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { ComprobanteService } from '../../services/comprobante.service';
import { EmpresaService } from '../../../shared/services/empresa.service';

import { Cell, Workbook } from 'exceljs';
import { ComprobanteSovos } from '../../entity/comprobante-sovos';
import { Empresa } from '../../../shared/entity/empresa';

import { EstadoCuadraturaPipe } from '../../pipes/estado-cuadratura.pipe';
import { EstadoSunatPipe } from '../../pipes/estado-sunat.pipe';
import { TipoComprobantePipe } from '../../pipes/tipo-comprobante.pipe';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

interface Tipo {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-lista-comprobante-sovos',
  templateUrl: './lista-comprobante-sovos.component.html',
  styleUrls: ['./lista-comprobante-sovos.component.css']
})
export class ListaComprobanteSovosComponent implements OnInit {

  public comprobanteList: ComprobanteSovos[] = [];

  public ruc!: string;

  public empresaSeleccionada!: Empresa;

  public rangeDates: Date[] = [];

  public cantidadMap = {
    '=0': 'No existen comprobantes',
    '=1': 'En total hay 1 comprobante',
    'other': 'En total hay # comprobantes'
  }

  public estadoList: Tipo[] = [{codigo: 'C', descripcion: 'Cuadrado'}, {codigo: 'S', descripcion: 'Sobrante'}];
  public sunatList: Tipo[] = [{codigo: '2', descripcion: 'Aceptado'}, {codigo: '3', descripcion: 'Rechazado'}, {codigo: '4', descripcion: 'Reparado'}];
  public tipoComprobanteList: Tipo[] = [{codigo: '01', descripcion: 'Factura'}, {codigo: '03', descripcion: 'Boleta'}, {codigo: '07', descripcion: 'Nota de Crédito'}];

  public estadoSeleccionado!: Tipo;
  public sunatSeleccionado!: Tipo;
  public tipoComprobanteSeleccionado!: Tipo;

  private pipe = new DatePipe("en-US");
  private tipoPipe = new TipoComprobantePipe();
  private estadoPipe = new EstadoCuadraturaPipe();
  private sunatPipe = new EstadoSunatPipe();

  public isMobile: boolean = window.innerWidth < 641
  
  constructor(private empresaService: EmpresaService,
              private comprobanteService: ComprobanteService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('ruc-sovos')) {
      swal.fire('Advertencia!', 'No ha seleccionado la empresa', 'warning');
      return;
    }

    this.ruc = sessionStorage.getItem('ruc-sovos') || '';

    this.empresaService.getEmpresas().forEach(empresa => {
      if (empresa.ruc === this.ruc) {
        this.empresaSeleccionada = empresa;
      }
    });

    this.rangeDates[0] = new Date();
    this.rangeDates[1] = new Date();
  }

  public buscar() {
    if (this.rangeDates[0] === undefined || this.rangeDates[0] === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de inicio', 'warning');
      return;
    }

    if (this.rangeDates[1] === undefined || this.rangeDates[1] === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de fin', 'warning');
      return;
    }

    let fechaInicio: string = this.pipe.transform(this.rangeDates[0], 'yyyyMMdd') || '';
    let fechaFin: string = this.pipe.transform(this.rangeDates[1], 'yyyyMMdd') || '';
    let tipoComprobante: string;
    let estado: string;
    let sunat: string;

    if (this.tipoComprobanteSeleccionado === undefined || this.tipoComprobanteSeleccionado === null) {
      tipoComprobante = 'TODOS';
    } else {
      tipoComprobante = this.tipoComprobanteSeleccionado.codigo;
    }

    if (this.estadoSeleccionado === undefined || this.estadoSeleccionado === null) {
      estado = 'TODOS';
    } else {
      estado = this.estadoSeleccionado.codigo;
    }

    if (this.sunatSeleccionado === undefined || this.sunatSeleccionado === null) {
      sunat = 'TODOS';
    } else {
      sunat = this.sunatSeleccionado.codigo;
    }

    console.log(tipoComprobante);
    console.log(estado);
    console.log(sunat);

    this.spinner.show();
    this.comprobanteService.getComprobantes(this.ruc, fechaInicio, fechaFin, tipoComprobante, estado, sunat).subscribe(
      comprobanteList => {
        console.log(comprobanteList);
        this.comprobanteList = comprobanteList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información', 'error');
      }
    )
  }

  public exportXLS(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Comprobante');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Comprobantes ' + this.empresaSeleccionada.nombre + ' del ' + 
      this.pipe.transform(this.rangeDates[0], 'dd/MM/yyyy') + ' al ' + this.pipe.transform(this.rangeDates[1], 'dd/MM/yyyy')]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:J2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Ruc', 'Marca', 'Fecha', 'Tipo', 'Comprobante', 'Cliente', 'Total', 'Estado', 'Sunat', 'Mensaje']);
    worksheet.columns = [{ width: 10 }, { width: 18 }, { width: 9 }, { width: 16 }, { width: 13 }, { width: 15 }, { width: 10 }, { width: 12 }, { width: 12 }, { width: 75 }];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.comprobanteList.forEach(comprobante => {
      let fecha = this.pipe.transform(comprobante.id.fecha, 'dd/MM/yyyy');
      let tipo = this.tipoPipe.transform(comprobante.id.tipo);
      let estado = this.estadoPipe.transform(comprobante.estado);
      let sunat = this.sunatPipe.transform(comprobante.sunat);

      worksheet.addRow([this.ruc, this.empresaSeleccionada.nombre, fecha, tipo, comprobante.sovos, comprobante.cliente, comprobante.total, estado, sunat, comprobante.mensaje]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Comprobante_' + this.ruc + '.xlsx');
    });
  }
   
}
