import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProcesoAutomatico, TipoProceso } from '../../entity/procesoautomatico';
import { ReporteService } from '../../../cierre/services/reporte.service';
import { ReporteService as ReporteGuardaService} from '../../../reporte/services/reporte.service';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { Empresa } from '../../../cierre/entity/empresa';
import { Tienda } from '../../../cierre/entity/tienda';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-procesoautomatico',
  templateUrl: './detalle-procesoautomatico.component.html',
  styleUrls: ['./detalle-procesoautomatico.component.css']
})
export class DetalleProcesoAutomaticoComponent implements OnInit {

  public reporte: ProcesoAutomatico = new ProcesoAutomatico();
  public empresaList: Empresa[] = [];
  public empresaSeleccionada!: Empresa;
  public tiendaList: Tienda[] = [];
  public enableDropDownTienda!: boolean;
  public tiendasSeleccionadas!: Tienda;
  public tipoProcesosList: TipoProceso[];
  public lan: string[] = ['sql'];
  public objProcAuto!: ProcesoAutomatico;
  public tipoProcesoSeleccionadas!:TipoProceso;
  public boSoloRealPlaza:boolean=false;
  public boEsNuevo:number=0;//0 es nuevo
  public Estados: any = [
    { Id: "A", Desc:"Activo" },
    { Id: "I", Desc:"Inactivo" },
  ];
  public EstadosSeleccionada!:any;

  constructor(private spinner: NgxSpinnerService,
              private reporteService: ReporteService,private reporteGuardaService: ReporteGuardaService,
              public ref: DynamicDialogRef,
              private authService: AuthService,
              private empresaService: EmpresaService,
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.objProcAuto = this.config.data.data;
    this.EstadosSeleccionada=this.Estados.filter(item => item.Id === this.objProcAuto.estado)[0];

    this.boEsNuevo = this.config.data.EsNuevo;
    this.tipoProcesosList = [];

    if(this.boEsNuevo==0){
      this.tipoProcesosList = this.config.data.objprocesos;
    }else{
      this.tipoProcesosList.push(this.config.data.objprocesos.find(x=>x.id_tipo_proceso == this.objProcAuto.id_tipo_proceso));
    }
    this.tipoProcesoSeleccionadas = this.tipoProcesosList[0];
    this.GetEmpresa();

  }

  public cerrar(): void {
    this.ref.close();
  }

  public GetEmpresa() {
   
    this.reporteService.getEmpresas().subscribe(
      empresaList => {

        if(this.boEsNuevo == 0){
          this.empresaList = empresaList;
          this.empresaList.unshift({idEmpresa: 0, nombreComercial: 'TODOS', codigo: '0', nombre: '', empresaSap: 0});
          this.empresaSeleccionada = this.empresaList[0];
        }else{
          this.empresaList.push(empresaList.find(x=>x.idEmpresa == this.objProcAuto.id_empresa));
          this.empresaSeleccionada = this.empresaList[0];
        }

        this.onChangeEmpresa(); 
        this.onChangeEstado();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información de las empresas', 'error');
      }
    );

  }

