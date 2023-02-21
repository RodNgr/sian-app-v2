import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReporteFormatoComponent } from '../../components/reporte-formato/reporte-formato.component';
import { ReporteDto } from '../../dto/reporte-dto';
import { ReporteStandardService } from '../../services/reporte-standard.service';
import swal from 'sweetalert2';
import { Reporte } from '../../entity/reporte';
import { ReporteService } from '../../services/reporte.service';
import { GrupoReporte } from '../../entity/grupo-reporte';
import { TipoReporte } from '../../entity/tipo-reporte';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-lista-reporte',
  templateUrl: './lista-reporte.component.html',
  styleUrls: ['./lista-reporte.component.css']
})
export class ListaReporteComponent implements OnInit, OnDestroy {

  public reporteList: Reporte[] = [];

  public reporteSelected!: Reporte;

  private gruposReportes: GrupoReporte[] = [];

  private tiposReportes: TipoReporte[] = [];

  public isMobile: boolean = window.innerWidth < 641
  
  private ref!: DynamicDialogRef;

  public cantidadMap = {
    '=0': 'No existen reportes',
    '=1': 'En total hay 1 reporte',
    'other': 'En total hay # reportes'
  }

  constructor(private spinner: NgxSpinnerService,
              private dialogService: DialogService,
              private reporteService: ReporteService,
              private reporteStandardService: ReporteStandardService) { }

  ngOnInit(): void {
    this.spinner.show();

    const promiseList:Observable<any>[] = [];
    promiseList.push(this.reporteStandardService.getAllGrupos());
    promiseList.push(this.reporteStandardService.getTiposReporte());

    forkJoin(promiseList).subscribe(
      response => {
        this.gruposReportes = response[0];
        this.tiposReportes = response[1];
        this.spinner.hide();

        this.buscar();
      }, 
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información', 'error');
      }
    )
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.destroy();
    }
  }

  public buscar() {
    /*
    this.spinner.show();

    this.reporteService.getReportes().subscribe(
      reporteList => {
        this.reporteList = reporteList;

        this.reporteList.forEach(reporte => {
          this.gruposReportes.forEach(grupo => {
            if (reporte.idGrupoReporte === grupo.id) {
              reporte.deGrupoReporte = grupo.descripcion;
              return;
            }
          });

          this.tiposReportes.forEach(tipo => {
            if (reporte.idGrupoReporte === tipo.pk.idGrupoReporte && reporte.idTipoReporte === tipo.pk.idTipoReporte) {
              reporte.deTipoReporte = tipo.descripcion;
              return;
            }
          })
        });

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener el listado de reportes', 'error');
      }
    )
    */
  }

  public newReporteStandard() {
    this.ref = this.dialogService.open(ReporteFormatoComponent, {
      header: 'Reporte Standard',
      width: '50%', 
      contentStyle: {"max-height": "500px", "overflow": "auto"},
    });

    this.ref.onClose.subscribe((reporteDto: ReporteDto) => {
      if (reporteDto) {
        this.spinner.show();

        this.reporteStandardService.generarReporte(reporteDto).subscribe(
          _rpta => {
            this.spinner.hide();
            this.buscar();
          }, 
          _err => {
            this.spinner.hide();
            swal.fire('Error', 'Problemas al generar el reporte', 'error');
          }
        )
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
      this.isMobile = window.innerWidth < 641;
  }
  
}
