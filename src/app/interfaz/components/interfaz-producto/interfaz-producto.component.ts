import { Component, HostListener, OnInit } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from '../../../auth/services/auth.service';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { InterfazProductoService } from '../../services/interfaz-producto.service';

import { FindCategoriaSapComponent } from '../find-categoria-sap/find-categoria-sap.component';
import { FindJerarquiaComponent } from '../find-jerarquia/find-jerarquia.component';

import { DatePipe } from '@angular/common';

import { CategoriaSap } from '../../entity/categoria-sap';
import { Cell, Workbook } from 'exceljs';
import { Empresa } from '../../../shared/entity/empresa';
import { ProductoPixel } from '../../entity/producto-pixel';
import { ProductoSap } from '../../entity/producto-sap';
import { SeleccionarFamiliaDto } from '../../dto/seleccionar-familia-dto';
import { TransferenciaArticuloDto } from '../../dto/transferencia-articulo-dto';

import swal from 'sweetalert2';

import * as fs from 'file-saver';

@Component({
  selector: 'app-interfaz-producto',
  templateUrl: './interfaz-producto.component.html',
  styleUrls: ['./interfaz-producto.component.css']
})
export class InterfazProductoComponent implements OnInit {

  public productoPixelList: ProductoPixel[] = [];

  public productoSapList: ProductoSap[] = [];

  public productosPixelSeleccionados: ProductoPixel[] = [];

  public fechaSeleccionada: Date = new Date();

  private pipe = new DatePipe("en-US");

  public isMobile: boolean = window.innerWidth < 641

  private ref!: DynamicDialogRef;

  constructor(private spinner: NgxSpinnerService,
              private interfazProductoService: InterfazProductoService,
              public empresaService: EmpresaService,
              private authService: AuthService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  public buscar(): void {
    this.spinner.show();
    this.clearInformacion();

    const fecha = this.pipe.transform(this.fechaSeleccionada, "yyyyMMdd") || ''; 

    this.interfazProductoService.findProductoPixel(fecha).subscribe(
      productoPixelList => {
        this.productoPixelList = productoPixelList;

        this.productoPixelList.forEach(p => {
          let categoriaSap: CategoriaSap = new CategoriaSap();

          if (this.empresaService.getEmpresaSeleccionada().idEmpresa === 2) {
            categoriaSap.matkl = "600100";
            categoriaSap.wgbez = "Ventas BEM";
            categoriaSap.wgbez60 = ""
          } else if (this.empresaService.getEmpresaSeleccionada().idEmpresa === 3) {
            categoriaSap.matkl = "600300";
            categoriaSap.wgbez = "Ventas DBE";
            categoriaSap.wgbez60 = ""
          } else if (this.empresaService.getEmpresaSeleccionada().idEmpresa === 4) {
            categoriaSap.matkl = "600400";
            categoriaSap.wgbez = "Ventas POP";
            categoriaSap.wgbez60 = ""
          } else if (this.empresaService.getEmpresaSeleccionada().idEmpresa === 5) {
            categoriaSap.matkl = "600200";
            categoriaSap.wgbez = "Ventas CHW";
            categoriaSap.wgbez60 = ""
          } else if (this.empresaService.getEmpresaSeleccionada().idEmpresa === 7) {
            categoriaSap.matkl = "600500";
            categoriaSap.wgbez = "Ventas PPJ";
            categoriaSap.wgbez60 = ""
          } else {
            categoriaSap.matkl = "600600";
            categoriaSap.wgbez = "Ventas DDS";
            categoriaSap.wgbez60 = ""
          }

          p.categoriaSap = categoriaSap;
          p.categoria = categoriaSap.wgbez;
        });

        this.spinner.hide();
      }, 
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al buscar el artículo', 'error');
      }
    )
  }

