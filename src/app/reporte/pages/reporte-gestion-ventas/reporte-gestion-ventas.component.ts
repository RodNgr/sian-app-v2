import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TiendaDto } from '../../dto/tienda-dto';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { ParamDto } from '../../dto/param-dto';
import { ResultadoDto } from '../../dto/resultado-dto';
import { VentasFinalesDto } from '../../dto/ventas-finales-dto';
import { TreeNode } from 'primeng/api';
import { VentasFormaPagoTransaccionDto } from '../../dto/ventas-forma-pago-transaccion-dto';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { GestionVentasHoraDto } from '../../dto/gestion-ventas-hora-dto';
import * as fs from 'file-saver';
import { Cell, Workbook } from 'exceljs';

interface Reporte {
  codigo: number;
  descripcion: string;
}

interface Valor {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-reporte-gestion-ventas',
  templateUrl: './reporte-gestion-ventas.component.html',
  styleUrls: ['./reporte-gestion-ventas.component.css']
})
export class ReporteGestionVentasComponent implements OnInit {

  public reporteList: Reporte[] = [];

  public reporteSeleccionado!: Reporte;

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public minutoList: Valor[] = [];

  public minutoSeleccionado!: Valor;

  public tipoVentaList: Valor[] = [];

  public tipoVentaSeleccionado!: Valor;

  public tiendaErrorList: TiendaDto[] = [];

  public rowGroupMetadata: any;

  public showResumen: boolean = false;

  public showTipoVenta: boolean = false;

  public enableMinutos: boolean = false;

  public resultVentaList: ResultadoDto[] = [];

  public ventaFinalList: VentasFinalesDto[] = [];

  public ventaAgregadorList: VentasFormaPagoTransaccionDto[] = [];

  public gestionVentaHoraList: GestionVentasHoraDto[] = [];

  public resumen: boolean = false;

  public ventaHoraList: TreeNode[] = [];

  private pipe = new DatePipe("en-US");

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,
              private empresaService: EmpresaService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.loadReportesValidos();
    this.loadMinutos();
    this.loadTiposVenta();

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

  private loadReportesValidos(): void {
    if (this.authService.hasRole('ROL_SIAN_REP_GES_VTA_VENTAS')) {
      this.reporteList.push({codigo: 1, descripcion: 'Ventas'});
    }

    if (this.authService.hasRole('ROL_SIAN_REP_GES_VTA_FINAL')) {
      this.reporteList.push({codigo: 2, descripcion: 'Ventas Finales (Excluye vales verde)'});
    }

    if (this.authService.hasRole('ROL_SIAN_REP_GES_VTA_POR_HORA')) {
      this.reporteList.push({codigo: 3, descripcion: 'Ventas por Hora'});
    }

    if (this.authService.hasRole('ROL_SIAN_REP_GES_VTA_PALETEO')) {
      this.reporteList.push({codigo: 4, descripcion: 'Paloteo Pixel'});
    }

    /*
    if (this.authService.hasRole('ROL_SIAN_REP_GES_VTA_CANAL')) {
      this.reporteList.push({codigo: 5, descripcion: 'Ventas por Canales'});
    }
    */

    if (this.authService.hasRole('ROL_SIAN_REP_GES_VTA_AGREGADOR')) {
      this.reporteList.push({codigo: 6, descripcion: 'Ventas PEYA/Rappi'});
    }
  }

  private loadMinutos(): void {
    this.minutoList = [{codigo: '1', descripcion: '30'}, {codigo: '2', descripcion: '60'}];
    this.minutoSeleccionado = {codigo: '1', descripcion: '30'};
  }

  private loadTiposVenta(): void {
    this.tipoVentaList = [{codigo: '1', descripcion: 'Delivery'}, {codigo: '0', descripcion: 'Salón'}, {codigo: '2', descripcion: 'Totalizado'}];
    this.tipoVentaSeleccionado = {codigo: '1', descripcion: 'Delivery'};
  }

