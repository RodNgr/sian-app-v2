import { Component, OnInit } from '@angular/core';
import { EjecutarService } from '../../services/ejecutar.service';
import { Tienda } from '../../entity/tienda';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { ParamDto } from '../../dto/param-dto';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';

interface Tipo {
  codigo: string,
  descripcion: string
}

interface BaseDatos {
  codigo: string,
  descripcion: string
}

@Component({
  selector: 'app-ejecutar-consulta',
  templateUrl: './ejecutar-consulta.component.html',
  styleUrls: ['./ejecutar-consulta.component.css']
})
export class EjecutarConsultaComponent implements OnInit {

  public tipoList: Tipo[] = [{codigo: 'C', descripcion: 'Consulta'}, {codigo: 'T', descripcion: 'Transacción'}];

  public baseDatosList: BaseDatos[] = [{codigo: 'M', descripcion: 'MySQL'}, {codigo: 'S', descripcion: 'SyBase'}];

  public tipoSeleccionado: Tipo = {codigo: 'C', descripcion: 'Consulta'};

  public baseDatosSeleccionada: BaseDatos = {codigo: 'M', descripcion: 'MySQL'};

  public tiendaList: Tienda[] = [];

  public tiendasSeleccionadas: Tienda[] = [];

  public usuario!: string;

  public password!: string;

  public sql!: string;

  //public resultadoDto: ResultadoDto = new ResultadoDto();

  constructor(private spinner: NgxSpinnerService,
              private ejecutarService: EjecutarService) { }

  ngOnInit(): void {
    this.spinner.show();

    this.ejecutarService.getAll().subscribe(
      tiendaList => {
        this.tiendaList = tiendaList;
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener el listado de tiendas', 'error');
      }
    )
  }

  public ejecutar() {
    if (!this.tiendasSeleccionadas) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos una tienda', 'warning');
      return;
    }

    if (this.tiendasSeleccionadas.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos una tienda', 'warning');
      return;
    }

    if (!this.sql) {
      swal.fire('Advertencia!', 'Debe ingresar la sentencia sql', 'warning');
      return;
    }

    let dto: ParamDto = new ParamDto();
    dto.tiendaList = this.tiendasSeleccionadas;
    //dto.sql = this.sql;

    if (this.tipoSeleccionado.codigo === 'C') {
      this.ejecutarConsulta(dto);
    } else {
      this.ejecutarTransaccion(dto);
    }
  }

  private ejecutarConsulta(dto: ParamDto) {
    /*
    this.spinner.show();

    if (this.baseDatosSeleccionada.codigo === 'M') {
      this.ejecutarService.ejecutarConsultaMySql(dto).subscribe(
        response => {
          this.resultadoDto = response.resultadoDto;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
        }
      )
    } else {
      this.ejecutarService.ejecutarConsultaSybase(dto).subscribe(
        response => {
          this.resultadoDto = response.resultadoDto;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
        }
      )
    }
    */
  }

  private ejecutarTransaccion(dto: ParamDto) {
    /*
    this.spinner.show();
    if (this.baseDatosSeleccionada.codigo === 'M') {
      this.ejecutarService.ejecutarTransaccionMySql(dto).subscribe(
        response => {
          this.resultadoDto = response.resultadoDto;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al procesar la solicitud', 'error');
        }
      );
    } else {
      this.ejecutarService.ejecutarTransaccionSybase(dto).subscribe(
        response => {
          this.resultadoDto = response.resultadoDto;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al procesar la solicitud', 'error');
        }
      );
    }
    */
  }

  public exportarResultado() {
    /*
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Informacion');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Información']);
    worksheet.addRow(['']);
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

    // Script ejecutado:
    worksheet.addRow(['Script ejecutado:', this.sql]);
    worksheet.addRow(['']);

    // Título de la tabla
    worksheet.addRow(this.resultadoDto.columnNames);

    worksheet.getRow(6).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 7
    this.resultadoDto.valores.forEach(valor => {
       worksheet.addRow(valor.data);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Resultado.xlsx');
    });
    */
  }

  public exportarTienda() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Tiendas No Procesadas');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Tiendas No Procesadas']);
    worksheet.addRow(['']);
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    worksheet.addRow(['IP', 'Tienda', 'Mensaje']);
    worksheet.columns = [{ width: 12 }, { width: 38 }, { width: 120 }];
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    // Contenido del archivo
    let contador: number = 5
    /*
    this.resultadoDto.tiendaSinConexionList.forEach(tienda => {
       worksheet.addRow([tienda.ipTienda, tienda.nombre, tienda.mensaje]);

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
     */
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TiendasNoProcesadas.xlsx');
    });
  }

}