  public transferir(): void {
    if (!this.validaInformacion()) {
      return;
    }

    let message: string = 'Solo se va a transferir al SAP aquellos artículos que tengan la siguiente informacion completa:<br>';
    message += '- Código Pixel<br>';
    message += '- Descripción<br>';
    message += '- Precio<br>';
    message += '- Categoría<br>';
    message += '- Familia<br>';
    message += '<br>¿Esta seguro que desea continuar con el proceso de transferencia?';

    swal.fire({
      title: 'Información',
      html: message,
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        let dto: TransferenciaArticuloDto = new TransferenciaArticuloDto();

        const empresa = this.empresaService.getEmpresaSeleccionada();
        dto.idEmpresa = empresa.idEmpresa;
        dto.idEmpresaSap = Number(empresa.codSap);
        dto.marcaAbreviatura = empresa.abreviatura;
        dto.usuario = this.authService.usuario.username;
        dto.articulosPixel = this.productosPixelSeleccionados;

        this.spinner.show();
        this.interfazProductoService.transferir(dto).subscribe(
          productosSap => {
            this.productoSapList = productosSap;

            if (this.productoSapList.length > 0) { 
              this.exportExcel(empresa);

              this.productoPixelList = [];
              this.productosPixelSeleccionados = [];
              
              this.spinner.hide();
              swal.fire('Éxito!', 'Artículos transferidos exitosamente', 'success');
            } else {
              this.spinner.hide();
              swal.fire('Alerta!', 'No se transfirió ningún artículo', 'warning');
            }
          },
          err => {
            this.spinner.hide();
            swal.fire(err.error.mensaje, err.error.error, 'error');
          }
        );
      }
    });
  }

  private exportExcel(empresa: Empresa) {
    const fecha = this.pipe.transform(new Date(), 'yyyyMMdd');

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Resultado');

    // Título del archivo
    worksheet.addRow(['']);
    worksheet.addRow(['Reporte Materiales SAP']);
    worksheet.addRow(['']);

    if (empresa.idEmpresa === 8) {
      worksheet.mergeCells('A2:P2');
    } else {
      worksheet.mergeCells('A2:N2');
    }
    worksheet.getCell('A2').font = { size: 12, bold: true,  name: 'Arial' };
    worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Título de la tabla
    if (empresa.idEmpresa === 8) {
      worksheet.addRow(['Estado', 'Código Pixel', 'Código SAP', 'Nombre artículo', 'Empresa', 'Categoría', 'Tipo Consumo', 'Familia', 'Sub Familia 1', 
                        'Sub Familia 2', 'Sub Familia 3', 'Sub Familia 4', 'IdEmpresa', 'Observación', 'Cant. Clásicas', 'Cant. Premium']);
      worksheet.columns = [{ width: 7 }, { width: 13 }, { width: 13 }, { width: 32 }, { width: 8 }, { width: 9 }, { width: 18 }, { width: 18 }, { width: 18 }, 
                           { width: 18 },  { width: 18 }, { width: 18 }, { width: 9 }, { width: 27 }, { width: 12 }, { width: 12 }];
    } else {
      worksheet.addRow(['Estado', 'Código Pixel', 'Código SAP', 'Nombre artículo', 'Empresa', 'Categoría', 'Tipo Consumo', 'Familia', 'Sub Familia 1', 
                        'Sub Familia 2', 'Sub Familia 3', 'Sub Familia 4', 'IdEmpresa', 'Observación']);
      worksheet.columns = [{ width: 7 }, { width: 13 }, { width: 13 }, { width: 32 }, { width: 8 }, { width: 9 }, { width: 18 }, { width: 18 }, { width: 18 }, 
                           { width: 18 },  { width: 18 }, { width: 18 }, { width: 9 }, { width: 27 }];
    }
    
    worksheet.getRow(4).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });
    
    let contador: number = 5
    this.productoSapList.forEach(sap => {
      if (empresa.idEmpresa === 8) {
        worksheet.addRow([sap.statusR, sap.coPixel, sap.coSap, sap.dePixel, sap.idEmpresaSap, sap.coCategoriaSap, sap.tipoConsumo.descripcion,
                          sap.familia.descripcion, sap.subFamilia1?.descripcion, sap.subFamilia2?.descripcion, sap.subFamilia3?.descripcion, 
                          sap.subFamilia4?.descripcion, '0', sap.message, sap.clasica, sap.premium]);
      } else {
        worksheet.addRow([sap.statusR, sap.coPixel, sap.coSap, sap.dePixel, sap.idEmpresaSap, sap.coCategoriaSap, sap.tipoConsumo.descripcion,
          sap.familia.descripcion, sap.subFamilia1?.descripcion, sap.subFamilia2?.descripcion, sap.subFamilia3?.descripcion, 
          sap.subFamilia4?.descripcion, '0', sap.message]);
      }

       worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

       contador++;
     })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TablaMaterialSAP_' + fecha + '.xlsx');
    });
  }

  private clearInformacion(): void {
    this.productoPixelList = [];
    this.productoSapList = [];
    this.productosPixelSeleccionados = [];
  }

  private validaInformacion(): boolean {
    if (this.productoPixelList.length === 0) {
      swal.fire('Advertencia!', 'No existen artículos para realizar la transferencia', 'warning');
      return false;
    }

    if (this.productosPixelSeleccionados.length === 0) {
      swal.fire('Advertencia!', 'No ha seleccionado artículos para transferencia', 'warning');
      return false;
    }

    let valid: boolean = true;
    this.productosPixelSeleccionados.forEach(prod => {
      if (prod.categoriaSap === null || prod.categoriaSap === undefined) {
        swal.fire('Advertencia!', 'Falto seleccionar una categoría para el artículo: ' + prod.descript, 'warning');
        valid = false;
      }

      if (prod.tipoConsumo === null || prod.tipoConsumo === undefined) {
        swal.fire('Advertencia!', 'Falto seleccionar la familia del artículo: ' + prod.descript, 'warning');
        valid = false;
      }
    });

    return valid;
  }

  public seleccionarFamilia(productoPixel: ProductoPixel): void {
    this.ref = this.dialogService.open(FindJerarquiaComponent, {
      header: 'Asignar Familia',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      data: {editarDescripcion: false, descripcion: productoPixel.descript, clasica: 0, premium: 0}
    });

    this.ref.onClose.subscribe((jerarquia: SeleccionarFamiliaDto) => {
      if (jerarquia) {
        let desJerarquia: string;

        productoPixel.tipoConsumo = jerarquia.tipoConsumo;
        productoPixel.familia = jerarquia.familia;
        desJerarquia = jerarquia.familia.descripcion;
        
        if (jerarquia.subFamilia1.id) {
          productoPixel.subFamilia1 = jerarquia.subFamilia1;
          desJerarquia +=  ' -> ' + jerarquia.subFamilia1.descripcion;
        }

        if (jerarquia.subFamilia2.id) {
          productoPixel.subFamilia2 = jerarquia.subFamilia2;
          desJerarquia +=  ' -> ' + jerarquia.subFamilia2.descripcion;
        }

        if (jerarquia.subFamilia3.id) {
          productoPixel.subFamilia3 = jerarquia.subFamilia3;
          desJerarquia +=  ' -> ' + jerarquia.subFamilia3.descripcion;
        }

        if (jerarquia.subFamilia4.id) {
          productoPixel.subFamilia4 = jerarquia.subFamilia4;
          desJerarquia +=  ' -> ' + jerarquia.subFamilia4.descripcion;
        }

        productoPixel.jerarquia = desJerarquia;
        productoPixel.clasica = jerarquia.clasica;
        productoPixel.premium = jerarquia.premium;
      }
    });
  }

  public seleccionarCategoriaSap(): void {
    if (this.productoPixelList.length === 0) {
      swal.fire('Advertencia!', 'No existen artículos', 'warning');
      return;
    }
    
    if (this.productosPixelSeleccionados.length === 0) {
      swal.fire('Advertencia!', 'Debe seleccionar por lo menos un artículo', 'warning');
      return;
    }

    this.ref = this.dialogService.open(FindCategoriaSapComponent, {
      header: 'Buscar Categoría SAP',
      width: '40%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"}
    });

    this.ref.onClose.subscribe((categoriaSap: CategoriaSap) => {
      if (categoriaSap) {
        this.productosPixelSeleccionados.forEach(producto => {
          producto.categoriaSap = categoriaSap;
          producto.categoria = categoriaSap.wgbez;
        })
      }
    });
  }

  public limpiarCategoriaSap(): void {
    this.productosPixelSeleccionados.forEach(producto => {
      producto.categoriaSap = new CategoriaSap();
      producto.categoria = '';
    })
  }

  public asignarFamilia(): void {
    if (this.productosPixelSeleccionados.length === 0) {
      swal.fire('Advertencia!', 'No existen artículos seleccionados', 'warning');
      return;
    }

    this.ref = this.dialogService.open(FindJerarquiaComponent, {
      header: 'Asignar Familia',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      data: {editarDescripcion: false, descripcion: '', clasica: 0, premium: 0}
    });

    this.ref.onClose.subscribe((jerarquia: SeleccionarFamiliaDto) => {
      if (jerarquia) {
        this.productosPixelSeleccionados.forEach(producto => {
          let desJerarquia: string = '';

          producto.tipoConsumo = jerarquia.tipoConsumo;
          producto.familia = jerarquia.familia;
          desJerarquia = jerarquia.familia.descripcion;
          
          if (jerarquia.subFamilia1.id) {
            producto.subFamilia1 = jerarquia.subFamilia1;
            desJerarquia +=  ' -> ' + jerarquia.subFamilia1.descripcion;
          }
  
          if (jerarquia.subFamilia2.id) {
            producto.subFamilia2 = jerarquia.subFamilia2;
            desJerarquia +=  ' -> ' + jerarquia.subFamilia2.descripcion;
          }
  
          if (jerarquia.subFamilia3.id) {
            producto.subFamilia3 = jerarquia.subFamilia3;
            desJerarquia +=  ' -> ' + jerarquia.subFamilia3.descripcion;
          }
  
          if (jerarquia.subFamilia4.id) {
            producto.subFamilia4 = jerarquia.subFamilia4;
            desJerarquia +=  ' -> ' + jerarquia.subFamilia4.descripcion;
          }
  
          producto.jerarquia = desJerarquia;
          producto.clasica = jerarquia.clasica;
          producto.premium = jerarquia.premium;
        })        
      }
    });
  }

  public exportar() {
    if (this.productoPixelList.length === 0) {
      swal.fire('Alerta!', 'No existe información para exportar', 'warning');
      return;
    }

    this.spinner.show();

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Productos');

    worksheet.addRow(["Cód. Pixel", "Descripción", "Precio", "F.Vigencia"]);
    worksheet.columns = [{ width: 10 }, { width: 30 }, { width: 10 }, { width: 10 }];
    
    worksheet.getRow(1).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    let contador: number = 2;
    this.productoPixelList.forEach(producto => {
      worksheet.addRow([producto.prodNum, producto.descript, producto.priceA, producto.rangeStart]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      contador++;
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Productos_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });

    this.spinner.hide();
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.destroy();
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
