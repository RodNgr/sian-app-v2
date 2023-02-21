import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/shared/entity/empresa';
import { TiendaDto } from '../../dto/tienda-dto';
import { Tienda } from '../../entity/tienda';
import { VentaAcumuladaDto } from '../../dto/venta-acumulada-dto';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { forkJoin, Observable } from 'rxjs';
import { ParamDto } from '../../dto/param-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-reporte-gestion-venta-locatario',
  templateUrl: './reporte-gestion-venta-locatario.component.html',
  styleUrls: ['./reporte-gestion-venta-locatario.component.css']
})
export class ReporteGestionVentaLocatarioComponent implements OnInit {

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public empresaList: Empresa[] = [];

  public empresasSeleccionadas: Empresa[] = [];

  public showSelectorTienda: boolean = false;

  public feInicio: Date = new Date();

  public feFin: Date = new Date();

  public ventaList: VentaAcumuladaDto[] = [];

  public tiendaErrorList: TiendaDto[] = [];

  private pipe = new DatePipe("en-US");
  
  constructor(private spinner: NgxSpinnerService,
    private empresaService: EmpresaService,
    private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.empresaList = this.empresaService.getAllEmpresas();
    this.empresasSeleccionadas = this.empresaService.getAllEmpresas();
    this.showSelectorTienda = false;
  }

  public onChangeEmpresa(): void {
    if (this.empresasSeleccionadas.length === 1) {
      this.showSelectorTienda = true;
      this.spinner.show();

      this.reporteService.getTiendasPorEmpresa(this.empresasSeleccionadas[0].idEmpresa).subscribe(
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
      const promiseList: Observable<Tienda[]>[] = [];

      this.empresasSeleccionadas.forEach(empresa => {
        promiseList.push(this.reporteService.getTiendasPorEmpresa(empresa.idEmpresa));
      })

      this.spinner.show();
      forkJoin(promiseList).subscribe(
        response => {
          response.forEach(r => this.tiendasSeleccionadas.push(...r));
          
          let dto: ParamDto = new ParamDto();
          dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
          dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
          dto.tiendaList = this.tiendasSeleccionadas;

          this.reporteService.getReporteVentasLocatarios(dto).subscribe(
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

      this.reporteService.getReporteVentasLocatarios(dto).subscribe(
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

  public exportar() {
    if (!this.ventaList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('VentasAcumuladas');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Ventas acumuladas']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:V2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A3:V3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['Marca', 'Cod. SAP', 'Tienda', 'Fecha', 'Transacciones', 'Venta neta', 'I.G.V.', 'R.C.', 'ICEBEPER', 'Total']);
    worksheet.columns = [{ width: 10 }, { width: 10 }, { width: 28 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 } ];

    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    let contador: number = 6;
    this.ventaList.forEach(info => {
      worksheet.addRow([info.marca, info.codSap, info.tienda, this.pipe.transform(info.fecha, 'dd/MM/yyyy'), info.transacciones, info.ventaNeta, info.igv, info.rc, info.icbp, info.total]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      worksheet.getRow(contador).getCell(5).numFmt = '#,##';
      worksheet.getRow(contador).getCell(6).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(7).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(8).numFmt = '#,##0.00';
      worksheet.getRow(contador).getCell(10).numFmt = '#,##0.00';

      contador++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'VentasAcumuladas_' + timestamp + '.xlsx');
    });
  }

}
