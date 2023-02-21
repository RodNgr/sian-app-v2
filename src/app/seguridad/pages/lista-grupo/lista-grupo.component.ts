import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgxSpinnerService } from 'ngx-spinner';

import { GrupoService } from '../../services/grupo.service';

import { Cell, Workbook } from 'exceljs';
import { Grupo } from '../../entity/grupo';
import { Table } from 'primeng/table';

import { AsignarTiendaComponent } from '../../components/asignar-tienda/asignar-tienda.component';

import * as fs from 'file-saver';
import swal from 'sweetalert2';

@Component({
  selector: 'app-lista-grupo',
  templateUrl: './lista-grupo.component.html',
  styleUrls: ['./lista-grupo.component.css']
})
export class ListaGrupoComponent implements OnInit , OnDestroy {

  @ViewChild('dt') table!: Table;
    
  public grupoList: Grupo[] = [];

  public grupoSelected!: Grupo;

  public cantidadMap = {
    '=0': 'No existen grupos',
    '=1': 'En total hay 1 grupo',
    'other': 'En total hay # grupos'
  }

  public isMobile: boolean = window.innerWidth < 641;

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private grupoService: GrupoService,
              private dialogService: DialogService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('grupo');

    this.list();
  }

  public applyFilterGlobal($event:any) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  private list(): void {
    this.spinner.show();
    this.grupoService.getAllGrupos().subscribe(
      grupoList => {
        this.grupoList = grupoList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los grupos', 'error');
      }
    );
  }

  public newGrupo() {
    sessionStorage.setItem('tipoOperacion', 'N');
    this.router.navigateByUrl("/home/seguridad/grupo");
  } 

  public editGrupo() {
    if (!this.grupoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un grupo', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'E');
    sessionStorage.setItem('grupo', this.grupoSelected.id.toString());

    this.router.navigateByUrl("/home/seguridad/grupo");
  }

  public viewGrupo() {
    if (!this.grupoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un grupo', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('grupo', this.grupoSelected.id.toString());

    this.router.navigateByUrl("/home/seguridad/grupo");
  }

  public asignarTiendas(): void {
    if (!this.grupoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un grupo', 'warning');
      return;
    } 

    this.ref = this.dialogService.open(AsignarTiendaComponent, {
      header: 'Tiendas Asociadas a: ' + this.grupoSelected.descripcion,
      width: '65%',
      contentStyle: {"overflow": "auto"},
      data: this.grupoSelected
    });
  }

  public deleteGrupo(): void {
    if (!this.grupoSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un grupo', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de eliminar este grupo?',
      html: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        this.grupoService.delete(this.grupoSelected.id).subscribe(
          _data => {
            this.spinner.hide();
            this.grupoList = this.grupoList.filter(a => {
              return a.id !== this.grupoSelected.id;
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
    let worksheet = workbook.addWorksheet('Grupos');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Grupos']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:B2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Id', 'Descripción']);
    worksheet.columns = [{ width: 15 }, { width: 40 }];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.grupoList.forEach(grupo => {
       worksheet.addRow([grupo.id, grupo.descripcion]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Grupos.xlsx');
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