  public onChangeEmpresa(): void {

    if (this.empresaSeleccionada.idEmpresa === 0) {
      this.enableDropDownTienda = false;

      this.tiendaList = [];
      this.addTiendaDefault();

      this.spinner.hide();
    } else {
      this.enableDropDownTienda = true;

      const promiseList:Observable<any>[] = [];
      promiseList.push(this.reporteService.getTiendasPorEmpresa(this.empresaSeleccionada.idEmpresa, this.authService.getUsuarioInterface()));

      this.spinner.show();
      forkJoin(promiseList).subscribe(
        response => {
         
          if(this.boEsNuevo == 0){
            this.tiendaList=response[0];
          }else{
            this.tiendaList.push(response[0].find(x=>x.tienda === this.objProcAuto.tienda));
          }

          this.addTiendaDefault();
          this.onChangeTipoProceso();
          this.spinner.hide();
        }, 
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al obtener la información', 'error');
        }
      )
    }
  }

  private addTiendaDefault() {
    if (this.empresaSeleccionada.idEmpresa === 0) {
      const tienda: Tienda = new Tienda(0, 'TODOS');
      this.tiendaList.push(tienda);
    }
    if(this.boEsNuevo == 0){

    }else{
      this.tiendasSeleccionadas = this.tiendaList[0];
    }
  }

  public onChangeTipoProceso(): void {
    if(this.tipoProcesoSeleccionadas.id_tipo_proceso==0){
      this.boSoloRealPlaza=false;
    }else{
      this.boSoloRealPlaza=true;
    }
  }
  
  public aceptar(): void {
    this.spinner.show();
    if (!this.empresaList) {
      swal.fire('Advertencia!', 'Debe seleccionar una empresa', 'warning');
      this.spinner.hide();
      return;
    }

    if (this.tiendasSeleccionadas == undefined ) {
      swal.fire('Advertencia!', 'Debe seleccionar una tienda', 'warning');
      this.spinner.hide();
      return;
    }

    if (!this.tipoProcesosList) {
      swal.fire('Advertencia!', 'Debe seleccionar un tipo de proceso', 'warning');
      this.spinner.hide();
      return;
    }

    if(this.boSoloRealPlaza){
    if (this.objProcAuto.ip_ftp == undefined) {
      swal.fire('Advertencia!', 'Debe ingresar Ip FTP', 'warning');
      this.spinner.hide();
      return;
    }

    if (this.objProcAuto.nu_puerto_ftp == undefined) {
      swal.fire('Advertencia!', 'Debe ingresar N° Puerto FTP', 'warning');
      this.spinner.hide();
      return;
    }

    if (this.objProcAuto.de_usuario_ftp == undefined) {
      swal.fire('Advertencia!', 'Debe ingresar usuario FTP', 'warning');
      this.spinner.hide();
      return;
    }
    if (this.objProcAuto.de_clave_ftp == undefined) {
      swal.fire('Advertencia!', 'Debe ingresar Clave FTP', 'warning');
      this.spinner.hide();
      return;
    }
    if (this.objProcAuto.de_prefijo == undefined) {
      swal.fire('Advertencia!', 'Debe ingresar Prefijo', 'warning');
      this.spinner.hide();
      return;
    }
    if (this.objProcAuto.id_store == undefined) {
      swal.fire('Advertencia!', 'Debe ingresar Id store', 'warning');
      this.spinner.hide();
      return;
    }
    if (this.objProcAuto.ftp_file_destino == undefined) {
      swal.fire('Advertencia!', 'Debe ingresar file destino', 'warning');
      this.spinner.hide();
      return;
    }

    if(this.tipoProcesoSeleccionadas.id_tipo_proceso==1){
      if (this.objProcAuto.id_mall == undefined) {
        swal.fire('Advertencia!', 'Debe ingresar Id Mall', 'warning');
        this.spinner.hide();
        return;
      }
      if (this.objProcAuto.nu_store == undefined) {
        swal.fire('Advertencia!', 'Debe ingresar Nu store', 'warning');
        this.spinner.hide();
        return;
      }
    }
    
  }
    if(!this.boSoloRealPlaza){
      if (this.objProcAuto.codigoinmueblerp == undefined) {
        swal.fire('Advertencia!', 'Debe ingresar Codigo Inmueble RP', 'warning');
        this.spinner.hide();
        return;
      }
      if (this.objProcAuto.codigoLocalrp == undefined) {
        swal.fire('Advertencia!', 'Debe ingresar Codigo Local RP', 'warning');
        this.spinner.hide();
        return;
      }
    }

    if(this.EstadosSeleccionada==undefined){
      this.objProcAuto.estado='A';
    } else {
      this.objProcAuto.estado=this.EstadosSeleccionada.Id;
    }

    this.objProcAuto.id_empresa=this.empresaSeleccionada.idEmpresa;
    this.objProcAuto.tienda=this.tiendasSeleccionadas.tienda;
    this.objProcAuto.id_tipo_proceso=this.tipoProcesoSeleccionadas.id_tipo_proceso;

    this.reporteGuardaService.addProcesoAutomatico(this.objProcAuto).subscribe(
      _response => {
        swal.fire('Éxito!', 'La operación se realizó satisfactoriamente', 'success');
        this.ref.close(1);
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al realizar la operación', 'error');
      }
    )
   
  }


  sanitizeInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const sanitizedValue = inputElement.value.replace(/\D/g, '');
    inputElement.value = sanitizedValue;
    this.objProcAuto.nu_puerto_ftp = Number(sanitizedValue);
  }
  public onChangeEstado(): void {


  }


}
