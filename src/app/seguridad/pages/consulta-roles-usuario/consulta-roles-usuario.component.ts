import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../shared/entity/usuario';
import { UsuarioRolDto } from '../../dto/usuario-rol-dto';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BuscarUsuarioComponent } from '../../components/buscar-usuario/buscar-usuario.component';
import { UsuarioService } from '../../services/usuario.service';
import swal from 'sweetalert2';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-consulta-roles-usuario',
  templateUrl: './consulta-roles-usuario.component.html',
  styleUrls: ['./consulta-roles-usuario.component.css']
})
export class ConsultaRolesUsuarioComponent implements OnInit {

  public usuario: Usuario = new Usuario();

  public usuarioRolDtoList: UsuarioRolDto[] = [];

  private ref!: DynamicDialogRef;

  public rowGroupMetadata: any;

  constructor(public spinner: NgxSpinnerService,
              private usuarioService: UsuarioService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  public buscar(): void {
    this.ref = this.dialogService.open(BuscarUsuarioComponent, {
      header: 'Búsqueda de usuarios',
      width: '60%',
      contentStyle: {"overflow": "auto"}
    });

    this.ref.onClose.subscribe((u: Usuario) => {
      if (u) {
        this.usuario = u;

        this.spinner.show();
        this.usuarioService.getRolesPorUsuario(this.usuario.codigo).subscribe(
          dto => {
            this.usuarioRolDtoList = dto;
            this.updateRowGroupMetaData();
            this.spinner.hide();
          },
          _err => {
            swal.fire('Error', 'Problemas al obtener la información', 'error');
            this.spinner.hide();
          }
        );
      }
    });
  }

  private updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.usuarioRolDtoList) {
      for (let i = 0; i < this.usuarioRolDtoList.length; i++) {
        let rowData = this.usuarioRolDtoList[i];
        let applicationName = rowData.applicationName;
        
        if (i == 0) {
          this.rowGroupMetadata[applicationName] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.usuarioRolDtoList[i - 1];
          let previousRowGroup = previousRowData.applicationName;
          if (applicationName === previousRowGroup) {
            this.rowGroupMetadata[applicationName].size++;
          } else {
            this.rowGroupMetadata[applicationName] = { index: i, size: 1 };
          }
        }
      }
    }
  }

  public exportList(): void {
    if (!this.usuario) {
      swal.fire('Advertencia!', 'Debe seleccionar un usuario', 'warning');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Roles');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Roles del Usuario: ' + this.usuario.shortName]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['Aplicación', 'Rol', 'Id Rol', 'Id Rol Padre']);
    worksheet.columns = [{ width: 15 }, { width: 55 }, { width: 40 }, { width: 40 } ];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    this.usuarioRolDtoList.forEach(info => {
       worksheet.addRow([info.applicationName, info.rol.name, info.rol.id, info.rol.idPadre]);

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

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.destroy();
    }
  }

}
