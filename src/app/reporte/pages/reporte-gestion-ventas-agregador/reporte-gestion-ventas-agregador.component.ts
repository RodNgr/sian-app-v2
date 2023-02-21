import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Empresa } from 'src/app/shared/entity/empresa';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { TiendaDto } from '../../dto/tienda-dto';
import { forkJoin, Observable } from 'rxjs';
import { ParamDto } from '../../dto/param-dto';
import { DatePipe } from '@angular/common';
import { VentasFormaPagoTransaccionDto } from '../../dto/ventas-forma-pago-transaccion-dto';
import * as fs from 'file-saver';
import { Cell, Workbook } from 'exceljs';

@Component({
  selector: 'app-reporte-gestion-ventas-agregador',
  templateUrl: './reporte-gestion-ventas-agregador.component.html',
  styleUrls: ['./reporte-gestion-ventas-agregador.component.css']
})
export class ReporteGestionVentasAgregadorComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public empresaList: Empresa[] = [];

  public empresasSeleccionadas: Empresa[] = [];

  public showSelectorTienda: boolean = false;

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public ventaList: VentasFormaPagoTransaccionDto[] = [];

  public tiendaErrorList: TiendaDto[] = [];

  private pipe = new DatePipe("en-US");

  constructor(private spinner: NgxSpinnerService,
              private empresaServive: EmpresaService,
              private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.empresaList = this.empresaServive.getAllEmpresas();
    this.empresasSeleccionadas = this.empresaServive.getAllEmpresas();
    this.showSelectorTienda = false;
  }

  public onChangeEmpresa(): void {
    if (this.empresasSeleccionadas.length === 1) {
      this.showSelectorTienda = true;
      this.spinner.show();

      this.reporteService.getTiendasAgregador(this.empresasSeleccionadas[0].idEmpresa).subscribe(
        tiendaList => {
          this.tiendaList = tiendaList;
          this.tiendasSeleccionadas = tiendaList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
        }
      )
    } else {
      this.showSelectorTienda = false;
      this.tiendaList = [];
      this.tiendasSeleccionadas = [];
    }
  }

  public buscar(): void {
    if (!this.valida()) {
      return;
    }

    if (this.empresasSeleccionadas.length > 1) {
      this.tiendasSeleccionadas = [];
      const promiseList:Observable<Tienda[]>[] = [];

      this.empresasSeleccionadas.forEach(empresa => {
        promiseList.push(this.reporteService.getTiendasAgregador(empresa.idEmpresa));
      })

      this.spinner.show();
      forkJoin(promiseList).subscribe(
        response => {
          response.forEach(r => this.tiendasSeleccionadas.push(...r));

          let dto: ParamDto = new ParamDto();
          dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
          dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
          dto.tiendaList = this.tiendasSeleccionadas;

          this.reporteService.getReporteVentaAgregador(dto).subscribe(
            response => {
              this.ventaList = response.lista;
              this.tiendaErrorList = response.tienda;
              this.spinner.hide();
            },
            _err => {
              this.spinner.hide();
              swal.fire('Error', 'Problemas al generar el reporte', 'error');
            }
          );
        }, 
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    } else {
      this.spinner.show();

      let dto: ParamDto = new ParamDto();
      dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
      dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
      dto.tiendaList = this.tiendasSeleccionadas;

      this.reporteService.getReporteVentaAgregador(dto).subscribe(
        response => {
          this.ventaList = response.lista;
          this.tiendaErrorList = response.tienda;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al generar el reporte', 'error');
        }
      )
    }
  }

  private valida(): boolean {
    if (!this.empresasSeleccionadas) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos una empresa', 'warning');
      return false;
    }

    if (this.showSelectorTienda) {
      if (!this.tiendasSeleccionadas) {
        swal.fire('Advertencia!', 'Debe seleccionar por lo menos una tienda', 'warning');
        return false;
      } 
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

  public export() {
    if (!this.ventaList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Agregador');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas Agregador']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:V2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    worksheet.mergeCells('A3:V3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Empresa', 'Código', 'Tienda', 'Fecha', 'Correlativo', 'Transacción', 'Tipo', 'Serie', 'Nro', 'Cajero', 'Tipo Venta', 'Forma de Pago', 'Transdate', 'Cent', 'Administrador', 'Venta', 'Tarjeta', 'Aprobación', 'Ref.', 'Lote', 'Tipo', 'Nro Pedido']);
    worksheet.columns = [{ width: 18 }, { width: 10 }, { width: 28 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 14 }, { width: 9 }, { width: 11 }, { width: 21 }, { width: 20 }, { width: 28 }, { width: 17 }, { width: 5 }, { width: 21 }, { width: 10 }, { width: 13 }, { width: 10 }, { width: 5 }, { width: 5 }, { width: 4 }, { width: 11 } ];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 6;
    this.ventaList.forEach(info => {
      worksheet.addRow([info.empresa, info.tienda, info.tiendaNombre, info.openDate, info.correlativo, info.transact, info.docTipo, info.docSerie, info.docNro, info.posName, info.tipoVentaNombre, info.descript, info.transdate, info.ccenter, info.administrador, info.tenderDbl, info.tarjeta, info.referencia, info.lote, info.tipo, info.numeroPedido]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

        contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Agregador_' + timestamp + '.xlsx');
    });
  }

}
