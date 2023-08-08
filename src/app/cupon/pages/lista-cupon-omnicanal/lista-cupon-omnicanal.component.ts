import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { TipoCuponOmnicanal } from '../../entity/tipo-cupon-omnicanal';

import { ActualizarFechaCuponOmnicanalComponent } from '../../components/actualizar-fecha-cupon-omnicanal/actualizar-fecha-cupon-omnicanal.component';
import { CuponesOmnicanalService } from '../../services/cupones-omnicanal.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';

import swal from 'sweetalert2'
import { NgxSpinnerService } from 'ngx-spinner';

import * as $ from 'jquery';
import { CuponListaOmnicanal } from '../../entity/cuponListaOmnicanal';


import { environment } from 'src/environments/environment';
import { AmpliarFechaComponent } from '../../components/ampliar-fecha/ampliar-fecha.component';
import { AnularCuponComponent } from '../../components/anular-cupon/anular-cupon.component';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Console } from 'console';

@Component({
  selector: 'app-lista-cupon-omnicanal',
  templateUrl: './lista-cupon-omnicanal.component.html',
  styleUrls: ['./lista-cupon-omnicanal.component.css']
})
export class ListaCuponOmnicanalComponent implements OnInit {

  private ref!: DynamicDialogRef;
  public SeleccionarCupon: string = '0';

  public tipos: TipoCuponOmnicanal[] = [{ nombre: 'Activo', estado: true, codigo: 1 },
  { nombre: 'Inactivo', estado: false, codigo: 0 }]

  private urlEndPoint: string;
  private urlEndPointOmnicanal: string;
  private urlLista: string;
  private urlEndPointToken: string;

  private Hasta!: Date;
  private Desde!: Date;
  public visualizaExportar: boolean; 
  private Campanha!: string;
  private Validacion!: number;

  public Campanhas: CuponListaOmnicanal[] = [];
  public CampanhasSelected!: CuponListaOmnicanal;

  constructor(private router: Router,
    private dialogService: DialogService,
    private empresaService: EmpresaService,
    private dataCupones: CuponesOmnicanalService,
    private spinner: NgxSpinnerService) {
      this.urlEndPoint = environment.urlGenesys;
      this.urlEndPointOmnicanal = environment.urlOmnicanalA;    
      this.urlLista = environment.urlCarta;
      this.urlEndPointToken = environment.urlTstdrpApi;
      this.visualizaExportar = true;
    }

  ngOnInit(): void {
    this.SeleccionarCupon = '1';
    this.isAuthenticated();
  }

  public newVale(): void {
    var ruta = `${this.urlLista}/ValidarCreacion`;    
  
    this.ajaxQueryPostValida(ruta);

    if(this.Validacion == 1){
      sessionStorage.setItem('tipoOperacion', 'N');
      this.router.navigateByUrl('/home/cupon/cupon-omnicanal')
    } 
    else{
      swal.fire(
        'Alto',
        'Se debe crear una nueva campaña cada 30 minutos',
        'error'
      )
    }
    
  }

  public viewValeOmnicanal(): void {
    sessionStorage.setItem('tipoOperacion', 'V');
    sessionStorage.setItem('cupon-omnicanal', this.CampanhasSelected.cdCodigoCuponCabecera.toString());
    this.router.navigateByUrl('/home/cupon/cupon-omnicanal');
  }

  public actualizarFecha(): void {
    this.ref = this.dialogService.open(AmpliarFechaComponent, {
      header: '',
      width: '25%',
      contentStyle: { "max-height": "360px", "overflow": "auto" },
      data: this.CampanhasSelected
    });
  }

  public Buscar(){
    this.listarCupones();
  }

  public AnularCupon(): void {
    this.ref = this.dialogService.open(AnularCuponComponent, {
      header: '',
      width: '25%',
      contentStyle: { "max-height": "360px", "overflow": "auto" },
      data: this.CampanhasSelected
    });
  }

 

  public getCupones() {
    this.spinner.show();
    this.dataCupones.getDataCupones().subscribe((data: any) => {
      this.Campanhas = data.results;
      this.spinner.hide();
    });

  }

  

