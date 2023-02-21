import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { ValeService } from '../../services/vale.service';

import { ViewPdfComponent } from 'src/app/shared/components/view-pdf/view-pdf.component';

import { DatePipe } from '@angular/common';

import { EstadoValePipe } from '../../pipes/estado-vale.pipe';

import { CabValeVerde } from '../../entity/cabValeVerde';
import { Cell, Workbook } from 'exceljs';

import swal from 'sweetalert2'

import * as fs from 'file-saver';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-vale-cortesia',
  templateUrl: './lista-vale-cortesia.component.html',
  styleUrls: ['./lista-vale-cortesia.component.css']
})
export class ListaValeCortesiaComponent implements OnInit, OnDestroy {

  public cabValeVerdeList: CabValeVerde[] = [];

  public valeSelected!: CabValeVerde;

  public rangeDates: Date[] = [];

  public cantidadMap = {
    '=0': 'No existen vales',
    '=1': 'En total hay 1 vale',
    'other': 'En total hay # vales'
  }

  private pipe = new DatePipe("en-US");
  private pipeEstado = new EstadoValePipe();

  public isMobile: boolean = window.innerWidth < 641

  private ref!: DynamicDialogRef;

  constructor(public authService: AuthService,
              private spinner: NgxSpinnerService,
              private valeCortesiaService: ValeService,
              private empresaService: EmpresaService,
              private router: Router,
              public dialogService: DialogService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('vale-cortesia');

    const feInicio = new Date();
    const feFin = new Date();

    feInicio.setMonth(feInicio.getMonth() - 2);

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.buscar();
  }

  public buscar() {
    this.spinner.show();
    const desde = this.pipe.transform(this.rangeDates[0], "yyyyMMdd") || '';
    const hasta = this.pipe.transform(this.rangeDates[1], "yyyyMMdd") || '';

    this.valeCortesiaService.getValesCortesia(desde, hasta).subscribe (
      vales => {
        this.cabValeVerdeList = vales;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener los vales de cortesía', 'error');
      }
    )
  }

  public newVale(): void {
    sessionStorage.setItem('tipoOperacion', 'N');
    this.router.navigateByUrl('/home/cupon/vale-cortesia');
  } 

  public viewVale(): void {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('vale-cortesia', this.valeSelected.id.toString());
    this.router.navigateByUrl('/home/cupon/vale-cortesia');
  }

  public anularVale() {
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    }

    if (this.valeSelected.anulado) {
      swal.fire('Alerta!', 'El vale ya se encuentra anulado', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de anular este vale?',
      html: 'Esta acción no se puede deshacer',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        this.valeSelected.usuario = this.authService.usuario.username;
        this.valeCortesiaService.anulaVale(this.valeSelected).subscribe(
          _data => {
            this.spinner.hide();
            this.valeSelected.anulado = true;
            swal.fire('Éxito!', 'Vale anulado exitosamente!', 'success');
          },
          err => {
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
      }
    });
  }

  public exportXLS() {
    const empresa = this.empresaService.getEmpresaSeleccionada().nombre;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Vales de Cortesía');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['REGISTRO DE VALES DE CORTESÍA - ' + empresa.toUpperCase()]);
    worksheet.mergeCells('A2:L2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Subtítulo del archivo
    worksheet.addRow(['Fecha: ' + this.pipe.transform(this.rangeDates[0], 'dd/MM/yyyy') + ' - ' + this.pipe.transform(this.rangeDates[1], 'dd/MM/yyyy')]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A3:L3');
    worksheet.getCell('A3').font = { size: 8, bold: true,  name: 'Arial' };
    worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };

    // Título de la tabla
    worksheet.addRow(["Desde", "Hasta", "Descripción", "Cantidad", "Prefijo", "Rango Inicial", "Rango Final", "Área", "Empleado", "Registrado por", "Estado", "F.Registro"]);
    worksheet.columns = [{ width: 10 }, { width: 10 }, { width: 45 }, { width: 9 }, { width: 10 }, { width: 12 }, { width: 12 }, { width: 25 }, { width: 20 }, { width: 14 }, { width: 10 }, { width: 10 }];
    
    worksheet.getRow(5).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 6
    this.cabValeVerdeList.forEach(vale => {
       worksheet.addRow([this.pipe.transform(vale.vdesde, "dd/MM/yyyy"), this.pipe.transform(vale.vhasta, "dd/MM/yyyy"), vale.observacion,
                         vale.cantidad, vale.prefijo, vale.rangoini, vale.rangofin, vale.areaNombre || '', vale.empleadoNombre || '', vale.usuario,
                         this.pipeEstado.transform(vale), this.pipe.transform(vale.freg, "dd/MM/yyyy")]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
        
        if (colNumber === 1 || colNumber === 2  || colNumber === 5 || colNumber === 12) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Vale_Cortesia_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });
  }

  public imprimir(): void {
    console.log(this.valeSelected);
    if (!this.valeSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un vale', 'warning');
      return;
    }

    if (this.valeSelected.anulado) {
      swal.fire('Alerta!', 'No se puede imprimir un vale anulado', 'warning');
      return;
    }

    if (!this.valeSelected.idFormato) {
      swal.fire('Alerta!', 'No se puede imprimir un vale que no tiene un formato asignado', 'warning');
      return;
    }

    this.valeSelected.usuario = this.authService.usuario.username;
    
    this.spinner.show();
    this.valeCortesiaService.imprimirVale(this.valeSelected).subscribe(
      rpta => {
        this.spinner.hide();

        this.valeSelected.isprint = true;
        this.ref = this.dialogService.open(ViewPdfComponent, {
          header: 'Imprimir Vale',
          width: '75%',
          contentStyle: {"overflow": "auto"},
          data: environment.urlCupones + '/api/vale/corporativo/show/' + rpta.mensaje
        });

        if (this.valeSelected.subTipDoc == 1) {
          let archivo: String = rpta.mensaje;
          archivo = archivo.replace(".pdf", ".zip");

          window.location.href = environment.urlCupones + '/api/vale/corporativo/download/' + archivo;
        }
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

  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
  }
  
}
