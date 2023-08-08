import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CuponesOmnicanalService } from '../../services/cupones-omnicanal.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anular-cupon',
  templateUrl: './anular-cupon.component.html',
  styleUrls: ['./anular-cupon.component.css']
})
export class AnularCuponComponent implements OnInit {

  public Campanha: String = "Debe Seleccionar una campaña";
  public idCabecera: String;
  private urlEndPointOmnicanal: string;
  private urlLista: string;

  public cuponOmni: {};
  public Motivo: String;  
  constructor(public ref: DynamicDialogRef, 
              private router: Router,
              private dataCupones: CuponesOmnicanalService,
              private empresaService: EmpresaService,
              private authService: AuthService,
    public config: DynamicDialogConfig) { 
      this.urlEndPointOmnicanal = environment.urlOmnicanalA;  
      this.urlLista = environment.urlCarta;
    }

  ngOnInit(): void {
    this.TokenClient();
    console.log(this.config.data);
    if(this.config.data){
      this.Campanha = this.config.data.cdNombreCampanha;
      this.idCabecera = this.config.data.cdCodigoCuponCabecera.toString();
    }
  }  

  private getUsuario(): string {
    return this.authService.usuario.user.shortName;
  }

  public Confirmar(){
    this.isAuthenticated();
  }
  
  private isAuthenticated(): void {    
    if (this.dataCupones.isAuthenticated()) {      
      this.Anular();
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

  public Anular(){
    this.cuponOmni = {
      'codMarca':  this.empresaService.getEmpresaSeleccionada().idEmpresa.toString(),
      'nombreCampanha' : this.Campanha,
      'usuarioActualiza': this.getUsuario(),
      "idCabecera": this.idCabecera,
    }

    console.log(this.cuponOmni);

    this.ajaxQueryPost(`${this.urlEndPointOmnicanal}/anularcupon`, this.dataCupones.token, this.cuponOmni);  

    var ruta = `${this.urlLista}/AnularCampanha?Codigo=`+this.config.data.cdCodigoCuponCabecera + `&Motivo=` + this.Motivo;
    this.ajaxQueryPostSQL(ruta);  
  }

  public cancelar(): void {
    this.ref.close();
  }

  private ajaxQueryPost(urlEndPoint: string, token: string, data: any): any {
    let t_result!: any;
    $.ajax({
      url: urlEndPoint,
      async: false,
      type: 'POST',
      crossDomain: true,    
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
        Swal.fire(
          'Anulación Realizada',
          'Se anularón los cupones no redimidos',
          'success'
        ).then((result) => {
          if (result.isConfirmed) {
            this.ref.close();
            this.router.navigateByUrl('/home/cupon/lista-cupon-omnicanal');
          }
        })
        this.ref.close();
      },
      error: (error) => {
        console.log(error);
        
      }
    });
  }
}
