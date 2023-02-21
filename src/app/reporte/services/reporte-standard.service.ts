import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { environment } from 'src/environments/environment';
import { GrupoReporte } from '../entity/grupo-reporte';
import { Tienda } from '../entity/tienda';
import { TipoReporte } from '../entity/tipo-reporte';
import { TipoReporteParametro } from '../entity/tipo-reporte-parametro';
import { ReporteDto } from '../dto/reporte-dto';

@Injectable({
  providedIn: 'root'
})
export class ReporteStandardService {

  private urlEndPoint: string;

  constructor(private http: HttpClient,
              private empresaService: EmpresaService) {
    this.urlEndPoint = environment.urlReporte;
  }

  getAllGrupos(): Observable<GrupoReporte[]> {
    return this.http.get<GrupoReporte[]>(`${this.urlEndPoint}/api/reporte-standard/grupo`);
  }

  getTiposReporte(): Observable<TipoReporte[]> {
    return this.http.get<TipoReporte[]>(`${this.urlEndPoint}/api/reporte-standard/tipo`);
  }

  getTipoReportePorGrupo(idGrupoReporte: number): Observable<TipoReporte[]> {
    return this.http.get<TipoReporte[]>(`${this.urlEndPoint}/api/reporte-standard/tipo/${idGrupoReporte}`);
  }

  getParametrosPorTipoReporte(idGrupoReporte: number, idTipoReporte: number): Observable<TipoReporteParametro[]> {
    return this.http.get<TipoReporteParametro[]>(`${this.urlEndPoint}/api/reporte-standard/parametro/${idGrupoReporte}/${idTipoReporte}`);
  }

  getTiendasPorEmpresaSeleccionada(): Observable<Tienda[]> {
    const idEmpresa = this.empresaService.getEmpresaSeleccionada().idEmpresa;
    return this.http.get<Tienda[]>(`${this.urlEndPoint}/api/tienda/${idEmpresa}`);
  }

  generarReporte(reporteDto: ReporteDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte-standard/generar`, reporteDto);
  }

}
