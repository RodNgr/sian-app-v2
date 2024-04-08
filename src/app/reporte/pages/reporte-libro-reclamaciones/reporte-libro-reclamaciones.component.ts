import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LibroReclamaciones } from '../../entity/libro-reclamaciones';
import { LibroReclamacionesService } from '../../services/libroreclamaciones.service';
import swal from 'sweetalert2';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { EmpresaService } from '../../../shared/services/empresa.service';

@Component({
  selector: 'app-reporte-libro-reclamaciones',
  templateUrl: './reporte-libro-reclamaciones.component.html',
  styleUrls: ['./reporte-libro-reclamaciones.component.css']
})
export class LibroReclamacionesComponent implements OnInit {
  public stbuscar:String='';
  public objAll: LibroReclamaciones[] = [];
  public obj: LibroReclamaciones[] = [];
  public reporteSelected!: LibroReclamaciones;
  public rangeDates: Date[] = [];
  bodetalle:boolean=false;
  public cantidadMap = {
    '=0': 'No existen registros',
    '=1': 'En total hay 1 registro',
    'other': 'En total hay # registros'
  }

  private pipe = new DatePipe("en-US");

  public isMobile: boolean = window.innerWidth < 641

  constructor(private spinner: NgxSpinnerService,
    private libroReclamacionesService: LibroReclamacionesService,
    private empresaService: EmpresaService) { }

  ngOnInit(): void {
    const feInicio = new Date();
    feInicio.setMonth(feInicio.getMonth() - 1);
    const feFin = new Date();

    this.rangeDates.push(feInicio);
    this.rangeDates.push(feFin);

    this.buscar();
  }

  filterList(): void {
    this.obj = this.objAll.filter(item => {
      // Convertir los valores de los campos a minúsculas para que la búsqueda sea insensible a mayúsculas y minúsculas
      const codigoMinusculas = item.codigo.toLowerCase();
      const nombreMinusculas = item.nombre.toLowerCase();
      const dniMinusculas = item.nrodoc.toLowerCase();
  
      // Concatenar los valores de los campos en una sola cadena para realizar la búsqueda
      const camposConcatenados = `${codigoMinusculas} ${nombreMinusculas} ${dniMinusculas}`;
  
      // Verificar si la cadena concatenada incluye el filtro
      return camposConcatenados.includes(this.stbuscar.toLowerCase());
    });
  }

  public buscar() {
    this.spinner.show();
    const desde = this.pipe.transform(this.rangeDates[0], "dd-MM-yyyy") || '';
    const hasta = this.pipe.transform(this.rangeDates[1], "dd-MM-yyyy") || '';

    this.libroReclamacionesService.get(this.empresaService.getEmpresaSeleccionada().idEmpresa, desde, hasta).subscribe(
      data => {
        this.objAll = data.respuesta;
        this.obj =this.objAll;
        this.filterList();
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener datos', 'error');
      }
    )
  }

  public detalleReporte(): void {
    if(this.reporteSelected !== undefined){
      this.bodetalle=true;
    }
  }

  public Regresar(): void {
    this.bodetalle=false;
  }

  downloadFile() {
    window.open(this.reporteSelected.nombrearchivo, '_blank');
    //this.libroReclamacionesService.downloadFile("Archivo", this.reporteSelected.nombrearchivo);
  }