  private isAuthenticated(): void {
    this.spinner.show();
    if (this.dataCupones.isAuthenticated()) {
      this.dataCupones.TokenClient();
    }
    this.listarCupones();
    this.spinner.hide();
  }

  private listarCupones(): void {
    let desde, hasta,campana;
    if($('#Campanha').val() == undefined){
      campana = '';
    }
    else{
      campana = '=' +$('#Campanha').val();
    }
    if($('#Desde').val() == undefined){
      desde = '';
    }
    else{
      desde = '=' +$('#Desde').val();
    }
    if($('#Hasta').val() == undefined){
      hasta = '';
    }
    else{
      hasta = '=' +$('#Hasta').val();
    }
    const ruta = `${this.urlLista}/Cupones?Marca=` + 
      this.empresaService.getEmpresaSeleccionada().idEmpresa.toString() + 
      `&nombre` +  campana + `&fecini` + desde + `&fecfin` + 
      hasta+ `&estado=` + this.SeleccionarCupon;
    console.log(ruta);
    this.dataCupones.registrarLog('Omnicanal', 'Get Cupones', `Obtener cupones -> ${ruta}`);
    this.ajaxQueryPost(ruta, {});
  }

  private errorCredenciales(e: any): void {
    if (e.status == 401) {
      if (e.error.error_description == "User credentials have expired") {
        swal.fire('Su contraseña ha caducado', 'Se ha enviado un correo para que proceda con el cambio de contraseña', 'warning');
      }
    }
    swal.fire('Error en el logueo', e.message, 'error');
    this.dataCupones.removerToken();
    this.spinner.hide();
  }

  public exportXLS(): void {
    if (!this.CampanhasSelected) {
      swal.fire('Alerta!', 'Debe seleccionar una Campaña', 'warning');
      return;
    }

    this.spinner.show();

    this.dataCupones.getCupones(this.CampanhasSelected.cdCodigoCuponCabecera).subscribe(
      data => {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Cupones');
    
        worksheet.addRow(["Cupón","Nombre","Código"]);        
        worksheet.columns = [{ width: 20 }];
        
        worksheet.getRow(1).eachCell(function(cell: Cell, _colNumber: number) {
          cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
          cell.font = { size: 8, bold: true,  name: 'Arial' };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.fill = {type: 'pattern', pattern:'solid', fgColor:{argb:'CCCCCC'}};
        });
        
        // Contenido del archivo
        let contador: number = 2;
        data.forEach(vale => {
            worksheet.addRow([vale.cupon, vale.nombre, vale.codigo]);
    
            worksheet.getRow(contador).eachCell(function(cell: Cell, colNumber: number) {
            cell.border = {top: {style:'thin', color: {argb:'000000'}}, left: {style:'thin', color: {argb:'000000'}}, bottom: {style:'thin', color: {argb:'000000'}}, right: {style:'thin', color: {argb:'000000'}}};
            cell.font = { size: 8,  name: 'Arial' };
          });
    
            contador++;
          })
        
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Cupones' + this.CampanhasSelected.cdNombreCampanha + '.xlsx');
        });

        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        swal.fire(err.error.mensaje, err.error.error, 'error');
      }
    );
  }

  onRowSelect(event) {
    if(event.data.validacionDescarga == 'Procesado'){
      this.visualizaExportar = false;
    } else{
      this.visualizaExportar = true;
    }
    console.log(this.visualizaExportar);
  }

  private ajaxQueryPost(urlEndPoint: string, data: any): any {
    const payload = JSON.stringify(data);
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'POST',
      crossDomain: true,
      data: payload,
      contentType: 'application/json',
      success: (result) => {
        this.Campanhas = result;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.dataCupones.registrarLog('Omnicanal', 'Get Cupones', `Ajax Query Post -> ${payload}`);
        this.spinner.hide();
      }
    });
  }

  private ajaxQueryPostValida(urlEndPoint: string): any {
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'GET',
      crossDomain: true,
      contentType: 'application/json',
      success: (result) => {
        this.Validacion = result;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
        this.dataCupones.registrarLog('Omnicanal', 'Get Cupones', `Ajax Post Valida -> ${urlEndPoint}`);
      }
    });
  }
}