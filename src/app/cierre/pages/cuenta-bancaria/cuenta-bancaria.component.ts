import { Component, OnInit } from '@angular/core';
import { CuentaBancaria } from '../../entity/cuenta-bancaria';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { forkJoin, Observable } from 'rxjs';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { CambioCuentaService } from '../../services/cambio-cuenta.service';
import { ReporteService } from '../../services/reporte.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditarCuentaComponent } from '../../components/editar-cuenta/editar-cuenta.component';
import { CuentaBancariasGeneral } from '../../entity/CuentaBancaria';
import { Empresa } from '../../entity/empresa';
@Component({
  selector: 'app-cuenta-bancaria',
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.css']
})
export class CuentaBancariaComponent implements OnInit {

  public SeleccionarCuenta: string = '0';
  public CuentasBancaria: CuentaBancariasGeneral[] = [];
  public CuentasBancariaTodo: CuentaBancariasGeneral[] = [];
  public CuentaSelected!: CuentaBancariasGeneral;
  public Tienda!: String;
  public TiendaValida: String = "";
  private ref!: DynamicDialogRef;
  public empresaList: Empresa[] = [];


  constructor(private spinner: NgxSpinnerService,
              private empresaService: EmpresaService,
              private cambioCuentaService: CambioCuentaService,
               private reporteService: ReporteService,
              private dialogService: DialogService  ) { }

  ngOnInit(): void {
    this.spinner.show();

    if(this.Tienda == undefined){
      this.TiendaValida = '';
    } else {
      this.TiendaValida = this.Tienda;
    }

    this.ListarCuentas(0);
    this.spinner.hide();
  }

  onRowSelect(event) {
    
  }

  
  public Buscar(){
    this.spinner.show();
    if(this.Tienda == undefined){
      this.TiendaValida = '';
    } else {
      this.TiendaValida = this.Tienda;
    }

    this.ListarCuentas(0);
    this.spinner.hide();
  }

  public ListarCuentas(IdCuenta: number){
    
    this.cambioCuentaService.getListaCuenta(IdCuenta).subscribe(
      CuentasTiendas2 => {
        this.CuentasBancariaTodo = CuentasTiendas2;
        this.CuentasBancaria = this.CuentasBancariaTodo;
      }
    )
  }

  public editarCuentaBancaria(): void {    
    if(this.CuentaSelected !== undefined && this.CuentaSelected !== null){
      this.ref = this.dialogService.open(EditarCuentaComponent, {
        header: `${this.CuentaSelected.empresa} - ${this.CuentaSelected.banco} - ${this.CuentaSelected.moneda}`,
        width: '50%',
        contentStyle: { "max-height": "360px", "overflow": "auto" },
        data: this.CuentaSelected
      });

      this.ref.onClose.subscribe((Val: number) => {
        this.ListarCuentas(0);
      });
    } else{
      swal.fire('Información', 'Seleccionar un registro', 'info');
    }
  }

  public nuevaCuentaBancaria(): void {
    this.ref = this.dialogService.open(EditarCuentaComponent, {
      header: `Nuevo registro`,
      width: '50%',
      contentStyle: { "max-height": "360px", "overflow": "auto" },
      data: null
    });

    this.ref.onClose.subscribe((Val: number) => {
      this.ListarCuentas(0);
    });
  }

  onKDownTienda(event: any) {
    const filtro = this.Tienda.toLowerCase();
    this.CuentasBancaria = this.CuentasBancariaTodo.filter(item => {
      const camposConcatenados = item.empresa.toLowerCase() +"-"+ item.empresa.toLowerCase();
      const camposConcatenados2 = item.banco.toLowerCase() +"-"+item.banco.toLowerCase();
      const camposConcatenados3 = item.numero.toLowerCase() +"-"+item.numero.toLowerCase();
      const camposConcatenados4 = item.cuentaContable.toLowerCase() +"-"+item.cuentaContable.toLowerCase();
      return camposConcatenados.includes(filtro)|| camposConcatenados2.includes(filtro) || camposConcatenados3.includes(filtro)|| camposConcatenados4.includes(filtro);
    });
  }
  public anularSolicitud(): void {
      if(this.CuentaSelected !== undefined && this.CuentaSelected !== null){
      /* if (!this.solicitudList) {
        swal.fire('Alerta!', 'Debe seleccionar una solicitud', 'warning');
        return;
      } */
  
     /*  if (this.solicitudSelected.estado !== 'P') {
        swal.fire('Alerta!', 'Sólo se pueden anular solicitudes que se encuentran como En Proceso', 'warning');
        return;
      } */
  
      swal.fire({
        title: `'¿Está seguro de elimnar el registro? El registro: ${this.CuentaSelected.empresa} - ${this.CuentaSelected.banco} - ${this.CuentaSelected.moneda}`,
        html: 'Esta acción no se puede deshacer',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Aceptar`,
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.cambioCuentaService.EliminarCuentaBancaria(this.CuentaSelected).subscribe(
            _data => {
              this.spinner.hide();
              this.ListarCuentas(0);
              swal.fire('Éxito!', 'Solicitud eliminada exitosamente!', 'success');
            },
            err => {
              this.spinner.hide();
              swal.fire(err.error.mensaje, err.error.error, 'error');
            }
          );
        }
      })
  
    } else{
      swal.fire('Información', 'Seleccionar un registro', 'info');
    }
  }
  


}
