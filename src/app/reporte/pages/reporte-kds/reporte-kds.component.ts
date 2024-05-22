import { Component, OnInit } from '@angular/core';
import { kds } from '../../entity/kds';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ParamDto } from '../../dto/param-dto';
import { ReporteService } from '../../services/reporte.service';
import { Console } from 'console';
import { Tienda } from '../../entity/tienda';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';


@Component({
  selector: 'app-reporte-kds',
  templateUrl: './reporte-kds.component.html',
  styleUrls: ['./reporte-kds.component.css']
})
export class ReporteKdsComponent implements OnInit {

  public KdsList: kds[] = [];

  public cantidadMap = {
    '=0': 'No existen registros KDS',
    '=1': 'En total hay 1 registro KDS',
    'other': 'En total hay # de registros KDS'
  }

  public rangeDates: Date[] = [];

  public isMobile: boolean = window.innerWidth < 641
  public tiendaList: Tienda[] = [];
  public tiendaSeleccionada: Tienda;
  private pipe = new DatePipe("en-US");
  public feInicio: Date = new Date();
  public feFin: Date = new Date();

  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private authService: AuthService,
              private reporteService: ReporteService){ }

  ngOnInit(): void {

    this.spinner.show();      
      this.reporteService.getTiendasPorEmpresakds(this.empresaService.getEmpresaSeleccionada().idEmpresa, this.authService.getUsuarioInterface()).subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las tiendas', 'error');
      }
    );
  }

  public changeTienda(): void {     
  }

  public buscar(): void {
    let dto: ParamDto = new ParamDto();


    dto.feInicio = this.pipe.transform(this.feInicio, 'yyyyMMdd') || '';  
    dto.feFin = this.pipe.transform(this.feFin, 'yyyyMMdd') || '';  
    dto.tiendaList.push(this.tiendaSeleccionada);

    this.spinner.show();
      this.reporteService.getReporteKDS(dto).subscribe(
        response => {
          this.KdsList = response.lista;          
          console.log(this.KdsList);
          this.spinner.hide()
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al ejecutar el reporte', 'error');
        }
      );
    
    
  }

  public exportar(): void {
    if (!this.KdsList) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    } 

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('KDS');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte KDS']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
    worksheet.mergeCells('A2:K2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A3:K3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    worksheet.addRow(['Fecha de venta', 'Canal de venta', 'Inicio de pedido', 'Fin de pedido', 'Tipo de venta', '# de venta', 'Cod. Producto', 'Producto', 'Packer 1', 'Packer 2', 'Counter']);
    worksheet.columns = [{ width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 } ];


      this.KdsList.forEach(kds => {
        worksheet.addRow([kds.fecha,kds.canal,kds.iniciopedido,kds.finpedido,kds.tipoventa,kds.numeropedido,kds.codigoproducto,kds.producto,kds.packer1,kds.packer2,kds.counter]);
      })

      workbook.xlsx.writeBuffer().then((data) => {
        let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'KDS_' + timestamp + '.xlsx');
      });
  }

}
