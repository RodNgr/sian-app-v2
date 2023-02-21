import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Empresa } from '../../entity/empresa';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { forkJoin, Observable } from 'rxjs';
import { CierreOtroMotivo } from '../../entity/cierre-otro-motivo';
import { CierreOtro } from '../../entity/cierre-otro';
import { CierreOtroDto } from '../../dto/cierre-otro-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Moneda } from '../../entity/moneda';
import { AuthService } from '../../../auth/services/auth.service';
import { EmpresaService } from '../../../shared/services/empresa.service';

interface EstadoOtraCuadratura {
  id: string;
  descripcion: string;
}

@Component({
  selector: 'app-reporte-otras-cuadraturas',
  templateUrl: './reporte-otras-cuadraturas.component.html',
  styleUrls: ['./reporte-otras-cuadraturas.component.css']
})
export class ReporteOtrasCuadraturasComponent implements OnInit {

  public empresaList: Empresa[] = [];

  public empresaSeleccionada!: Empresa;

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public cierreMotivosList: CierreOtroMotivo[] = [];

  public cierreMotivoSeleccionado!: CierreOtroMotivo;

  public estadoList: EstadoOtraCuadratura[] = [{id: 'T', descripcion: 'TODOS'}, {id: 'A', descripcion: 'Activos'}, {id: 'I', descripcion: 'Anulados'}]

  public estadoSeleccionado!: EstadoOtraCuadratura;

  public fechaIniSeleccionada!: Date;

  public fechaFinSeleccionada!: Date;

  public enableDropDownTienda!: boolean;

  private pipe = new DatePipe("en-US");

  private numberPipe = new DecimalPipe("en-US");

  public isMobile: boolean = window.innerWidth < 641;

  public cierreOtrasCuadraturasList: CierreOtro[] = [];

