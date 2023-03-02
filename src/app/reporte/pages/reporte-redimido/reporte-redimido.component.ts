import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TiendaDto } from '../../dto/tienda-dto';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { ParamDto } from '../../dto/param-dto';
import { ReporteRedimidodto } from '../../dto/reporte-redimido-dto';
import { CmrAgrupadoTiendaDto } from '../../dto/cmr-agrupado-tienda-dto';
import { CmrAgrupadoMesDto } from '../../dto/cmr-agrupado-mes-dto';
import { TreeNode } from 'primeng/api';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { EmpresaService } from '../../../shared/services/empresa.service';

interface Tipo {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-reporte-redimido',
  templateUrl: './reporte-redimido.component.html',
  styleUrls: ['./reporte-redimido.component.css']
})
export class ReporteRedimidoComponent implements OnInit {

  public tiendaList: Tienda[] = [];
  public tiendasSeleccionadas: Tienda[] = [];
  public feInicio: Date = new Date();
  public feFin: Date = new Date();
  public tipoVentaList: Tipo[] = [];
  public tipoVentaSeleccionado!: Tipo;
  public detalladoList: ReporteRedimidodto[] = [];
  public agrupadoNode: TreeNode[] = [];
  public agrupadoTiendaList: CmrAgrupadoTiendaDto[] = [];
  public agrupadoMesList: CmrAgrupadoMesDto[] = [];
  public tiendaErrorList: TiendaDto[] = [];
  private pipe = new DatePipe("en-US");

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.loadTipos();

    this.reporteService.getTiendas().subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;
        if (tiendaList.length === 1) {
          this.tiendasSeleccionadas = tiendaList;
        }
        this.spinner.hide();
      }, 
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener las tienda', 'error');
      }
    )
  }

  private loadTipos(): void {
    this.tipoVentaList = [{codigo: '1', descripcion: 'Detallado'}, 
                          {codigo: '2', descripcion: 'Agrupado'}, 
                          {codigo: '3', descripcion: 'Acumulado por Tienda'},
                          {codigo: '5', descripcion: 'Acumulado Total'},
                          {codigo: '4', descripcion: 'Agrupado por Tienda'}];

    this.tipoVentaSeleccionado = {codigo: '1', descripcion: 'Detallado'};
  }

  public onChangeTipo() {
    this.detalladoList = [];
    this.agrupadoNode = [];
    this.agrupadoMesList = [];
    this.agrupadoTiendaList = [];
  }

  public buscar(): void {
    if (!this.valida()) {
      return;
    }

    let dto: ParamDto = new ParamDto();
    dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
    dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
    dto.tiendaList = this.tiendasSeleccionadas;
    this.spinner.show();
    this.reporteService.getReporteRedimido(dto).subscribe(
      response => {
        this.detalladoList = response.lista
        this.tiendaErrorList = response.tienda
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
      }
    );  

  }

  private valida(): boolean {
    /* if (this.tiendasSeleccionadas.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos una tienda', 'warning');
      return false;
    } */
    if (this.feInicio === undefined || this.feInicio === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de inicio', 'warning');
      return false;
    }

    if (this.feFin === undefined || this.feFin === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha de fin', 'warning');
      return false;
    }

    if (this.feInicio > this.feFin) {
      swal.fire('Advertencia!', 'La fecha de fin no puede ser menor a la fecha de inicio', 'warning');
      return false;
    }

    return true;
  }
  

  private getData(tienda: string, tipo: string, documento: string): ReporteRedimidodto[] {
    let data: ReporteRedimidodto[] = [];

   /*  for (let i = 0; i < this.detalladoList.length; i++) {
      if (this.detalladoList[i].tiendaNombre === tienda && this.detalladoList[i].tipo === tipo && this.detalladoList[i].documento === documento) {
        data.push(this.detalladoList[i]);
      }
    } */
    return data;
  }

  public exportar(): void {
    this.exportarDetallado();
  }

  private exportarDetallado(): void {
    if (!this.detalladoList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Redimido');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte Redimidos']);
    //worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.addRow(['Desde: ' + this.pipe.transform(this.feInicio, 'dd/MM/yyyy')+ ' Hasta: '+this.pipe.transform(this.feInicio, 'dd/MM/yyyy') ]);
    worksheet.mergeCells('A2:L2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:L3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['TiendaNombre','TiendaPixel', 'Día de venta', 'Fecha de emisión', 'N° de Pedido', 'Cód. Vale', 'Tipo de CPE', 'Doc. cobranza', 'Serie doc. cobranza', 'Número doc. cobranza', 'Serie CPE', 'Número CPE', 'documento', 'Cliente', 'ruc', 'razonsocial', 'Base Imponible', 'IGV', 'RC', 'Total']);
    worksheet.columns = [{ width: 30 }, { width: 10 }, { width: 16 }, { width: 16 }, { width: 12 }, { width: 18 }, { width: 15 }, { width: 12 }, { width: 9 }, { width: 9 }, { width: 9 }, { width: 11 }, { width: 12 }, { width: 19 }, { width: 9 }, { width: 22 }, { width: 9 }, { width: 9 }, { width: 9 }, { width: 9 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.detalladoList.forEach(info => {
      worksheet.addRow([info.tiendaNombre,info.tiendapixel, this.pipe.transform(info.diaventa, 'dd/MM/yyy'), this.pipe.transform(info.fechaemision,'dd/MM/yyy HH:mm:ss'), info.npedido, info.codvale, info.tipocpe, info.doccobranza,
                        info.seriedoccobranza, info.numerodoccobranza, info.seriecpe, info.numerocpe, info.documento, info.cliente || '', info.ruc || '', info.razonsocial || '', info.baseimponible, info.igv, info.rc, info.total]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

     /*  worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(10).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(11).numFmt = '#,##0.00'; */
      contador++;
    })

   /*  let worksheetNo = workbook.addWorksheet('TiendasNoConectadas');
    worksheetNo.addRow(['Tienda','Motivo']);
    worksheetNo.columns = [{ width: 30 }, { width: 100 }];

    worksheetNo.getRow(1).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    let contadorNo: number = 1;
    this.tiendaErrorList.forEach(info => {
      worksheetNo.addRow([info.noTienda,info.motivo]);

      worksheetNo.getRow(contadorNo).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      contadorNo++;
    });
     */
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Redimido_' + timestamp + '.xlsx');
    });
  }

}
