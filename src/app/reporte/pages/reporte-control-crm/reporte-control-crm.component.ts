import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TiendaDto } from '../../dto/tienda-dto';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { ParamDto } from '../../dto/param-dto';
import { CmrDetalladoDto } from '../../dto/cmr-detallado-dto';
import { CmrAgrupadoTiendaDto } from '../../dto/cmr-agrupado-tienda-dto';
import { CmrAgrupadoMesDto } from '../../dto/cmr-agrupado-mes-dto';
import { TreeNode } from 'primeng/api';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

interface Tipo {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-reporte-control-crm',
  templateUrl: './reporte-control-crm.component.html',
  styleUrls: ['./reporte-control-crm.component.css']
})
export class ReporteControlCrmComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public tipoVentaList: Tipo[] = [];

  public tipoVentaSeleccionado!: Tipo;

  public detalladoList: CmrDetalladoDto[] = [];

  public agrupadoNode: TreeNode[] = [];

  public agrupadoTiendaList: CmrAgrupadoTiendaDto[] = [];

  public agrupadoMesList: CmrAgrupadoMesDto[] = [];

  public tiendaErrorList: TiendaDto[] = [];

  private pipe = new DatePipe("en-US");

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService) { }

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
    //dto.idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
    dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
    dto.tiendaList = this.tiendasSeleccionadas;

    this.spinner.show();

    if (this.tipoVentaSeleccionado.codigo === '1') {
      this.reporteService.getReporteCmrDetallado(dto).subscribe(
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
    } else if (this.tipoVentaSeleccionado.codigo === '2') {
      this.reporteService.getReporteCmrDetallado(dto).subscribe(
        response => {
          this.detalladoList = response.lista
          this.tiendaErrorList = response.tienda
  
          this.procesaCrmAgrupado();
          console.log(this.agrupadoNode);
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );  
    } else if (this.tipoVentaSeleccionado.codigo === '3') {
      this.reporteService.getReporteCmrAgrupadoMes(dto).subscribe(
        response => {
          this.agrupadoMesList = response.lista
          this.tiendaErrorList = response.tienda

          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );  
    } else if (this.tipoVentaSeleccionado.codigo === '4') {
      this.reporteService.getReporteCmrAgrupadoTienda(dto).subscribe(
        response => {
          this.agrupadoTiendaList = response.lista
          this.tiendaErrorList = response.tienda

          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    } else {
      this.reporteService.getReporteCmrAgrupadoMes(dto).subscribe(
        response => {
          this.agrupadoMesList = response.lista
          this.tiendaErrorList = response.tienda

          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );  
    }
    
  }

  private valida(): boolean {
    if (this.tiendasSeleccionadas.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos una tienda', 'warning');
      return false;
    }

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
  
  private procesaCrmAgrupado(): void {
    this.agrupadoNode = [];
  
    let tiendas: string[] = this.getTiendasUnicas();

    for (let i = 0; i < tiendas.length; i++) {
      let montoTotal: number = 0;
      let tienda: TreeNode = {
        data: { 
          fecha: tiendas[i], 
          cajero: '', 
          cliente: '',
          neto: 0, 
          igv: 0,
          rc: 0,
          total: 0,
          cantidad: 0,
          formato: 0
        },
        children: []
      }

      let clientes = this.getClientesUnicosPorTienda(tiendas[i]);

      for (let j = 0; j < clientes.length; j++) {
        let clienteNode: TreeNode = {
          data: {
            fecha: 'D.N.I.: ' + clientes[j].documento, 
            cajero: '', 
            cliente: '',
            neto: 0, 
            igv: 0,
            rc: 0,
            total: clientes[j].total,
            cantidad: clientes[j].transaccion,
            formato: 1
          },
          children: []
        }

        montoTotal += clientes[j].total;

        let info: CmrDetalladoDto[] = this.getData(tiendas[i], clientes[j].tipo, clientes[j].documento);

        for (let k = 0; k < info.length; k++) {
          let node: TreeNode = {
            data: {
              fecha: info[k].fecha, 
              cajero: info[k].cajero, 
              cliente: info[k].cliente,
              neto: info[k].neto, 
              igv: info[k].igv,
              rc: info[k].rc,
              total: info[k].total,
              formato: 2
            }
          }

          clienteNode.children?.push(node);
        }

        tienda.children?.push(clienteNode);
      }

      tienda.data.total = montoTotal;
      this.agrupadoNode.push(tienda);
    }
  }

  private getTiendasUnicas(): string[] {
    let tiendaGroup: string[] = [];

    for (let i = 0; i < this.detalladoList.length; i++) {
      let rowData = this.detalladoList[i];
      let tiendaNombre = rowData.tiendaNombre;
      
      if (i == 0) {
        tiendaGroup.push(tiendaNombre);
      } else {
        let previousRowData = this.detalladoList[i - 1];
        let previousRowGroup = previousRowData.tiendaNombre;
        if (tiendaNombre !== previousRowGroup) {
          tiendaGroup.push(tiendaNombre);
        }
      }
    }

    return tiendaGroup;
  }

  private getClientesUnicosPorTienda(tienda: string): CmrDetalladoDto[] {
    let clienteList: CmrDetalladoDto[] = [];
    let primero: boolean = true;

    for (let i = 0; i < this.detalladoList.length; i++) {
      let rowData = this.detalladoList[i];
    
      if (rowData.tiendaNombre === tienda) {
        let total = rowData.total;
  
        if (primero) {
          clienteList.push({tiendaNombre: rowData.tiendaNombre, tienda: 0, fecha:rowData.fecha, total: total, 
              fechaHora: '', cajero: '', tipo: rowData.tipo, documento: rowData.documento, cliente: '', neto: 0, 
              igv: 0, rc: 0, transaccion: 1});

          primero = false;
        } else {
          let existe = false;

          for (let j = 0; j < clienteList.length; j++) {
            if (clienteList[j].tiendaNombre === rowData.tiendaNombre && clienteList[j].tipo === rowData.tipo && clienteList[j].documento === rowData.documento) {
              clienteList[j].total += total;
              clienteList[j].transaccion += 1;
              existe = true;
            }
          }

          if (!existe) {
            clienteList.push({tiendaNombre: rowData.tiendaNombre, tienda: 0, fecha:rowData.fecha, total: total, 
                fechaHora: '', cajero: '', tipo: rowData.tipo, documento: rowData.documento, cliente: '', neto: 0, 
                igv: 0, rc: 0, transaccion: 1});
          }
        }
      }
    }
    
    return clienteList;
  }

  private getData(tienda: string, tipo: string, documento: string): CmrDetalladoDto[] {
    let data: CmrDetalladoDto[] = [];

    for (let i = 0; i < this.detalladoList.length; i++) {
      if (this.detalladoList[i].tiendaNombre === tienda && this.detalladoList[i].tipo === tipo && this.detalladoList[i].documento === documento) {
        data.push(this.detalladoList[i]);
      }
    }

    return data;
  }

  public exportar(): void {
    console.log(this.tipoVentaSeleccionado);
    if (this.tipoVentaSeleccionado.codigo === '1') {
      this.exportarDetallado();
    } else if (this.tipoVentaSeleccionado.codigo === '2') {
      this.exportarAgrupado();
    } else if (this.tipoVentaSeleccionado.codigo === '3') {
      this.exportarAcumuladoPorTienda();
    } else if (this.tipoVentaSeleccionado.codigo === '4') {
      this.exportarAgrupadoPorTienda();
    } else {
      this.exportarAcumuladoTotal();
    }
  }

  private exportarDetallado(): void {
    if (!this.detalladoList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('CRM');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte Detallado - CRM']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:L2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:L3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Fecha', 'Hora', 'Tienda', 'Cajero', 'Tipo', 'D.N.I.', 'Cliente', 'Neto', 'I.G.V.', 'R.C.', 'Total', 'Transacción']);
    worksheet.columns = [{ width: 11 }, { width: 8 }, { width: 17 }, { width: 39 }, { width: 7 }, { width: 17 }, { width: 30 }, { width: 7 }, { width: 7 }, { width: 7 }, { width: 7 }, { width: 11 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.detalladoList.forEach(info => {
      worksheet.addRow([info.fecha, this.pipe.transform(info.fechaHora, 'HH:mm:ss'), info.tiendaNombre, info.cajero, info.tipo, info.documento, info.cliente,
                        info.neto, info.igv, info.rc, info.total, info.transaccion]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(10).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(11).numFmt = '#,##0.00';
      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CRM_' + timestamp + '.xlsx');
    });
  }

  private exportarAgrupado(): void {
    if (!this.agrupadoNode) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('CRM');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte Agrupado - CRM']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:I2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:I3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['', '', 'Fecha', 'Cajero',  'Cliente', 'Neto', 'I.G.V', 'R.C.', 'Total']);
    worksheet.columns = [{ width: 39 }, { width: 28 }, { width: 11 }, { width: 28 }, { width: 28 }, { width: 7 }, { width: 7 }, { width: 7 }, { width: 7 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    let contador: number = 6;

    this.agrupadoNode.forEach(tiendaNode => {
      worksheet.addRow([tiendaNode.data.fecha, ' ', ' ', ' ', ' ', ' ', ' ', ' ',  tiendaNode.data.total]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial', bold: true };
      });

      worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';
      
      contador++;

      tiendaNode.children?.forEach(clienteNode => {
        worksheet.addRow([' ', clienteNode.data.fecha, ' ', ' ', ' ', ' ', ' ', ' ', clienteNode.data.total]);

        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial', bold: true };
        });

        worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';

        contador++;

        clienteNode.children?.forEach(item => {
          worksheet.addRow([' ', ' ', item.data.fecha, item.data.cajero, item.data.cliente, item.data.neto, item.data.igv, item.data.rc, item.data.total]);

          worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });

          worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(7).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(9).numFmt = '#,##0.00';
          contador++;
        });
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CRM_' + timestamp + '.xlsx');
    });
  }

  private exportarAcumuladoTotal(): void {
    if (!this.agrupadoMesList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('CRM');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte Acumulado Total - CRM']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:I2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:I2');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Tipo', 'D.N.I.', 'Cliente', 'Neto', 'I.G.V.', 'R.C.', 'Total', 'Ult. Fecha', 'Frecuencia']);
    worksheet.columns = [{ width: 7 }, { width: 11 }, { width: 30 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 11 }, { width: 11 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.agrupadoMesList.forEach(info => {
      worksheet.addRow([info.tipo, info.documento, info.cliente, info.neto, info.igv, info.rc, info.total, info.ultimaFecha, info.cantidad]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(4).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(5).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(7).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(9).numFmt = '#,##';

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CRM_' + timestamp + '.xlsx');
    });
  }

  private exportarAcumuladoPorTienda(): void {
    if (!this.agrupadoMesList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('CRM');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte Acumulado por Tienda - CRM']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:J2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:J3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Tienda', 'Tipo', 'D.N.I.', 'Cliente', 'Neto', 'I.G.V.', 'R.C.', 'Total', 'Ult. Fecha', 'Frecuencia']);
    worksheet.columns = [{ width: 26 }, { width: 7 }, { width: 11 }, { width: 30 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 11 }, { width: 11 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.agrupadoMesList.forEach(info => {
      worksheet.addRow([info.tiendaNombre, info.tipo, info.documento, info.cliente, info.neto, info.igv, info.rc, info.total, info.ultimaFecha, info.cantidad]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(5).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(7).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(10).numFmt = '#,##';

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CRM_' + timestamp + '.xlsx');
    });
  }

  private exportarAgrupadoPorTienda(): void {
    if (!this.agrupadoTiendaList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('CRM');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte Agrupado por Tienda - CRM']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:J2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:J3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Tienda', 'Frecuencia']);
    worksheet.columns = [{ width: 26 },  { width: 11 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.agrupadoTiendaList.forEach(info => {
      worksheet.addRow([info.tiendaNombre, info.cantidad]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(2).numFmt = '#,##';

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CRM_' + timestamp + '.xlsx');
    });
  }

}
