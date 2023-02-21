import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Banco } from '../entity/banco';
import { Empresa } from '../entity/empresa';
import { Tienda } from '../entity/tienda';
import { DepositoDto } from '../dto/deposito-dto';
import { CierreOtroMotivo } from '../entity/cierre-otro-motivo';
import { CierreOtroDto } from '../dto/cierre-otro-dto';
import { CierreDto } from '../dto/cierre-dto';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private urlEndPoint: string

  constructor(private http: HttpClient) {
      this.urlEndPoint = environment.urlCierre;
  }

  getEmpresas(): Observable<Empresa[]> {
      return this.http.get<Empresa[]>(`${this.urlEndPoint}/api/reporte/empresa`);
  }

  getTiendasPorEmpresa(idEmpresa: number, usuario: string): Observable<Tienda[]> {
    return this.http.get<Tienda[]>(`${this.urlEndPoint}/api/reporte/tienda/${idEmpresa}/${usuario}`);
  }

  getBancosPorEmpresa(idEmpresa: number): Observable<Banco[]> {
    return this.http.get<Banco[]>(`${this.urlEndPoint}/api/reporte/banco/${idEmpresa}`);
  }

  getCierreMotivos(): Observable<CierreOtroMotivo[]> {
    return this.http.get<CierreOtroMotivo[]>(`${this.urlEndPoint}/api/reporte/cierre-motivo`);
  }
  
  getBancosPorTienda(idEmpresa: number, idTienda: number): Observable<Banco[]> {
    return this.http.get<Banco[]>(`${this.urlEndPoint}/api/reporte/banco/${idEmpresa}/${idTienda}`);
  }

  getDepositosPorFecha(dto: DepositoDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/deposito/fecha`, dto);
  }

  getCierreOtraCuadraturaPorFecha(dto: CierreOtroDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/cierre-otra-cuadratura/fecha`, dto);
  }

  getCierreOtraCuadraturaAnuladosPorFecha(dto: CierreOtroDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/cierre-otra-cuadratura/anulacion/fecha`, dto);
  }

  getTableroControl(dto: CierreDto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/api/reporte/tablero-control`, dto);
  }

}
