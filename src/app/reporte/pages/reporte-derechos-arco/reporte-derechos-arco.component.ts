import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DerechosArco } from '../../entity/derechos-arco';
import { DerechosArcoService } from '../../services/derechosarco.service';
import swal from 'sweetalert2';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { EmpresaService } from '../../../shared/services/empresa.service';

@Component({
  selector: 'app-reporte-derechos-arco',
  templateUrl: './reporte-derechos-arco.component.html',
  styleUrls: ['./reporte-derechos-arco.component.css']
})
export class DerechosArcoComponent implements OnInit {
  public stbuscar:String='';
  public objAll: DerechosArco[] = [];
  public obj: DerechosArco[] = [];
  public reporteSelected!: DerechosArco;
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
    private derechosArcoService: DerechosArcoService,
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
      const nombreMinusculas = item.nombres.toLowerCase();
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

    this.derechosArcoService.get(this.empresaService.getEmpresaSeleccionada().idEmpresa, desde, hasta).subscribe(
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

  nombrearchivodoc_downloadFile() {
    window.open(this.reporteSelected.nombrearchivodoc, '_blank');
    //this.libroReclamacionesService.downloadFile("Archivo", this.reporteSelected.nombrearchivo);
  }

  nombrearchivodocrl_downloadFile() {
    window.open(this.reporteSelected.nombrearchivodocrl, '_blank');
  }

  nombrearchivodocrlacreditacion_downloadFile() {
    window.open(this.reporteSelected.nombrearchivodocrlacreditacion, '_blank');
  }

  nombrearchivosolicitud_downloadFile() {
    window.open(this.reporteSelected.nombrearchivosolicitud, '_blank');
  }

  public exportXLS(): void {
    if (!this.obj || this.obj.length == 0) {
      swal.fire('Alerta!', 'No existen datos para exportar', 'warning');
      return;
    }

    this.spinner.show();

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Derechos Arco');

    /* worksheet.addRow(["Codigo", "Nombre", "Doc.", "F.Reg", "Tienda", "Teléf.", "email", "Servicio", "Concepto"]); */
    worksheet.addRow([
      //"ID",
      "Marca",
      "Codigo",
      "Nombres",
      "Apellidos",
      "Tipo Doc.",
      "N° Doc.",
      "Email",
      "Nombre de Archivo Doc",
      "Fecha",
      "Tipo Solicitud",
      "Tipo Usuario",
      "Domicilio",
      "Representante Legal",
      "Nombres R.L.",
      "Apellidos R.L.",
      "Tipo Documento R.L",
      "Nro doc R.L.",
      "Nombre de Archivo Doc R.L.",
      "Nombre de Archivo Doc R.L. Acreditacion",
      "Solicitud Detalle",
      "Nombre de Archivo Solicitud"
    ]);
    /* worksheet.columns = [{ width: 15 }, { width: 40 }, { width: 15 }, { width: 15 }, { width: 40 }, { width: 15 }, { width: 30 }, { width: 15 }, { width: 15 }]; */
    worksheet.columns = [
      //{ width: 10 },   // ID
      { width: 15 },   // ID Marca
      { width: 15 },   // Codigo
      { width: 40 },   // Nombres
      { width: 40 },   // Apellidos
      { width: 20 },   // Tipo Docum
      { width: 20 },   // DNI
      { width: 40 },   // Email
      { width: 40 },   // Nombre de Archivo
      { width: 15 },   // Fecha
      { width: 20 },   // tiposolicitud
      { width: 20 },   // tipousuario
      { width: 20 },   // domicilio
      { width: 20 },   // esrepresentantelegal
      { width: 20 },   // nombresrl
      { width: 20 },   // apellidosrl
      { width: 20 },   // tipodocumentorl
      { width: 20 },   // nrodocrl
      { width: 20 },   // nombrearchivodocrl
      { width: 20 },   // nombrearchivodocrlacreditacion
      { width: 20 },   // solicituddetalle
      { width: 20 },   // nombrearchivosolicitud
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
      obj.nombres,
      obj.apellidos,
      obj.tipodocumento,
      obj.nrodoc,
      obj.email,
      { text: 'Descargar', hyperlink: obj.nombrearchivodoc },
      this.pipe.transform(obj.fecha, "dd/MM/yyyy HH:mm:ss") || '',
      obj.tiposolicitud,
      obj.tipousuario,
      obj.domicilio,
      obj.esrepresentantelegal,
      obj.nombresrl,
      obj.apellidosrl,
      obj.tipodocumentorl,
      obj.nrodocrl,
      (obj.nombrearchivodocrl=="")?"":{ text: 'Descargar', hyperlink: obj.nombrearchivodocrl },
      (obj.nombrearchivodocrlacreditacion=="")?"":{ text: 'Descargar', hyperlink: obj.nombrearchivodocrlacreditacion },
      obj.solicituddetalle,
      (obj.nombrearchivosolicitud=="")?"":{ text: 'Descargar', hyperlink: obj.nombrearchivosolicitud }
    ]);

    worksheet.getRow(contador).eachCell(function (cell: Cell, colNumber: number) {
      cell.border = { top: { style: 'thin', color: { argb: '000000' } }, left: { style: 'thin', color: { argb: '000000' } }, bottom: { style: 'thin', color: { argb: '000000' } }, right: { style: 'thin', color: { argb: '000000' } } };
      cell.font = { size: 8, name: 'Arial' };
    });

      contador++;
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'DerechosArco_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
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
    let worksheet = workbook.addWorksheet('Derechos Arco');

    worksheet.addRow([
      //"ID",
      "Marca",
      "Codigo",
      "Nombres",
      "Apellidos",
      "Tipo Doc.",
      "N° Doc.",
      "Email",
      "Nombre de Archivo",
      "Fecha",
      "Tipo Solicitud",
      "Tipo Usuario",
      "Domicilio",
      "Representante Legal",
      "Nombres R.L.",
      "Apellidos R.L.",
      "Tipo Documento R.L",
      "Nro doc R.L.",
      "Nombre de Archivo Doc R.L.",
      "Nombre de Archivo Doc R.L. Acreditacion",
      "Solicitud Detalle",
      "Nombre de Archivo Solicitud"
    ]);
    worksheet.columns = [
      //{ width: 10 },   // ID
      { width: 15 },   // ID Marca
      { width: 15 },   // Codigo
      { width: 40 },   // Nombres
      { width: 40 },   // Apellidos
      { width: 20 },   // Tipo Docum
      { width: 20 },   // nrdoc
      { width: 40 },   // Email
      { width: 40 },   // Nombre de Archivo
      { width: 15 },   // Fecha
      { width: 20 },   // tiposolicitud
      { width: 20 },   // tipousuario
      { width: 20 },   // domicilio
      { width: 20 },   // esrepresentantelegal
      { width: 20 },   // nombresrl
      { width: 20 },   // apellidosrl
      { width: 20 },   // tipodocumentorl
      { width: 20 },   // nrodocrl
      { width: 20 },   // nombrearchivodocrl
      { width: 20 },   // nombrearchivodocrlacreditacion
      { width: 20 },   // solicituddetalle
      { width: 20 },   // nombrearchivosolicitud
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
      this.reporteSelected.nombres,
      this.reporteSelected.apellidos,
      this.reporteSelected.tipodocumento,
      this.reporteSelected.nrodoc,
      this.reporteSelected.email,
      { text: 'Descargar', hyperlink: this.reporteSelected.nombrearchivodoc },
      this.pipe.transform(this.reporteSelected.fecha, "dd/MM/yyyy HH:mm:ss") || '',
      this.reporteSelected.tiposolicitud,
      this.reporteSelected.tipousuario,
      this.reporteSelected.domicilio,
      this.reporteSelected.esrepresentantelegal,
      this.reporteSelected.nombresrl,
      this.reporteSelected.apellidosrl,
      this.reporteSelected.tipodocumentorl,
      this.reporteSelected.nrodocrl,
      (this.reporteSelected.nombrearchivodocrl=="")?"":{ text: 'Descargar', hyperlink: this.reporteSelected.nombrearchivodocrl },
      (this.reporteSelected.nombrearchivodocrlacreditacion=="")?"":{ text: 'Descargar', hyperlink: this.reporteSelected.nombrearchivodocrlacreditacion },
      this.reporteSelected.solicituddetalle,
      (this.reporteSelected.nombrearchivosolicitud=="")?"":{ text: 'Descargar', hyperlink: this.reporteSelected.nombrearchivosolicitud }
    ]);

    worksheet.getRow(2).eachCell(function (cell: Cell, colNumber: number) {
      cell.border = { top: { style: 'thin', color: { argb: '000000' } }, left: { style: 'thin', color: { argb: '000000' } }, bottom: { style: 'thin', color: { argb: '000000' } }, right: { style: 'thin', color: { argb: '000000' } } };
      cell.font = { size: 8, name: 'Arial' };
    });


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'DerechosArco_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });

    this.spinner.hide();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.isMobile = window.innerWidth < 641;
  }

}
