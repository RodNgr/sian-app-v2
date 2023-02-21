import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { ValeService } from '../../services/vale.service';

import { DatePipe, DecimalPipe, formatDate } from '@angular/common';

import { Cell, Workbook } from 'exceljs';
import { ValeDto } from '../../dto/vale-dto';

import swal from 'sweetalert2';

import * as fs from 'file-saver';
import { AuthService } from '../../../auth/services/auth.service';
import { error } from 'console';
import { toString } from '../../../shared/util/utils';

interface TipoBusqueda {
  codigo: string;
  descripcion: string;
}

@Component({
  selector: 'app-consulta-vales',
  templateUrl: './consulta-vales.component.html',
  styleUrls: ['./consulta-vales.component.css']
})
export class ConsultaValesComponent implements OnInit {

  public valeList: ValeDto[] = [];

  public tipoList: TipoBusqueda[] = [{codigo: 'V', descripcion: 'Código de Barra'}, 
                                     {codigo: 'D', descripcion: 'Doc. Cobranza'}, 
                                     {codigo: 'B', descripcion: 'ID Bolsa'},
                                     {codigo: 'F', descripcion: 'Rango de Fecha'}];

  public tipoSelected: TipoBusqueda = {codigo: 'V', descripcion: 'Código de Barra'};

  public tipoValeList: TipoBusqueda[] = [{codigo: 'P', descripcion: 'Corporativo'},
                                         {codigo: 'D', descripcion: 'Entel'},
                                         {codigo: 'B', descripcion: 'Cortesía'}];

  public tipoValeSelected: TipoBusqueda = {codigo: 'P', descripcion: 'Corporativo'};

  public rangeDates: Date[] = [];

  public bolsa!: string;

  public documento!: string;

  public codigos: string[] = []

  public cantidadMap = {
    '=0': 'No existen vales',
    '=1': 'En total hay 1 vale',
    'other': 'En total hay # vales'
  }

  private pipe = new DatePipe("en-US");

  private numberPipe = new DecimalPipe("en-US");

  public isMobile: boolean = window.innerWidth < 641

  public vhasta: Date = new Date();

  constructor(public authService : AuthService,
              private spinner: NgxSpinnerService,
              private valeService: ValeService) { }

  ngOnInit(): void {
    this.rangeDates[0] =  new Date();
    this.rangeDates[1] =  new Date();
    console.log(this.authService.usuario.roles);
  }

  public buscar() {
    if (this.tipoSelected.codigo === 'B') {
      if (!this.bolsa) {
        swal.fire('Advertencia!', 'Debe ingresar el documento', 'warning');
        return;
      }

      this.spinner.show();
      this.valeService.getValesPorBolsa(this.bolsa).subscribe(
        valeList => {
          this.valeList = valeList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al obtener la información', 'error');
        }
      );
    } else if (this.tipoSelected.codigo === 'D') {
      if (!this.documento) {
        swal.fire('Advertencia!', 'Debe ingresar el documento', 'warning');
        return;
      }

      this.spinner.show();
      this.valeService.getValesPorDocumento(this.documento).subscribe(
        valeList => {
          this.valeList = valeList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al obtener la información', 'error');
        }
      );
    } else if (this.tipoSelected.codigo === 'F' ) {
      if (!this.rangeDates[0]) {
        swal.fire('Advertencia!', 'Debe ingresar la fecha de inicio', 'warning');
        return;
      }

      if (!this.rangeDates[1]) {
        swal.fire('Advertencia!', 'Debe ingresar la fecha de fin', 'warning');
        return;
      }

      const inicio = this.pipe.transform(this.rangeDates[0], 'yyyyMMdd') || '';
      const fin = this.pipe.transform(this.rangeDates[1], 'yyyyMMdd') || '';

      this.spinner.show();
      this.valeService.getValesPorFecha(this.tipoValeSelected.codigo, inicio, fin).subscribe(
        valeList => {
          console.log(valeList);
          this.valeList = valeList;
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al obtener la información', 'error');
        }
      );
    } else {
      if (!this.codigos || this.codigos.length === 0) {
        swal.fire('Advertencia!', 'Debe ingresar por lo menos un código de barras', 'warning');
        return;
      }

      const promiseList:Observable<ValeDto[]>[] = [];

      this.codigos.forEach(codigo => {
        promiseList.push(this.valeService.getValesPorBarra(codigo));
      });

      this.spinner.show();
      this.valeList = [];
      forkJoin(promiseList).subscribe(
        vales => {
          vales.forEach(valeList => {
            this.valeList.push(...valeList);
          });
          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al obtener la información', 'error');
        }
      );
    }
  }

