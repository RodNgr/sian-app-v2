import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CuponesOmnicanalService } from '../../services/cupones-omnicanal.service';
import { ConsultaCuponOmnicanal } from '../../entity/ConsultacuponOmnicanal';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { Cell, Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import * as fs from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmpresaService } from '../../../shared/services/empresa.service';

@Component({
  selector: 'app-reporte-cupon-omnicanal',
  templateUrl: './reporte-cupon-omnicanal.component.html',
  styleUrls: ['./reporte-cupon-omnicanal.component.css']
})
export class ReporteCuponOmnicanalComponent implements OnInit {

  public cuponesGenerados: ConsultaCuponOmnicanal[] = [];
  private urlEndPointOmnicanal: string;
  private pipe = new DatePipe("en-US");
  public feInicio: Date = new Date();
  public codigocupon : string='';
  @ViewChild('codcupon') codcupon: ElementRef;

  constructor(private spinner: NgxSpinnerService,
    private cuponesgenerados_service: CuponesOmnicanalService,
    private empresaService: EmpresaService) { 
    this.urlEndPointOmnicanal = environment.urlOmnicanalA;  
  }

  ngOnInit(): void {
    
  }

  public getCuponesGenerados() {
    this.spinner.show();
    //sessionStorage.removeItem('token_omnicanal');
    const token_omnicanal: string = sessionStorage.getItem('token_omnicanal')!;

    if(this.codigocupon=='' || this.codigocupon == null || this.codigocupon==undefined){
      this.codcupon.nativeElement.focus();
      swal.fire('Mensaje', 'Debe ingresar un código de cupón', 'info');
      this.spinner.hide();
      return;
    }
    if(token_omnicanal){//DD002B5I
      this.ajaxQueryGET(`${this.urlEndPointOmnicanal}/consultacupon/${this.empresaService.getEmpresaSeleccionada().idEmpresa}/${this.codigocupon}`, token_omnicanal); 
    }else{
      this.cuponesgenerados_service.TokenOmnicanal().subscribe(resp => { 
         this.ajaxQueryGET(`${this.urlEndPointOmnicanal}/consultacupon/${this.empresaService.getEmpresaSeleccionada().idEmpresa}/${this.codigocupon}`, resp.access_token);  
      }, e => {
        this.spinner.hide();
        console.error(e);
      });
    }
    
  }

  public buscar(): void {
    this.getCuponesGenerados();
  }


  public exportar(): void {
    if (!this.cuponesGenerados) {
      swal.fire('Advertencia!', 'No hay información para exportar', 'warning');
      return;
    }
    this.feInicio =new Date();

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Cupones');

    worksheet.addRow(['']);
    worksheet.addRow(['Reporte Cupones']);
    worksheet.addRow(['Fecha y Hora: ' + this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') ]);
   /*  worksheet.addRow(['Desde: ' + this.pipe.transform(this.feInicio, 'dd/MM/yyyy') ]); */
    worksheet.mergeCells('A2:L2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A3:L3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(['N° Pedido','Marca', 'Canal', 'Cod Tienda', 'Cupon', 'Cod Cajero', 'Nombre Campaña', 'Fecha Registro', 'Fecha Actualización', 'Nombre Cajero', 'Nombre Tienda']);
    worksheet.columns = [{ width: 10 }, { width: 10 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 18 }, { width: 50 }, { width: 16 }, { width: 16 }, { width: 30 }, { width: 30 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    /* this.pipe.transform(info.diaventa, 'dd/MM/yyy') */
    let contador: number = 6;
    this.cuponesGenerados.forEach(info => {
      worksheet.addRow([info.nroPedido,info.marca, info.canal, info.codtienda, info.codCupon, info.codCajero, info.nombreCampanha,
                        info.fecRegistro, info.fecActualizacion, info.nombreCajero, info.nombreTienda]);

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

    workbook.xlsx.writeBuffer().then((data) => {
      let timestamp = this.pipe.transform(new Date(), 'yyyyMMddHHmmss');
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Cupones_' + timestamp + '.xlsx');
    });
  }

  private ajaxQueryGET(urlEndPoint: string, token: string): any {
    $.ajax({
      url: urlEndPoint,
      crossDomain: true,
      contentType: 'application/json',
     /*  data: {
        foo: 'bar'
      }, */
      success: (result: ConsultaCuponOmnicanal[]) => {//DD002B5I
        result.forEach(element => {
          console.log('element.sk.split',element);
          if(element.sk.split('#').length=4){
            //console.log('element.sk.split',element.sk.split('#'));
            element.marca=element.sk.split('#')[0];
            element.canal=element.sk.split('#')[1];
            element.codtienda=element.sk.split('#')[2];
            //element.cupon=element.sk.split('#')[3];
            element.nroPedido = element.nroPedido || '';
            element.marca = element.marca || '';
            element.canal = element.canal || '';
            element.codtienda = element.codtienda || '';
            element.codCupon = element.codCupon || ''; 
            element.codCajero = element.codCajero || '';
            element.nombreCampanha = element.nombreCampanha || '';
            element.fecRegistro = element.fecRegistro || ''; 
            element.fecActualizacion = element.fecActualizacion || ''; 
            element.nombreCajero = element.nombreCajero || ''; 
            element.nombreTienda = element.nombreTienda || '';
            
          }
        });
        this.cuponesGenerados = result;
        this.spinner.hide();
      },
      beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + token ); },
      error: (error) => {
        console.log(error);
        if(error.status==401){
          console.log("CLEAR TOKEN");
          sessionStorage.removeItem('token_omnicanal');
          swal.fire('Error', 'Problemas al obtener información. vuelva a consultar', 'error');
        }
        this.spinner.hide();
      }
    });

  }


}
