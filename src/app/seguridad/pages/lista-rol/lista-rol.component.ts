import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgxSpinnerService } from 'ngx-spinner';

import { RolService } from '../../services/rol.service';

import { Cell, Workbook } from 'exceljs';
import { Rol } from '../../entity/rol';
import { Table } from 'primeng/table';

import { VerAplicacionRolComponent } from '../../components/ver-aplicacion-rol/ver-aplicacion-rol.component';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

@Component({
  selector: 'app-lista-rol',
  templateUrl: './lista-rol.component.html',
  styleUrls: ['./lista-rol.component.css']
})
export class ListaRolComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table!: Table;
    
  public rolList: Rol[] = [];

  public rolSelected!: Rol;

  public cantidadMap = {
    '=0': 'No existen roles',
    '=1': 'En total hay 1 rol',
    'other': 'En total hay # roles'
  }

  public isMobile: boolean = window.innerWidth < 641;

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private rolService: RolService,
              private dialogService: DialogService,
              private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('message')) {
      swal.fire('Éxito!', sessionStorage.getItem('message')!, 'success');
      sessionStorage.removeItem('message');
    }

    sessionStorage.removeItem('tipoOperacion');
    sessionStorage.removeItem('rol');

    this.list();
  }

  public applyFilterGlobal($event:any) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  private list(): void {
    this.spinner.show();
    this.rolService.getAllRoles().subscribe(
      rolList => {
        this.rolList = rolList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de los roles', 'error');
      }
    );
  }

  public newRol() {
    sessionStorage.setItem('tipoOperacion', 'N');
    this.router.navigateByUrl("/home/seguridad/rol");
  } 

  public editRol() {
    if (!this.rolSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un rol', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'E');
    sessionStorage.setItem('rol', this.rolSelected.id);

    this.router.navigateByUrl("/home/seguridad/rol");
  }

  public viewRol() {
    if (!this.rolSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un rol', 'warning');
      return;
    }

    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('rol', this.rolSelected.id);

    this.router.navigateByUrl("/home/seguridad/rol");
  }

  public viewAplicaciones(): void {
    if (!this.rolSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un rol', 'warning');
      return;
    } 

    this.ref = this.dialogService.open(VerAplicacionRolComponent, {
      header: 'Aplicaciones Asociadas al Rol ' + this.rolSelected.name,
      width: '50%',
      contentStyle: {"overflow": "auto"},
      data: this.rolSelected
    });
  }

  public deleteRol(): void {
    if (!this.rolSelected) {
      swal.fire('Alerta!', 'Debe seleccionar un rol', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de eliminar este rol?',
      html: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        this.rolService.delete(this.rolSelected.id).subscribe(
          _data => {
            this.spinner.hide();
            this.rolList.forEach(a => {
              if (a.id == this.rolSelected.id) {
                this.rolList = this.rolList.filter(a => {
                  return a.id !== this.rolSelected.id;
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
    let worksheet = workbook.addWorksheet('Roles');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Listado de Roles']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Id', 'Descripción', 'Comentario', 'Rol Padre']);
    worksheet.columns = [{ width: 15 }, { width: 40 }, { width: 50 }, { width: 15 } ];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.rolList.forEach(rol => {
       worksheet.addRow([rol.id, rol.name, rol.comment, rol.idPadre]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Roles.xlsx');
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