  public exportXLS() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Vales');

    worksheet.addRow(["Año", "Marca", "Id Bolsa", "Doc.Cobranza", "Tipo Vale", "Bolsa", "Inicio Vigencia", "Fin Vigencia", "Cod. Barra", 
                      "Total", "Id Tienda", "Tienda", "Fecha Uso", "Redimido", "Anulado", "Empresa", "Canal"]);

    worksheet.columns = [{ width: 6 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 20 }, { width: 25 }, { width: 25 }, { width: 25 }, 
                         { width: 25 }, { width: 10 }, { width: 15 }, { width: 30 }, { width: 15 }, { width: 10 }, { width: 10 }, { width: 40 }, 
                         { width: 12 }];
    
    worksheet.getRow(1).eachCell(function(cell: Cell, _colNumber: number) {
      cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
      cell.font = { size: 8, bold: true,  name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
    });

    // Contenido del archivo
    let contador: number = 2;
    this.valeList.forEach(vale => {
      worksheet.addRow([vale.anno, vale.nombreComercial, vale.id, vale.documento, vale.tipo, vale.bolsa, this.pipe.transform(vale.inicio, 'dd/MM/yyyy'), 
                        this.pipe.transform(vale.fin, 'dd/MM/yyyy'), vale.barra, this.numberPipe.transform(vale.total, '.2-2'), vale.tiendaUso, 
                        vale.nombreTienda, this.pipe.transform(vale.fechaUso, 'dd/MM/yyyy'), vale.redimido, vale.anulado, vale.razonSocial, vale.canal]);

      worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
        cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
        cell.font = { size: 8,  name: 'Arial' };
      });

      contador++;
    })
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Vales_' + this.pipe.transform(new Date(), 'yyyyMMddHHmmss') + '.xlsx');
    });
  }

  public anularNoRedimidos(){
    if (this.tipoSelected.codigo === 'B') { //Id Bolsa
      if (!this.bolsa) {
        swal.fire('Advertencia!', 'Debe ingresar el Id Bolsa', 'warning');
        return;
      }

      swal.fire({
        title: '¿Está seguro de anular los vales No Redimidos de la bolsa?',
        html: 'Esta acción no se puede deshacer',
        showCancelButton: true,
        icon: 'question',
        confirmButtonText: `Aceptar`,
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
  
          this.valeService.anularNoRedimido(this.bolsa).subscribe(
            data => {
              this.spinner.hide();
              if(data){
                swal.fire('Éxito!', 'Se anularon los vales No Redimidos de la bolsa', 'success');  
                this.bolsa = '';          
              }
              else{
                swal.fire('Error!', 'Se produjo un error al intentar anular los vales No Redimidos de la bolsa', 'error');            
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
    else{
      swal.fire('Advertencia!', 'Debe seleccionar el Id Bolsa como filtro.', 'warning');
      return;
    }
  }

  public ampliarFecha(){
    if ((this.tipoSelected.codigo === 'B') || (this.tipoSelected.codigo === 'V')) { //Id Bolsa o Codigo Barra
      if ((this.tipoSelected.codigo === 'B') && (!this.bolsa)) {
        swal.fire('Advertencia!', 'Debe ingresar el Id Bolsa', 'warning');
        return;
      }
      if ((this.tipoSelected.codigo === 'V') && (!this.codigos || this.codigos.length === 0)) {
        swal.fire('Advertencia!', 'Debe ingresar el Código de Barra', 'warning');
        return;
      }
      let fecha : string = formatDate(this.vhasta, 'yyyyMMdd', 'en_US');
      let fechaHoy : string = formatDate(new Date(), 'yyyyMMdd', 'en_US');
      if(fecha <= fechaHoy){
        swal.fire('Advertencia!', 'Debe seleccionar una nueva fecha mayor a la de hoy.', 'warning');
        return;
      }
    

      if(this.tipoSelected.codigo === 'B'){ //Id bolsa
        swal.fire({
          title: '¿Está seguro de ampliar la fecha de todos los vales de la bolsa?',
          html: 'Esta acción no se puede deshacer',
          showCancelButton: true,
          icon: 'question',
          confirmButtonText: `Aceptar`,
          cancelButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.spinner.show();
    
            this.valeService.ampliarFechaIdBolsa(this.bolsa, fecha).subscribe(
              data => {
                this.spinner.hide();
                if(data){
                  swal.fire('Éxito!', 'Se amplió la fecha de todos los vales de la bolsa', 'success');                   
                  this.bolsa = '';
                }
                else{
                  swal.fire('Error!', 'Se produjo un error al intentar ampliar la fecha de todos los vales de la bolsa', 'error');            
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

      if(this.tipoSelected.codigo === 'V'){ //Codigo barra
        swal.fire({
          title: '¿Está seguro de ampliar la fecha de los vales?',
          html: 'Esta acción no se puede deshacer',
          showCancelButton: true,
          icon: 'question',
          confirmButtonText: `Aceptar`,
          cancelButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.spinner.show();
    
            let strCodigos : string = "'";
            this.codigos.forEach((codigo, index) => {
              if(index==0){
                strCodigos += codigo + "'"; //Primer código, sin coma
              }         
              else{
                strCodigos += ",'" + codigo + "'";
              }                  
            })
            strCodigos = strCodigos.replace(/(\r\n|\n|\r)/gm, "");
    
            this.valeService.ampliarFechaPorCodigo(strCodigos, fecha).subscribe(
              data => {            
                this.spinner.hide();
                if(data){
                  swal.fire('Éxito!', 'Se amplió la fecha de los vales', 'success');  
                  this.vhasta = new Date();
                  this.codigos = [];          
                }
                else{
                  swal.fire('Error!', 'Se produjo un error al ampliar la fecha de los vales', 'error');            
                }            
              },
              err => {
                this.spinner.hide();
                swal.fire('Error!', err.message.toString(), 'error');
              }
            );
          }
        });
      }      
    }
    else{
      swal.fire('Advertencia!', 'Debe seleccionar el Id Bolsa o Código de Barra como filtro.', 'warning');
      return;
    }    
  }

  public marcarNoRedimido(){
    if (this.tipoSelected.codigo === 'V') { //Codigo Barra
      if (!this.codigos || this.codigos.length === 0) {
        swal.fire('Advertencia!', 'Debe ingresar el Código de Barra.', 'warning');
        return;
      }
    }
    else{
      swal.fire('Advertencia!', 'Debe seleccionar el Código de Barra como filtro.', 'warning');
      return;
    }

    swal.fire({
      title: '¿Está seguro de cambiar el estado de los vales a No Redimido?',
      html: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: `Aceptar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        let strCodigos : string = "'";
        this.codigos.forEach((codigo, index) => {
          if(index==0){
            strCodigos += codigo + "'"; //Primer código, sin coma
          }         
          else{
            strCodigos += ",'" + codigo + "'";
          }                  
        })
        strCodigos = strCodigos.replace(/(\r\n|\n|\r)/gm, "");

        this.valeService.cambiarNoRedimido(strCodigos).subscribe(
          data => {            
            this.spinner.hide();
            if(data){
              swal.fire('Éxito!', 'Se cambió el estado de los vales a No Redimido', 'success');   
              this.codigos = [];         
            }
            else{
              swal.fire('Error!', 'Se produjo un error al cambiar el estado de los vales a No Redimido', 'error');            
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
}