  public cierreOtrasCuadraturasAnuladoList: CierreOtro[] = [];

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,
              private authService: AuthService,
              private empresaService: EmpresaService
              ) { }

  ngOnInit(): void {
    const dateMnsFive = moment(new Date()).subtract(1 , 'day');

    this.fechaIniSeleccionada = new Date(dateMnsFive.toISOString());
    this.fechaFinSeleccionada = new Date(dateMnsFive.toISOString());

    this.spinner.show();

    const promiseList:Observable<any>[] = [];
    promiseList.push(this.reporteService.getEmpresas());
    promiseList.push(this.reporteService.getCierreMotivos());

    this.spinner.show();
    forkJoin(promiseList).subscribe(
      response => {
        if (this.authService.usuario.user.estienda == 'S'){
          this.empresaList.push(response[0].find(x=>x.idEmpresa == this.empresaService.getEmpresaSeleccionada().idEmpresa));          
        } else{
          this.empresaList = response[0];
          this.empresaList.unshift({idEmpresa: 0, nombreComercial: 'TODOS', codigo: '0', nombre: '', empresaSap: 0});
        }
        
        this.empresaSeleccionada = this.empresaList[0];

        this.cierreMotivosList = response[1];
        this.addMotivoDefault();

        this.estadoSeleccionado = this.estadoList[0];

        this.onChangeEmpresa();        
      }, 
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información', 'error');
      }
    )
  }

  public onChangeEmpresa(): void {
    this.cierreOtrasCuadraturasList = [];
    this.cierreOtrasCuadraturasAnuladoList = [];

    if (this.empresaSeleccionada.idEmpresa === 0) {
      this.enableDropDownTienda = false;
      this.tiendaList = [];

      this.addTiendaDefault();

      this.spinner.hide();
    } else {
      this.enableDropDownTienda = true;

      this.spinner.show();
      this.reporteService.getTiendasPorEmpresa(this.empresaSeleccionada.idEmpresa, this.authService.getUsuarioInterface()).subscribe(
        tiendaList => {
          this.tiendaList = tiendaList;
          this.addTiendaDefault();

          this.listarOtrasCuadraturas();
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al obtener la información', 'error');
        }
      )
    }
  }

  private addTiendaDefault() {
    if (this.empresaSeleccionada.idEmpresa === 0) {
      const tienda: Tienda = new Tienda(0, 'TODOS');
      this.tiendaList.push(tienda);
    }

    this.tiendasSeleccionadas = [...this.tiendaList];
  }

  private addMotivoDefault() {
    const otroMotivo: CierreOtroMotivo = new CierreOtroMotivo();
    otroMotivo.idMotivo = 0;
    otroMotivo.nombre = 'TODOS';

    this.cierreMotivosList.unshift(otroMotivo);

    this.cierreMotivoSeleccionado = this.cierreMotivosList[0];
  }

  public listarOtrasCuadraturas(): void {
    if (this.validaFiltros()) {
      const cierreOtroDto: CierreOtroDto = new CierreOtroDto();
      cierreOtroDto.idEmpresa = this.empresaSeleccionada.idEmpresa;
      cierreOtroDto.idMotivo = this.cierreMotivoSeleccionado.idMotivo;
      cierreOtroDto.fechaInicio = this.pipe.transform(this.fechaIniSeleccionada, "yyyyMMdd") || '';
      cierreOtroDto.fechaFin = this.pipe.transform(this.fechaFinSeleccionada, "yyyyMMdd") || '';

      if (this.empresaSeleccionada.idEmpresa === 0) {
        cierreOtroDto.tiendas = '0'
      } else {
        cierreOtroDto.tiendas = '';
        this.tiendasSeleccionadas.forEach(t => {
          cierreOtroDto.tiendas = cierreOtroDto.tiendas + t.tienda + ',';
        });

        cierreOtroDto.tiendas = cierreOtroDto.tiendas.substring(0, cierreOtroDto.tiendas.length - 1);
      }

      const promiseList:Observable<any>[] = [];
      promiseList.push(this.reporteService.getCierreOtraCuadraturaPorFecha(cierreOtroDto));
      promiseList.push(this.reporteService.getCierreOtraCuadraturaAnuladosPorFecha(cierreOtroDto));

      this.spinner.show();
      forkJoin(promiseList).subscribe(
        response => {
          this.cierreOtrasCuadraturasList = response[0].data;
          this.cierreOtrasCuadraturasAnuladoList = response[1].data;

          if (this.estadoSeleccionado.id === 'T') {
            this.cierreOtrasCuadraturasAnuladoList.forEach(o => {
              this.cierreOtrasCuadraturasList.push(o);
            });
          } else {
            this.cierreOtrasCuadraturasList = [...this.cierreOtrasCuadraturasAnuladoList];
          }

          this.spinner.hide();
        }, 
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al obtener la información', 'error');
        }
      )
    }
  }

  private validaFiltros(): boolean {
    if (this.empresaSeleccionada === undefined || this.empresaSeleccionada === null) {
      swal.fire('Advertencia!', 'Debe seleccionar una empresa', 'warning');
      return false;
    }

    if (this.tiendasSeleccionadas.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar una tienda', 'warning');
      return false;
    }

    if (this.cierreMotivoSeleccionado === undefined || this.cierreMotivoSeleccionado === null) {
      swal.fire('Advertencia!', 'Debe seleccionar un motivo', 'warning');
      return false;
    }

    if (this.estadoSeleccionado === undefined || this.estadoSeleccionado === null) {
      swal.fire('Advertencia!', 'Debe seleccionar un estado', 'warning');
      return false;
    }

    if (this.fechaIniSeleccionada === undefined || this.fechaIniSeleccionada === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha inicial', 'warning');
      return false;
    }

    if (this.fechaFinSeleccionada === undefined || this.fechaFinSeleccionada === null) {
      swal.fire('Advertencia!', 'Debe seleccionar la fecha final', 'warning');
      return false;
    }

    if (this.fechaIniSeleccionada > this.fechaFinSeleccionada) {
      swal.fire('Advertencia!', 'La fecha inicial no puede ser mayor a la fecha final', 'warning');
      return false;
    }

    return true;
  }

  public limpiarOtrasCuadraturas(): void {
    this.cierreOtrasCuadraturasList = [];
    this.cierreOtrasCuadraturasAnuladoList = [];
  }

  public exportXLS(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Otras Cuadraturas');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Otras Cuadraturas']);
    worksheet.mergeCells('A2:L2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Subtítulo del archivo
    worksheet.addRow(['Rango de Fechas: Desde ' + this.pipe.transform(this.fechaIniSeleccionada, 'dd/MM/yyyy') + ' hasta ' + this.pipe.transform(this.fechaFinSeleccionada, 'dd/MM/yyyy')]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A3:L3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.addRow(["Empresa", "Tienda", "Motivo", "Día Venta", "Moneda", "Monto", "Cod. Autorización", "Registrado Por", "Fecha Cierre", "Fecha Registro", 
                      "Hora Registro", "Estado"]);

    worksheet.columns = [{ width: 17 }, { width: 27 }, { width: 13 }, { width: 10 }, { width: 8 }, { width: 13 }, { width: 14 }, { width: 27 }, 
                         { width: 10 }, { width: 17 }, { width: 17 }, { width: 13 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    // Contenido del archivo
    let contador: number = 6;
    this.cierreOtrasCuadraturasList.forEach(otras => {
      worksheet.addRow([otras.empresa.nombreComercial, otras.tienda.nombreTienda, otras.motivo.nombre, otras.cierreFecha, otras.moneda.nombreCorto,  
                        this.numberPipe.transform(otras.monto, '.2-2'), otras.codigoAutorizacion, otras.empleadoCajaChica, otras.cierreFechaCierre,
                        otras.fechaRegistroS, otras.horaRegistroS, otras.descEstado]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Otras_Cuadraturas_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
