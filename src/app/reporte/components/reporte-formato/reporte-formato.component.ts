import { Component, OnInit } from '@angular/core';
import { GrupoReporte } from '../../entity/grupo-reporte';
import { TipoReporte } from '../../entity/tipo-reporte';
import { ReporteStandardService } from '../../services/reporte-standard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { AuthService } from '../../../auth/services/auth.service';
import { TipoReporteParametro } from '../../entity/tipo-reporte-parametro';
import { ParamDto } from '../../dto/param-dto';
import { EmpresaService } from '../../../shared/services/empresa.service';
import { Tienda } from '../../../interfaz/entity/tienda';
import { Observable, forkJoin } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReporteDto } from '../../dto/reporte-dto';

@Component({
  selector: 'app-reporte-formato',
  templateUrl: './reporte-formato.component.html',
  styleUrls: ['./reporte-formato.component.css']
})
export class ReporteFormatoComponent implements OnInit {

  public grupoReporteSelected!: GrupoReporte;  
  
  public tipoReporteSelected: TipoReporte = new TipoReporte();

  public grupoReporteList: GrupoReporte[] = [];

  public tipoReporteList: TipoReporte[] = [];

  public parametros: TipoReporteParametro[] = [];

  public valores: ParamDto[] = [];

  public tiendaList: Tienda[] = [];

  constructor(private spinner: NgxSpinnerService,
              private authService: AuthService,
              public empresaService: EmpresaService,
              private reporteService: ReporteStandardService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.spinner.show();

    const promiseList:Observable<any>[] = [];
    promiseList.push(this.reporteService.getAllGrupos());
    promiseList.push(this.reporteService.getTiendasPorEmpresaSeleccionada());

    forkJoin(promiseList).subscribe(
      response => {
        this.grupoReporteList = response[0];
        this.tiendaList = response[1];
        this.spinner.hide();
      }, 
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener la información', 'error');
      }
    )
  }

  private clear(limpiarTipoReporte: boolean) {
    if (limpiarTipoReporte) {
      this.tipoReporteSelected = new TipoReporte();
    }

    this.parametros = [];
    this.valores = [];
  }

  public loadTipoReporte() {
    this.tipoReporteList = [];
    this.clear(true);

    if (this.grupoReporteSelected) {
      this.spinner.show();

      this.reporteService.getTipoReportePorGrupo(this.grupoReporteSelected.id).subscribe(
        tipoReporteList => {
          tipoReporteList.forEach(tipo => {
            if (this.authService.hasRole(tipo.permiso)) {
              this.tipoReporteList.push(tipo);
            }
          });

          this.spinner.hide();
        },
        _err => {
          this.spinner.hide();
          swal.fire('Error', 'Problemas al obtener la información de los tipos de reportes', 'error');
        }     
      );
    }
  }

  public onChangeTipoReporte() {
    this.clear(false);

    if (!this.tipoReporteSelected) {
      return;
    }

    if (!this.tipoReporteSelected.descripcion) {
      return;
    }

    this.spinner.show();

    this.reporteService.getParametrosPorTipoReporte(this.tipoReporteSelected.pk.idGrupoReporte, this.tipoReporteSelected.pk.idTipoReporte).subscribe(
      parametros => {
        this.parametros = parametros;

        parametros.forEach(p => {
          let dto = new ParamDto();
          dto.idParametro = p.pk.idTipoReporteParametro;
          dto.tiParametro = p.tipo;
          dto.deParametro = p.variable;
          this.valores.push(dto);
        });

        this.spinner.hide();
      },
      _err => {
        this.spinner.hide();
        swal.fire('Error', 'Problemas al obtener los parámetros', 'error');
      }
    )
  }

  public onSelectCompanies(event: any, tipoParametro: TipoReporteParametro) {
    console.log(event);
  }

  public onSelectStores(event: any, tipoParametro: TipoReporteParametro) {
    this.valores.forEach(v => {
      if (v.idParametro === tipoParametro.pk.idTipoReporteParametro) {
        v.value = event.value;
      }
    });
  }

  public onSelectDate(event: any, tipoParametro: TipoReporteParametro) {
    this.valores.forEach(v => {
      if (v.idParametro === tipoParametro.pk.idTipoReporteParametro) {
        v.value = event;
      }
    });
  }

  public onSelectNumber(event: any, tipoParametro: TipoReporteParametro) {
   this.valores.forEach(v => {
      if (v.idParametro === tipoParametro.pk.idTipoReporteParametro) {
        v.value = event;
      }
    });
  }

  public cancelar() {
    this.ref.close();
  }

  public aceptar() {
    let valido: boolean = true;

    if (this.valores.length === 0) {
      swal.fire({title:'Alerta!', html: 'Debe seleccionar un reporte', icon: 'warning', target: 'msg', backdrop: 'false'});
      return;
    }

    this.valores.forEach(v => {
      if (!v.value || v.value.length === 0) {
        valido = false;
      }
    })

    if (!valido) {
      swal.fire({title:'Alerta!', html: 'Falta ingresar información para uno de los parámetros del reporte', icon: 'warning', target: 'msg', backdrop: 'false'});
      return;
    }

    this.ref.close(this.buildReporteDto());
  }

  private buildReporteDto(): ReporteDto {
    const reporteDto: ReporteDto = new ReporteDto();
    const parametros: ParamDto[] = [];

    reporteDto.idGrupoReporte = this.tipoReporteSelected.pk.idGrupoReporte;
    reporteDto.idTipoReporte = this.tipoReporteSelected.pk.idTipoReporte;
    reporteDto.idUsuario = this.authService.usuario.username;

    this.valores.forEach(v => {
      let p: ParamDto = new ParamDto();
      p.idParametro = v.idParametro;
      p.tiParametro = v.tiParametro;
      p.deParametro = v.deParametro;

      if (v.tiParametro === 'T' || v.tiParametro === 'X') {
        reporteDto.tiendas.push(...v.value);
        p.value = "";

        parametros.push(p);
      } else if (v.tiParametro !== 'C') {
        p.value = v.value;

        parametros.push(p);
      }
    });

    reporteDto.parametros = parametros;

    console.log(reporteDto);

    return reporteDto;
  }

}