  public onChangeReporte() {
    this.resultVentaList = [];
    this.ventaFinalList= [];
    this.ventaAgregadorList = [];
    this.gestionVentaHoraList = [];
    this.tiendaErrorList = [];
    this.rowGroupMetadata = {};

    if (this.reporteSeleccionado.codigo === 1 || this.reporteSeleccionado.codigo === 2 || this.reporteSeleccionado.codigo === 6) {
      this.showResumen = false;
      this.showTipoVenta = false;
      this.enableMinutos = false;
    } else if (this.reporteSeleccionado.codigo === 3) {
      this.showResumen = true;
      this.showTipoVenta = false;
      this.enableMinutos = true;
    } else if (this.reporteSeleccionado.codigo === 4) {
      this.showResumen = false;
      this.showTipoVenta = true;
      this.enableMinutos = false;
    } else if (this.reporteSeleccionado.codigo === 5) {
      this.showResumen = false;
      this.showTipoVenta = false;
      this.enableMinutos = true;
    }
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

    if (this.reporteSeleccionado.codigo === 1) {
      this.reporteService.getReporteVentas(dto).subscribe(
        response => {
          this.resultVentaList = response.lista
          this.tiendaErrorList = response.tienda

          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    } else if (this.reporteSeleccionado.codigo === 2) {
      this.reporteService.getReporteVentasFinales(dto).subscribe(
        response => {
          this.ventaFinalList = response.lista
          this.tiendaErrorList = response.tienda
          this.updateRowGroupMetaDataVentaFinal();

          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    } else if (this.reporteSeleccionado.codigo === 3) {
      if (this.resumen) {
        this.reporteService.getReporteVentasResumen(dto).subscribe(
          response => {
            this.gestionVentaHoraList = response.lista
            this.tiendaErrorList = response.tienda
            this.updateRowGroupMetaDataVentaResumen();

            this.spinner.hide();
          }, 
          _err => {
            this.spinner.hide();
            swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
          }
        );
      } else {
        dto.intervalo = Number(this.minutoSeleccionado.descripcion);
        this.reporteService.getReporteVentasPorHora(dto).subscribe(
          response => {
            this.gestionVentaHoraList = response.lista
            this.tiendaErrorList = response.tienda
            this.convertDataFormat();

            this.spinner.hide();
          }, 
          _err => {
            this.spinner.hide();
            swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
          }
        );
      }
    } else if (this.reporteSeleccionado.codigo === 4) {
      dto.tipoVenta = this.tipoVentaSeleccionado.codigo;
      if (this.tipoVentaSeleccionado.codigo === '2') {
        this.reporteService.getReporteVentasPaloteoPixelTotalizado(dto).subscribe(
          response => {
            this.resultVentaList = response.lista
            this.tiendaErrorList = response.tienda

            this.spinner.hide();
          },
          _err => {
            this.spinner.hide();
            swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
          }
        ); 
      } else {
        this.reporteService.getReporteVentasPaloteoPixel(dto).subscribe(
          response => {
            this.resultVentaList = response.lista
            this.tiendaErrorList = response.tienda

            this.spinner.hide();
          },
          _err => {
            this.spinner.hide();
            swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
          }
        ); 
      }
    } else if (this.reporteSeleccionado.codigo === 5) {
    
    } else {
      this.reporteService.getReporteVentasVentaAgregador(dto).subscribe(
        response => {
          this.ventaAgregadorList = response.lista
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
    if (this.reporteSeleccionado === undefined) {
      swal.fire('Advertencia!', 'Debe seleccionar un reporte', 'warning');
      return false;
    }

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

  private updateRowGroupMetaDataVentaFinal() {
    this.rowGroupMetadata = {};

    if (this.ventaFinalList) {
      for (let i = 0; i < this.ventaFinalList.length; i++) {
        let rowData = this.ventaFinalList[i];
        let tienda = rowData.tienda;
        let tender = rowData.tender;
        let comandas = rowData.comandas;
        let nombre = rowData.tiendaNombre;
        
        if (i == 0) {
          this.rowGroupMetadata[tienda] = { index: 0, size: 1, tender: tender, comandas: comandas, nombre: nombre };
        } else {
          let previousRowData = this.ventaFinalList[i - 1];
          let previousRowGroup = previousRowData.tienda;
          if (tienda === previousRowGroup) {
            this.rowGroupMetadata[tienda].size++;
            this.rowGroupMetadata[tienda].tender = this.rowGroupMetadata[tienda].tender + tender;
            this.rowGroupMetadata[tienda].comandas = this.rowGroupMetadata[tienda].comandas + comandas;
          } else {
            this.rowGroupMetadata[tienda] = { index: i, size: 1, tender: tender, comandas: comandas, nombre: nombre };
          }
        }
      }
    }
  }

  private updateRowGroupMetaDataVentaResumen() {
    this.rowGroupMetadata = {};

    if (this.gestionVentaHoraList) {
      for (let i = 0; i < this.gestionVentaHoraList.length; i++) {
        let rowData = this.gestionVentaHoraList[i];
        let tiendaNombre = rowData.tiendaNombre;
        let totalVenta = rowData.totalVenta;
        let transacciones = rowData.transacciones;
        
        if (i == 0) {
          this.rowGroupMetadata[tiendaNombre] = { index: 0, size: 1, venta: totalVenta, transaccion: transacciones };
        } else {
          let previousRowData = this.gestionVentaHoraList[i - 1];
          let previousRowGroup = previousRowData.tiendaNombre;
          if (tiendaNombre === previousRowGroup) {
            this.rowGroupMetadata[tiendaNombre].size++;
            this.rowGroupMetadata[tiendaNombre].venta = this.rowGroupMetadata[tiendaNombre].venta + totalVenta;
            this.rowGroupMetadata[tiendaNombre].transaccion = this.rowGroupMetadata[tiendaNombre].transaccion + transacciones;
          } else {
            this.rowGroupMetadata[tiendaNombre] = { index: i, size: 1, venta: totalVenta, transaccion: transacciones };
          }
        }
      }
    }
  }

  public convertDataFormat(): void {
    this.ventaHoraList = [];
  
    let tiendas: string[] = this.getTiendasUnicas();

    for (let i = 0; i < tiendas.length; i++) {
      let montoTotal: number = 0;
      let tienda: TreeNode = {
        data: { 
          hora: tiendas[i], 
          transacciones: 0,  
          ventas: 0,
          porcentaje1: 0, 
          porcentaje2: 0,
          formato: 0
        },
        children: []
      }

      let fechas = this.getFechasUnicasPorTienda(tiendas[i]);

      for (let j = 0; j < fechas.length; j++) {
        let fechaNode: TreeNode = {
          data: {
            hora: fechas[j].openDate, 
            transacciones: fechas[j].transacciones, 
            ventas: fechas[j].totalVenta,
            porcentaje1: 0,
            porcentaje2: 0,
            formato: 1
          },
          children: []
        }

        montoTotal += fechas[j].totalVenta;

        let info: GestionVentasHoraDto[] = this.getData(tiendas[i], fechas[j].openDate);

        for (let k = 0; k < info.length; k++) {
          let node: TreeNode = {
            data: {
              hora: info[k].hora, 
              transacciones: info[k].transacciones, 
              ventas: info[k].totalVenta,
              porcentaje1: (info[k].transacciones * 100) / fechas[j].transacciones,
              porcentaje2: (info[k].totalVenta * 100) / fechas[j].totalVenta,
              formato: 2
            }
          }

          fechaNode.children?.push(node);
        }

        tienda.children?.push(fechaNode);
      }
      tienda.data.ventas = montoTotal;
      this.ventaHoraList.push(tienda);
    }
  }

  private getTiendasUnicas(): string[] {
    let tiendaGroup: string[] = [];

    for (let i = 0; i < this.gestionVentaHoraList.length; i++) {
      let rowData = this.gestionVentaHoraList[i];
      let tiendaNombre = rowData.tiendaNombre;
      
      if (i == 0) {
        tiendaGroup.push(tiendaNombre);
      } else {
        let previousRowData = this.gestionVentaHoraList[i - 1];
        let previousRowGroup = previousRowData.tiendaNombre;
        if (tiendaNombre !== previousRowGroup) {
          tiendaGroup.push(tiendaNombre);
        }
      }
    }

    return tiendaGroup;
  }

  private getFechasUnicasPorTienda(tienda: string): GestionVentasHoraDto[] {
    let fechaList: GestionVentasHoraDto[] = [];
    let primero: boolean = true;

    for (let i = 0; i < this.gestionVentaHoraList.length; i++) {
      let rowData = this.gestionVentaHoraList[i];
    
      if (rowData.tiendaNombre === tienda) {
        let venta = rowData.totalVenta;
        let transaccion = rowData.transacciones;
  
        if (primero) {
          fechaList.push({tiendaNombre: rowData.tiendaNombre, tienda: 0, openDate:rowData.openDate, hora: '', 
              transacciones: transaccion, totalVenta: venta});

          primero = false;
        } else {
          let existe = false;

          for (let j = 0; j < fechaList.length; j++) {
            if (fechaList[j].tiendaNombre === rowData.tiendaNombre && fechaList[j].openDate === rowData.openDate) {
              fechaList[j].transacciones += transaccion;
              fechaList[j].totalVenta += venta;
              existe = true;
            }
          }

          if (!existe) {
            fechaList.push({tiendaNombre: rowData.tiendaNombre, tienda: 0, openDate:rowData.openDate, hora: '', 
                transacciones: transaccion, totalVenta: venta});
          }
        }
      }
    }
    
    return fechaList;
  }

  private getData(tienda: string, fecha: string): GestionVentasHoraDto[] {
    let data: GestionVentasHoraDto[] = [];

    for (let i = 0; i < this.gestionVentaHoraList.length; i++) {
      if (this.gestionVentaHoraList[i].tiendaNombre === tienda && this.gestionVentaHoraList[i].openDate === fecha) {
        data.push(this.gestionVentaHoraList[i]);
      }
    }

    return data;
  }

  public export() {
    if (this.reporteSeleccionado.codigo === 1) {
      this.exportVentas();
    } else if (this.reporteSeleccionado.codigo === 2) {
      this.exportVentasFinales();
    } else if (this.reporteSeleccionado.codigo === 3) {
      if (this.resumen) {
        this.exportVentasHorasResumen();
      } else {
        this.exportVentasHoras();
      }  
    } else if (this.reporteSeleccionado.codigo === 4) {
      this.exportPaloteoPixel();
    } else if (this.reporteSeleccionado.codigo === 6) {
      this.exportAgregador();
    }
  }

  private exportVentas() {
    if (!this.resultVentaList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:C3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Nro', 'Descripción', 'SubTotal']);
    worksheet.columns = [{ width: 4 }, { width: 85 }, { width: 8 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.resultVentaList.forEach(info => {
      let descripcion: string = info.descripcion.replace(/&nbsp;/g, ' ');

      if (info.formato === '0' ) {
        worksheet.addRow([info.orden, descripcion, '']);

        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial', bold: true };
        });
      } else if (info.formato === '2') {
        worksheet.addRow([info.orden, descripcion, info.total]);

        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial', bold: true, color: { argb: '0000FF' }};
        });

        worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
      } else if (info.formato === '3') {
        worksheet.addRow([info.orden, descripcion, info.total]);

        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial', bold: true };
        });

        worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
      } else {
        worksheet.addRow([info.orden, descripcion, info.total]);

        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial' };
        });

        worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
      }
    
      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

  private exportVentasFinales(): void {
    if (!this.gestionVentaHoraList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:D3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['', 'Fecha', 'Venta', 'Comandas']);
    worksheet.columns = [{ width: 25 }, { width: 10 }, { width: 11 }, { width: 11 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let tiendasId: number[] = [];
    
    this.ventaFinalList.forEach(venta => {
      tiendasId.push(venta.tienda);
    }); 

    tiendasId = tiendasId.filter(function(value: number, pos: number, self: number[]) {
      return self.indexOf(value) === pos;
    })

    let contador: number = 6;

    tiendasId.forEach(t => {
      worksheet.addRow([this.rowGroupMetadata[t].nombre + ' (' + this.rowGroupMetadata[t].size + ')' , '', this.rowGroupMetadata[t].tender, this.rowGroupMetadata[t].comandas]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial', bold: true };
      });

      worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(4).numFmt = '#,##';

      contador++;

      this.ventaFinalList.forEach(venta => {
        if (venta.tienda === t) {
          worksheet.addRow(['', venta.fecha, venta.tender, venta.comandas]);

          worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });

          worksheet.getRow(contador).getCell(3).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(4).numFmt = '#,##';
          
          contador++;
        }
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

  private exportVentasHoras(): void {
    if (!this.ventaHoraList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:G2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:G3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['', '', 'Hora', 'Transacciones',  'Porcentaje', 'Venta', 'Porcentaje']);
    worksheet.columns = [{ width: 25 }, { width: 10 }, { width: 11 }, { width: 11 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    let contador: number = 6;

    this.ventaHoraList.forEach(tiendaNode => {
      worksheet.addRow([tiendaNode.data.hora, ' ', ' ', ' ', ' ', tiendaNode.data.ventas, ' ']);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial', bold: true };
      });

      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
      
      contador++;

      tiendaNode.children?.forEach(fechaNode => {
        worksheet.addRow([' ', fechaNode.data.hora, ' ', ' ', ' ', fechaNode.data.ventas, ' ']);

        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial', bold: true };
        });

        worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';

        contador++;

        fechaNode.children?.forEach(item => {
          worksheet.addRow([' ', ' ', item.data.hora, item.data.transacciones, item.data.porcentaje1, item.data.ventas, item.data.porcentaje2]);

          worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });

          worksheet.getRow(contador).getCell(4).numFmt = '#,##';
          worksheet.getRow(contador).getCell(5).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(7).numFmt = '#,##0.00';
          contador++;
        });
      })
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

  private exportVentasHorasResumen(): void {
    if (!this.gestionVentaHoraList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:E2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:E3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['', 'Hora', 'Transacciones', 'Porcentaje', 'Venta', 'Porcentaje']);
    worksheet.columns = [{ width: 25 }, { width: 10 }, { width: 11 }, { width: 11 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let tiendasId: string[] = [];
    
    this.gestionVentaHoraList.forEach(venta => {
      tiendasId.push(venta.tiendaNombre);
    }); 

    tiendasId = tiendasId.filter(function(value: string, pos: number, self: string[]) {
      return self.indexOf(value) === pos;
    })

    let contador: number = 6;

    tiendasId.forEach(t => {
      worksheet.addRow([t + ' (' + this.rowGroupMetadata[t].size + ')' , '', this.rowGroupMetadata[t].transaccion, '', this.rowGroupMetadata[t].venta]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial', bold: true };
      });

      worksheet.getRow(contador).getCell(3).numFmt = '#,##';
      worksheet.getRow(contador).getCell(4).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(5).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';

      contador++;

      this.gestionVentaHoraList.forEach(venta => {
        if (venta.tiendaNombre === t) {
          worksheet.addRow(['', venta.openDate, venta.transacciones, (venta.transacciones* 100)/this.rowGroupMetadata[venta.tiendaNombre].transaccion, venta.totalVenta, (venta.totalVenta* 100)/this.rowGroupMetadata[venta.tiendaNombre].venta]);

          worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });

          worksheet.getRow(contador).getCell(3).numFmt = '#,##';
          worksheet.getRow(contador).getCell(4).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(5).numFmt = '#,##0.00';
          worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
          
          contador++;
        }
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

  private exportPaloteoPixel(): void {
    if (!this.resultVentaList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:B2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:B3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Descripción', ' ']);
    worksheet.columns = [{ width: 60 }, { width: 20 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.resultVentaList.forEach(info => {
      let descripcion: string = info.descripcion.replace(/&nbsp;/g, ' ');
      let motivo: string = info.motivo.replace(/&nbsp;/g, ' ');

      worksheet.addRow([descripcion, motivo]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

        contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

  private exportAgregador(): void {
    if (!this.ventaAgregadorList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ventas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:U2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:U3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Código', 'Tienda', 'Fecha', 'Correlativo', 'Transacción', 'Tipo', 'Serie', 'Nro', 'Cajero', 'Tipo Venta', 'Forma de Pago', 'Transdate', 'Cent', 'Administrador', 'Venta', 'Tarjeta', 'Aprobación', 'Ref.', 'Lote', 'Tipo', 'Nro Pedido']);
    worksheet.columns = [{ width: 10 }, { width: 28 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 14 }, { width: 9 }, { width: 11 }, { width: 21 }, { width: 20 }, { width: 28 }, { width: 17 }, { width: 5 }, { width: 21 }, { width: 10 }, { width: 13 }, { width: 10 }, { width: 5 }, { width: 5 }, { width: 4 }, { width: 11 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.ventaAgregadorList.forEach(info => {
      worksheet.addRow([info.tienda, info.tiendaNombre, info.openDate, info.correlativo, info.transact, info.docTipo, info.docSerie, info.docNro, info.posName, info.tipoVentaNombre, info.descript, info.transdate, info.ccenter, info.administrador, info.tenderDbl, info.tarjeta, info.aprobacion, info.referencia, info.lote, info.tipo, info.numeroPedido]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(15).numFmt = '#,##0.00';

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ventas_' + timestamp + '.xlsx');
    });
  }

}
