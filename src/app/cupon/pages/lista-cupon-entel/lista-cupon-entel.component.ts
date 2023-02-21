import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { ValeService } from '../../services/vale.service';

import { DatePipe } from '@angular/common';

import { Cell, Workbook } from 'exceljs';
import { ValeEntel } from '../../dto/vale-entel';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

@Component({
  selector: 'app-lista-cupon-entel',
  templateUrl: './lista-cupon-entel.component.html',
  styleUrls: ['./lista-cupon-entel.component.css']
})
export class ListaCuponEntelComponent implements OnInit {

  public cabValeVerdeList: ValeEntel[] = [];

  public valeSelected!: ValeEntel;

  public rangeDates: Date[] = [];

  public cantidadMap = {
    '=0': 'No existen vales',
    '=1': 'En total hay 1 vale',
    'other': 'En total hay # vales'
  }

  private pipe = new DatePipe("en-US");

  public isMobile: boolean = window.innerWidth < 641

  constructor(public authService: AuthService,
              private spinner: NgxSpinnerService,
              private valeEntelService: ValeService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');

    const feInicio = new Date();
    const feFin = new Date();

    feInicio.setDate(1);

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.buscar();
  }

  public buscar(): void {
    this.spinner.show();
    const desde = this.pipe.transform(this.rangeDates[0], "yyyyMMdd") || '';
    const hasta = this.pipe.transform(this.rangeDates[1], "yyyyMMdd") || '';

    this.valeEntelService.getValesEntel(desde, hasta).subscribe (
      vales => {
        this.cabValeVerdeList = vales;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener los vales entel', 'error');
      }
    )
  }

  public newVale(): void {
    sessionStorage.setItem('tipoOperacion', 'N');
    this.router.navigateByUrl('/home/cupon/cupon-entel');
  }

  public anularValesNoUsados(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de anular los vales no Usados?',
      html: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        this.valeSelected.usuario = this.authService.usuario.username;
        this.valeEntelService.anulaValeNoUsadosEntel(this.valeSelected).subscribe(
          _data => {
            this.spinner.hide();
            swal.fire('Éxito!', 'Vales no Usados anulados exitosamente!', 'success');
          },
          err => {
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
      }
    })
  }

  public exportXLS(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    }

    this.spinner.show();

    this.valeEntelService.getDetalleValesEntel(this.valeSelected.id).subscribe(
      data => {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Vales Entel');
    
        worksheet.addRow(["Cod. Barra", "Usado", "Anulado"]);
        worksheet.columns = [{ width: 20 }, { width: 10 }, { width: 10 }];
        
        worksheet.getRow(1).eachCell(function(cell: Cell, _colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8, bold: true,  name: 'Arial' };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
        });
        
        // Contenido del archivo
        let contador: number = 2;
        data.forEach(vale => {
            worksheet.addRow([vale.codbarra, vale.usado, vale.anulado]);
    
            worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });
    
            contador++;
          })
        
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Vale_ENTEL_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
        });

        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