  public exportXLS(): void {
    if (!this.obj || this.obj.length == 0) {
      swal.fire('Alerta!', 'No existen datos para exportar', 'warning');
      return;
    }

    this.spinner.show();

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Libro Reclamaciones');

    /* worksheet.addRow(["Codigo", "Nombre", "Doc.", "F.Reg", "Tienda", "Teléf.", "email", "Servicio", "Concepto"]); */
    worksheet.addRow([
      //"ID",
      "Marca",
      "Codigo",
      "Nombre",
      "Departamento",
      "Dirección",
      "Tipo Doc.",
      "N° Doc.",
      "Teléfono",
      "Email",
      "Datos Padres",
      "Bien del Contrato",
      "Monto Reclamado",
      "Motivo Reclamado",
      "Tienda",
      "Tipo",
      "Tipo de Alcance",
      "Numero de Pedido",
      "Nombre de Archivo",
      "Observaciones y Acciones",
      "Fecha"
    ]);
    /* worksheet.columns = [{ width: 15 }, { width: 40 }, { width: 15 }, { width: 15 }, { width: 40 }, { width: 15 }, { width: 30 }, { width: 15 }, { width: 15 }]; */
    worksheet.columns = [
      //{ width: 10 },   // ID
      { width: 15 },   // ID Marca
      { width: 15 },   // Codigo
      { width: 40 },   // Nombre
      { width: 40 },   // Departamento
      { width: 40 },   // Dirección
      { width: 20 },   // Tipo Docum
      { width: 20 },   // DNI
      { width: 20 },   // Teléfono
      { width: 40 },   // Email
      { width: 40 },   // Datos Padres
      { width: 20 },   // Bien del Contrato
      { width: 20 },   // Monto Reclamado
      { width: 40 },   // Motivo Reclamado
      { width: 40 },   // Tienda
      { width: 20 },   // Tipo
      { width: 20 },   // Tipo de Alcance
      { width: 20 },   // Numero de Pedido
      { width: 40 },   // Nombre de Archivo
      { width: 40 },   // Observaciones y Acciones
      { width: 15 },   // Fecha
    ];
    worksheet.getRow(1).eachCell(function (cell: Cell, _colNumber: number) {
      cell.border = { top: { style: 'thin', color: { argb: '000000' } }, left: { style: 'thin', color: { argb: '000000' } }, bottom: { style: 'thin', color: { argb: '000000' } }, right: { style: 'thin', color: { argb: '000000' } } };
      cell.font = { size: 8, bold: true, name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CCCCCC' } };
    });

    // Contenido del archivo
    let contador: number = 2;
    this.obj.forEach(obj => {
      worksheet.addRow([
      obj.marca,
      obj.codigo,
      obj.nombre,
      obj.departamento,
      obj.direccion,
      obj.tipodocumento,
      obj.nrodoc,
      obj.telefono,
      obj.email,
      obj.datospadres,
      obj.biendelcontrato,
      obj.montoreclamado,
      obj.motivoreclamado,
      obj.tienda,
      obj.tipo,
      obj.tipodealle,
      obj.numeropedido,
      { text: 'Descargar', hyperlink: obj.nombrearchivo },
      obj.observacionesyacciones,
      this.pipe.transform(obj.fecha, "dd/MM/yyyy HH:mm:ss") || ''
    ]);

    worksheet.getRow(contador).eachCell(function (cell: Cell, colNumber: number) {
      cell.border = { top: { style: 'thin', color: { argb: '000000' } }, left: { style: 'thin', color: { argb: '000000' } }, bottom: { style: 'thin', color: { argb: '000000' } }, right: { style: 'thin', color: { argb: '000000' } } };
      cell.font = { size: 8, name: 'Arial' };
    });

      contador++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'LibroReclamaciones_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });

    this.spinner.hide();
  }

  public exportXLSxRegistro(): void {
    if (!this.obj || this.obj.length == 0) {
      swal.fire('Alerta!', 'No existen datos para exportar', 'warning');
      return;
    }

    this.spinner.show();

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Libro Reclamaciones');

    worksheet.addRow([
      //"ID",
      "Marca",
      "Codigo",
      "Nombre",
      "Departamento",
      "Dirección",
      "Tipo Doc.",
      "N° Doc.",
      "Teléfono",
      "Email",
      "Datos Padres",
      "Bien del Contrato",
      "Monto Reclamado",
      "Motivo Reclamado",
      "Tienda",
      "Tipo",
      "Tipo de Alcance",
      "Numero de Pedido",
      "Nombre de Archivo",
      "Observaciones y Acciones",
      "Fecha"
    ]);
    worksheet.columns = [
      //{ width: 10 },   // ID
      { width: 15 },   // ID Marca
      { width: 15 },   // Codigo
      { width: 40 },   // Nombre
      { width: 40 },   // Departamento
      { width: 40 },   // Dirección
      { width: 20 },   // Tipo Docum
      { width: 20 },   // nrdoc
      { width: 20 },   // Teléfono
      { width: 40 },   // Email
      { width: 40 },   // Datos Padres
      { width: 20 },   // Bien del Contrato
      { width: 20 },   // Monto Reclamado
      { width: 40 },   // Motivo Reclamado
      { width: 40 },   // Tienda
      { width: 20 },   // Tipo
      { width: 20 },   // Tipo de Alcance
      { width: 20 },   // Numero de Pedido
      { width: 40 },   // Nombre de Archivo
      { width: 40 },   // Observaciones y Acciones
      { width: 15 },   // Fecha
    ];

    worksheet.getRow(1).eachCell(function (cell: Cell, _colNumber: number) {
      cell.border = { top: { style: 'thin', color: { argb: '000000' } }, left: { style: 'thin', color: { argb: '000000' } }, bottom: { style: 'thin', color: { argb: '000000' } }, right: { style: 'thin', color: { argb: '000000' } } };
      cell.font = { size: 8, bold: true, name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CCCCCC' } };
    });

    // Contenido del archivo
    /*  let contador: number = 2;
     this.obj.forEach(obj => {
       worksheet.addRow([obj.codigo.toUpperCase(),
       obj.nombre.toUpperCase(),
       obj.dni,
       this.pipe.transform(obj.fecha, "dd/MM/yyyy") || '',
       obj.tienda,
       obj.telefono,
       obj.email.toUpperCase(),
       obj.tipo,
       obj.biendelcontrato]);
 
       worksheet.getRow(contador).eachCell(function (cell: Cell, colNumber: number) {
         cell.border = { top: { style: 'thin', color: { argb: '000000' } }, left: { style: 'thin', color: { argb: '000000' } }, bottom: { style: 'thin', color: { argb: '000000' } }, right: { style: 'thin', color: { argb: '000000' } } };
         cell.font = { size: 8, name: 'Arial' };
       });
 
       contador++;
     })
  */
    worksheet.addRow([
      //this.reporteSelected.id,
      this.reporteSelected.marca,
      this.reporteSelected.codigo,
      this.reporteSelected.nombre,
      this.reporteSelected.departamento,
      this.reporteSelected.direccion,
      this.reporteSelected.tipodocumento,
      this.reporteSelected.nrodoc,
      this.reporteSelected.telefono,
      this.reporteSelected.email,
      this.reporteSelected.datospadres,
      this.reporteSelected.biendelcontrato,
      this.reporteSelected.montoreclamado,
      this.reporteSelected.motivoreclamado,
      this.reporteSelected.tienda,
      this.reporteSelected.tipo,
      this.reporteSelected.tipodealle,
      this.reporteSelected.numeropedido,
      { text: 'Descargar', hyperlink: this.reporteSelected.nombrearchivo },
      this.reporteSelected.observacionesyacciones,
      this.pipe.transform(this.reporteSelected.fecha, "dd/MM/yyyy HH:mm:ss") || ''
    ]);

    worksheet.getRow(2).eachCell(function (cell: Cell, colNumber: number) {
      cell.border = { top: { style: 'thin', color: { argb: '000000' } }, left: { style: 'thin', color: { argb: '000000' } }, bottom: { style: 'thin', color: { argb: '000000' } }, right: { style: 'thin', color: { argb: '000000' } } };
      cell.font = { size: 8, name: 'Arial' };
    });


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'LibroReclamaciones_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });

    this.spinner.hide();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.isMobile = window.innerWidth < 641;
  }

}
