import { Component, HostListener, OnInit } from '@angular/core';
import { Banco } from '../../entity/banco';
import { Empresa } from '../../entity/empresa';
import { Tienda } from '../../entity/tienda';
import { ReporteService } from '../../services/reporte.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { forkJoin, Observable } from 'rxjs';
import { Deposito } from '../../entity/deposito';
import { DepositoDto } from '../../dto/deposito-dto';
import { DatePipe, DecimalPipe } from '@angular/common';
import * as moment from 'moment';
import * as fs from 'file-saver';
import { Cell, Workbook } from 'exceljs';
import { AuthService } from '../../../auth/services/auth.service';
import { EmpresaService } from '../../../shared/services/empresa.service';

@Component({
  selector: 'app-reporte-depositos',
  templateUrl: './reporte-depositos.component.html',
  styleUrls: ['./reporte-depositos.component.css']
})
export class ReporteDepositosComponent implements OnInit {

  public empresaList: Empresa[] = [];

  public empresaSeleccionada!: Empresa;

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public bancoList: Banco[] = [];

  public bancoSeleccionado!: Banco;

  public depositoList: Deposito[] = [];

  public fechaIniSeleccionada!: Date;

  public fechaFinSeleccionada!: Date;

  public enableDropDownTienda!: boolean;

  private pipe = new DatePipe("en-US");

  private numberPipe = new DecimalPipe("en-US");

  public isMobile: boolean = window.innerWidth < 641;

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
    this.reporteService.getEmpresas().subscribe(
      empresaList => {
        if (this.authService.usuario.user.estienda == 'S'){
          this.empresaList.push(empresaList.find(x=>x.idEmpresa == this.empresaService.getEmpresaSeleccionada().idEmpresa));          
        } else{
          this.empresaList = empresaList;
          this.empresaList.unshift({idEmpresa: 0, nombreComercial: 'TODOS', codigo: '0', nombre: '', empresaSap: 0});
        }
        
        this.empresaSeleccionada = this.empresaList[0];

        this.onChangeEmpresa(); 
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las empresas', 'error');
      }
    );
  }

  public onChangeEmpresa(): void {
    this.depositoList = [];

    if (this.empresaSeleccionada.idEmpresa === 0) {
      this.enableDropDownTienda = false;

      this.tiendaList = [];
      this.bancoList = [];

      this.addTiendaDefault();
      this.addBancoDefault();

      this.spinner.hide();
    } else {
      this.enableDropDownTienda = true;

      const promiseList:Observable<any>[] = [];
      promiseList.push(this.reporteService.getTiendasPorEmpresa(this.empresaSeleccionada.idEmpresa, this.authService.getUsuarioInterface()));
      promiseList.push(this.reporteService.getBancosPorEmpresa(this.empresaSeleccionada.idEmpresa));

      this.spinner.show();
      forkJoin(promiseList).subscribe(
        response => {
          this.tiendaList = response[0];
          this.bancoList = response[1];

          this.addTiendaDefault();
          this.addBancoDefault();

          this.listarDepositos();
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

  private addBancoDefault() {
    const banco: Banco = new Banco(0, 'TODOS');
    this.bancoList.unshift(banco);

    this.bancoSeleccionado = this.bancoList[0];
  }

  public listarDepositos(): void {
    if (this.validaFiltros()) {
      const depositoDto: DepositoDto = new DepositoDto();
      depositoDto.idEmpresa = this.empresaSeleccionada.idEmpresa;
      depositoDto.idBanco = this.bancoSeleccionado.idBanco;
      depositoDto.fechaInicial = this.pipe.transform(this.fechaIniSeleccionada, "yyyyMMdd") || '';
      depositoDto.fechaFinal = this.pipe.transform(this.fechaFinSeleccionada, "yyyyMMdd") || '';
      
      if (this.empresaSeleccionada.idEmpresa === 0) {
        depositoDto.tiendas = '0'
      } else {
        depositoDto.tiendas = '';
        this.tiendasSeleccionadas.forEach(t => {
          depositoDto.tiendas = depositoDto.tiendas + t.tienda + ',';
        });

        depositoDto.tiendas = depositoDto.tiendas.substring(0, depositoDto.tiendas.length - 1);
      }

      this.spinner.show();
      this.reporteService.getDepositosPorFecha(depositoDto).subscribe(
        json => {
          this.depositoList = json.data;
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          swal.fire(err.error.mensaje, err.error.error, 'error');
        }
      );
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

    if (this.bancoSeleccionado === undefined || this.bancoSeleccionado === null) {
      swal.fire('Advertencia!', 'Debe seleccionar un banco', 'warning');
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

  public limpiarDepositos(): void {
    this.depositoList = [];
  }

  public exportXLS(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Depositos');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Reporte de Depósitos']);
    worksheet.mergeCells('A2:K2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Subtítulo del archivo
    worksheet.addRow(['Rango de Fechas: Desde ' + this.pipe.transform(this.fechaIniSeleccionada, 'dd/MM/yyyy') + ' hasta ' + this.pipe.transform(this.fechaFinSeleccionada, 'dd/MM/yyyy')]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A3:K3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.addRow(["Empresa", "Día Venta", "Fecha de Voucher", "Tienda", "Banco y Cuenta", "Nro. Ope/Tra", "Tipo", "Monto Original", "Monto", 
                      "Fecha Cierre", "Departamento"]);

    worksheet.columns = [{ width: 14 }, { width: 10 }, { width: 15 }, { width: 28 }, { width: 34 }, { width: 11 }, { width: 5 }, { width: 12 }, 
                         { width: 11 }, { width: 11 }, { width: 17 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    // Contenido del archivo
    let contador: number = 6;
    this.depositoList.forEach(deposito => {
      worksheet.addRow([deposito.empresa.nombreComercial, deposito.cierreFecha, deposito.fecha, deposito.tienda.nombreTienda, deposito.banco.nombre, 
                        deposito.noTransaccion, deposito.moneda.nombreCorto, this.numberPipe.transform(deposito.montoOriginal, '.2-2'), 
                        this.numberPipe.transform(deposito.monto, '.2-2'), (deposito.cierreFechaCierre ? deposito.cierreFechaCierre: ''), 
                        (deposito.tienda.ciudad ? deposito.tienda.ciudad : '')]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Depositos_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
