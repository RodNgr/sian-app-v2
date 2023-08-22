import { Component, OnInit, Input } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CabValeVerde } from '../../entity/cabValeVerde';

import swal from 'sweetalert2';
import { CuponesOmnicanalService } from '../../services/cupones-omnicanal.service';
import { environment } from 'src/environments/environment';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { AuthService } from 'src/app/auth/services/auth.service';
//import { ListaCuponOmnicanalComponent } from '../../pages/lista-cupon-omnicanal/lista-cupon-omnicanal.component';
import * as $ from 'jquery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ampliar-fecha',
  templateUrl: './ampliar-fecha.component.html',
  styleUrls: ['./ampliar-fecha.component.css']
})
export class AmpliarFechaComponent implements OnInit {

  @Input() valores;

  public fecha: Date = new Date();
  public fin: Date = new Date();
  public Campanha: String = "Debe Seleccionar una campaña";
  public idCabecera: String;

  public vale!: CabValeVerde;
  private urlEndPointOmnicanal: string;
  private urlLista: string;
  public cuponOmni: {};
  constructor(public ref: DynamicDialogRef, 
              private dataCupones: CuponesOmnicanalService,
              private empresaService: EmpresaService,
              private authService: AuthService,
              private router: Router,
              //private listaCuponOmnicanalComponent: ListaCuponOmnicanalComponent,
              public config: DynamicDialogConfig) { 
                this.urlEndPointOmnicanal = environment.urlOmnicanalA;    
                this.urlLista = environment.urlCarta;
              }

  ngOnInit(): void {
    if(this.config.data){
      this.TokenClient();
      console.log(this.config.data);
      this.fecha = new Date(this.config.data.dtFecInicio);
      this.fin = new Date(this.config.data.dtFecFin);
      this.Campanha = this.config.data.cdNombreCampanha;
      this.idCabecera = this.config.data.cdCodigoCuponCabecera.toString();
      console.log(this.config.data);
    }
    // this.vale = this.config.data;
    //this.fecha = new Date(this.config.data.dtFecInicio);
  }

  private getUsuario(): string {
    return this.authService.usuario.user.shortName;
  }

  public Confirmar(){
    this.isAuthenticated();
  }

  private isAuthenticated(): void {    
    if (this.dataCupones.isAuthenticated()) {      
      this.ampliar();
    } else {      
      this.TokenClient();
    }

  }
  private TokenClient(): void {
    this.dataCupones.TokenClient().subscribe( resp => {
      setTimeout(() => {}, 200);  
    }, e => {
      console.error(e);
    })
  }

  public ampliar(): void {
    var fecinicio, fecfin;
    let mesInicio = this.fecha.getMonth() + 1;
    let mesFin = this.fin.getMonth() + 1;
    fecinicio = this.fecha.getFullYear() + "-" + mesInicio.toString().padStart(2, '0') + "-" + this.fecha.getDate().toString().padStart(2, '0') + " 00:00:00";
    fecfin = this.fin.getFullYear() + "-" + mesFin.toString().padStart(2, '0') + "-" + this.fin.getDate().toString().padStart(2, '0') + " 23:59:59";

    this.cuponOmni = {
      "fecInicio": fecinicio,
      "fecFin" : fecfin,
      "usuarioActualiza": this.getUsuario(),
      "nombreCampanha": this.Campanha,
      "idCabecera": this.idCabecera,
      "codMarca": this.empresaService.getEmpresaSeleccionada().idEmpresa.toString()
    }

    console.log(this.cuponOmni);

    this.ajaxQueryPost2(`${this.urlEndPointOmnicanal}/actualizarcupon`, this.dataCupones.token, this.cuponOmni);  

    var ruta = `${this.urlLista}/ActualizarFecha?Codigo=`+this.config.data.cdCodigoCuponCabecera+`&dtFecInicio=`+ fecinicio+`&dtFecFin=`+fecfin ;
    this.ajaxQueryPostSQL(ruta);  
  }

  public cancelar(): void {
    this.ref.close();
  }

  private ajaxQueryPost2(urlEndPoint: string, token: string, data: any): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'POST',
      crossDomain: true,
      //dataType: 'jsonp',
      /* data: JSON.stringify({
        'codmarca': '1002'
      }), */
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
         'Authorization': 'Bearer ' + token
      },
      success: (result) => {
        console.log(result);
      },
      error: (error) => {
        console.log(error);
        
      }
    });
  }


  private ajaxQueryPostSQL(urlEndPoint: string): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'POST',
      crossDomain: true,      
      contentType: 'application/json',
      headers: {
         "Access-Control-Allow-Origin" : "*",
         "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
         "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      },
      success: (result) => {
        swal.fire(
          'Ampliar Fecha',
          'Se Actualizo el registro satisfactoriamente',
          'success'
        ).then((result) => {
          if (result.isConfirmed) {
            this.ref.close();
            this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
            //this.listaCuponOmnicanalComponent.Buscar();
          }
        })
        this.ref.close(1);
      },
      error: (error) => {
        console.log(error);
        
      }
    });
  }

}
