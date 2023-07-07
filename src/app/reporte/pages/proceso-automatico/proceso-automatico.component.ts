import { Component, OnInit, OnDestroy, AfterViewInit  ,ViewChild, ElementRef  } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProcesoAutomatico,TipoProceso } from '../../entity/procesoautomatico';
import { ReporteService } from '../../services/reporte.service';
import swal from 'sweetalert2';
import { DetalleProcesoAutomaticoComponent } from '../../components/detalle-procesoautomatico/detalle-procesoautomatico.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-proceso-automatico',
  templateUrl: './proceso-automatico.component.html',
  styleUrls: ['./proceso-automatico.component.css']
})
export class ProcesoAutomaticoComponent implements OnInit, OnDestroy, AfterViewInit    {
  public reporteTodo: ProcesoAutomatico[] = [];
  public reporteTemp: ProcesoAutomatico[] = [];
  public tipoProcesosList: TipoProceso[];
  public reporteSelected!: ProcesoAutomatico;
  public tipoProceso!:TipoProceso;
  private respuestaGab :number=0;
  public cantidadMap = {
    '=0': 'No existen transacciones',
    '=1': 'En total hay 1 transacción',
    'other': 'En total hay # transacciones'
  }

  private ref!: DynamicDialogRef;
  
  constructor(public spinner: NgxSpinnerService,
              private reporteService: ReporteService,
              private authService: AuthService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
    this.listaReportes();
  }
  ngAfterViewInit(): void {

  }

  CargarPagina(): void {

  }

  public onChangeTipoProceso(event: any): void {
    if(event !=null){
      this.tipoProceso=event.value;
    }
    this.reporteTemp = this.reporteTodo.filter(item => item.id_tipo_proceso === this.tipoProceso.id_tipo_proceso);
    this.reporteSelected = undefined;
  }

  private listaReportes(): void {
    this.spinner.show();
    this.reporteService.getListaProcesoAutomatico(0,0).subscribe(
      data => {
        this.reporteTodo =[];
        this.tipoProcesosList =[];
        this.reporteTemp =[];

        this.reporteTodo = data;

        this.tipoProcesosList = this.reporteTodo.filter((item, index, self) => {
          return index === self.findIndex(i => i.id_tipo_proceso === item.id_tipo_proceso && i.proceso === item.proceso);
        }).map(({ id_tipo_proceso, proceso }) => ({ id_tipo_proceso, proceso })).sort((a, b) => a.id_tipo_proceso - b.id_tipo_proceso);;
        
        if(this.respuestaGab==0){
          this.reporteTemp = data.filter(item => item.id_tipo_proceso === 0);
        }else{
          if(this.tipoProceso ==undefined){
            this.tipoProceso = this.tipoProcesosList[0];
          }
          this.reporteTemp = data.filter(item => item.id_tipo_proceso === this.tipoProceso.id_tipo_proceso);
        }
        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al listar las transacciones', 'error');
      }
    )
  }

  public detalleReporte(btn:number): void {
    if(btn==0){
      this.reporteSelected = new ProcesoAutomatico();
      this.reporteSelected.id_empresa=0
    }
    if((this.reporteSelected!=undefined && btn==1) || btn==0){
      this.ref = this.dialogService.open(DetalleProcesoAutomaticoComponent, {
        header: 'Detalle',
        width: '50%', 
        contentStyle: {"max-height": "500px", "overflow": "auto"},
        data: {data:this.reporteSelected, objprocesos:this.tipoProcesosList, EsNuevo:btn}
      });

      this.ref.onClose.subscribe((Val: number) => {
        this.respuestaGab=1;
        this.listaReportes();
      }); 

    }else{
      swal.fire('Advertencia', 'Debe seleccionar un registro', 'warning');
    }
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.destroy();
    }
  }

}
