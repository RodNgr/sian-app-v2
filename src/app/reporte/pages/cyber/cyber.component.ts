import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientCyber } from '../../entity/client-cyber';
import { CyberService } from '../../services/cyber.service';
import swal from 'sweetalert2';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-cyber',
  templateUrl: './cyber.component.html',
  styleUrls: ['./cyber.component.css']
})
export class CyberComponent implements OnInit {

  public clientList: ClientCyber[] = [];

  public rangeDates: Date[] = [];

  public cantidadMap = {
    '=0': 'No existen vales',
    '=1': 'En total hay 1 vale',
    'other': 'En total hay # vales'
  }

  private pipe = new DatePipe("en-US");

  public isMobile: boolean = window.innerWidth < 641
  
  constructor(private spinner: NgxSpinnerService,
              private cyberService: CyberService) { }

  ngOnInit(): void {
    const feInicio = new Date();
    const feFin = new Date();

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.buscar();
  }

  public buscar() {
    this.spinner.show();
    const desde = this.pipe.transform(this.rangeDates[0], "yyyy-MM-dd") || '';
    const hasta = this.pipe.transform(this.rangeDates[1], "yyyy-MM-dd") || '';

    this.cyberService.getClients(desde, hasta).subscribe(
      clientList => {
        this.clientList = clientList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener los clientes del Cyber', 'error');
      }
    )
  }

  public exportXLS(): void {    
    if (!this.clientList || this.clientList.length == 0) {
      swal.fire('Alerta!', 'No existen clientes para exportar', 'warning');
      return;
    }

    this.spinner.show();

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Clientes Cyber Wow');
  
      worksheet.addRow(["Nombre", "DNI", "E-Mail", "Teléfono", "F.Registro"]);
      worksheet.columns = [{ width: 40 }, { width: 10 }, { width: 40 }, { width: 10 }, { width: 15 }];
      
      worksheet.getRow(1).eachCell(function(cell: Cell, _colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8, bold: true,  name: 'Arial' };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
      });

      // Contenido del archivo
      let contador: number = 2;
      this.clientList.forEach(client => {
        worksheet.addRow([client.name.toUpperCase(), client.dni, client.email.toUpperCase(), client.phone, this.pipe.transform(client.date, "dd/MM/yyyy") || '']);
  
        worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8,  name: 'Arial' };
        });
  
        contador++;
      })
      
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'CyberWow_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
      });

      this.spinner.hide();
    }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

}
