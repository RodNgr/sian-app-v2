import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgxSpinnerService } from 'ngx-spinner';

import { Aplicacion } from '../../entity/aplicacion';
import { Cell, Workbook } from 'exceljs';
import { Table } from 'primeng/table';

import { AplicacionService } from '../../services/aplicacion.service';

import { AsignarRolAplicacionComponent } from '../../components/asignar-rol-aplicacion/asignar-rol-aplicacion.component';

import swal from 'sweetalert2';
import * as fs from 'file-saver';

@Component({
  selector: 'app-lista-aplicacion',
  templateUrl: './lista-aplicacion.component.html',
  styleUrls: ['./lista-aplicacion.component.css']
})
export class ListaAplicacionComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table!: Table;
    
  public aplicacionList: Aplicacion[] = [];

  public aplicacionSelected!: Aplicacion;

  public cantidadMap = {
    '=0': 'No existen aplicaciones',
    '=1': 'En total hay 1 aplicación',
    'other': 'En total hay # aplicaciones'
  }

  public isMobile: boolean = window.innerWidth < 641;

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private aplicacionService: AplicacionService,
              private dialogService: DialogService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('aplicacion');

    this.list();
  }

  public applyFilterGlobal($event:any) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  private list(): void {
    this.spinner.show();
    this.aplicacionService.getAllAplicaciones().subscribe(
      aplicacionList => {
        this.aplicacionList = aplicacionList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las aplicaciones', 'error');
      }
    );
  }

  public newAplicacion() {
    sessionStorage.setItem('tipoOperacion', 'N');
    this.router.navigateByUrl("/home/seguridad/aplicacion");
  } 

  public editAplicacion() {
    if (!this.aplicacionSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una aplicación', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'E');
    sessionStorage.setItem('aplicacion', this.aplicacionSelected.id.toString());

    this.router.navigateByUrl("/home/seguridad/aplicacion");
  }

  public viewAplicacion() {
    if (!this.aplicacionSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una aplicación', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('aplicacion', this.aplicacionSelected.id.toString());

    this.router.navigateByUrl("/home/seguridad/aplicacion");
  }

  public setRoles(): void {
    if (!this.aplicacionSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una aplicación', 'warning');
      return;
    } 

    this.ref = this.dialogService.open(AsignarRolAplicacionComponent, {
      header: 'Asignar Roles a la Aplicación ' + this.aplicacionSelected.name,
      width: '75%',
      contentStyle: {"overflow": "auto"},
      data: this.aplicacionSelected
    });
  }

  public deleteAplicacion(): void {
    if (!this.aplicacionSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una aplicación', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de eliminar esta aplicación?',
      html: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        this.aplicacionService.delete(this.aplicacionSelected.id).subscribe(
          _data => {
            this.spinner.hide();
            this.aplicacionList.forEach(a => {
              if (a.id == this.aplicacionSelected.id) {
                this.aplicacionList = this.aplicacionList.filter(a => {
                  return a.id !== this.aplicacionSelected.id;
                })
              }
            })
          },
          err => {
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
      }
    });
  }

  public exportList() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Aplicaciones');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Aplicaciones']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Id', 'Aplicación', 'Url']);
    worksheet.columns = [{ width: 7 }, { width: 30 }, { width: 40 } ];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.aplicacionList.forEach(aplicacion => {
       worksheet.addRow([aplicacion.id, aplicacion.name, aplicacion.urlApplication]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Aplicaciones.xlsx');
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.destroy();
    }
  }

}
